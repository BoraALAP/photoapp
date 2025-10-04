/**
 * API route for anonymous preview generation.
 * No authentication required, but rate-limited and watermarked.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImages } from "@/lib/nb-gemini";
import { watermarkAndDownscale, createPreviewReceipt } from "@/lib/watermark";
import { getPreset } from "@/lib/presets";
import { checkRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Daily preview limit reached. Sign up for unlimited generations!" },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const photoFile = formData.get("photo") as File;
    const presetId = formData.get("presetId") as string;
    // TODO: Verify CAPTCHA token here

    if (!photoFile || !presetId) {
      return NextResponse.json(
        { error: "Photo and preset ID are required" },
        { status: 400 }
      );
    }

    const preset = getPreset(presetId);
    if (!preset) {
      return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
    }

    // "With Us" preset not available for preview
    if (preset.requiresRefs) {
      return NextResponse.json(
        { error: "This preset requires a paid account" },
        { status: 403 }
      );
    }

    // Convert photo to base64
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoBase64 = `data:${photoFile.type};base64,${photoBuffer.toString("base64")}`;

    // Create hash for audit
    const hash = crypto
      .createHash("sha256")
      .update(photoBuffer)
      .digest("hex")
      .substring(0, 16);

    // Generate images with NB-G2.5 (low quality)
    const result = await generateImages({
      baseImage: photoBase64,
      prompts: preset.prompts,
      quality: "low",
    });

    // Watermark and downscale all images
    const watermarkedImages = await Promise.all(
      result.images.map((img) => watermarkAndDownscale(img))
    );

    // Create signed receipt
    const receipt = await createPreviewReceipt({
      ip: crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16),
      presetId,
      timestamp: new Date().toISOString(),
      hash,
    });

    return NextResponse.json({
      success: true,
      images: watermarkedImages,
      receipt,
      message: "Preview generated! Sign up for full-resolution images.",
    });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { error: "Preview generation failed" },
      { status: 500 }
    );
  }
}
