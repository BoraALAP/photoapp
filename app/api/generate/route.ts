/**
 * API route for paid generation with credit deduction.
 * Validates credits, decrements, and calls NB-G2.5 for images or Veo 3.1 for videos.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateStripeCustomer, decrementCredit, decrementVideoCredit } from "@/lib/stripe";
import { generateImages, generateVideo } from "@/lib/nb-gemini";
import { getPreset } from "@/lib/presets";
import { watermarkAndDownscale } from "@/lib/watermark";
import crypto from "crypto";
import { readFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const photoFile = formData.get("photo") as File;
    const presetId = formData.get("presetId") as string;

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

    // Get user's email from Clerk
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "No email address found" },
        { status: 400 }
      );
    }

    const email = clerkUser.primaryEmailAddress.emailAddress;

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(email);

    // Check if this is a free generation (first one)
    const { getCustomerCredits } = await import("@/lib/stripe");
    const creditInfo = await getCustomerCredits(customer.id);
    const isFreeGeneration = creditInfo.total_gens === 0;

    // Convert photo to base64
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoBase64 = `data:${photoFile.type};base64,${photoBuffer.toString("base64")}`;

    // Create hash for audit
    const hash = crypto
      .createHash("sha256")
      .update(photoBuffer)
      .digest("hex")
      .substring(0, 16);

    // Attempt to decrement credit atomically based on preset type
    const isVideoPreset = preset.type === 'video';
    const success = isVideoPreset
      ? await decrementVideoCredit(customer.id, presetId, hash, photoBuffer.length)
      : await decrementCredit(customer.id, presetId, hash, photoBuffer.length);

    if (!success) {
      return NextResponse.json(
        {
          error: `Insufficient ${isVideoPreset ? 'video' : 'image'} credits`,
          creditType: isVideoPreset ? 'video' : 'image'
        },
        { status: 402 }
      );
    }

    // Load reference images if needed
    let referenceImages: string[] | undefined;
    if (preset.requiresRefs) {
      try {
        // Load different reference images based on preset
        if (presetId === "ilacSceneMatch") {
          const ref1Path = path.join(process.cwd(), "public/refs/ilac1.jpg");
          const ref2Path = path.join(process.cwd(), "public/refs/ilac2.jpg");
          const ref3Path = path.join(process.cwd(), "public/refs/ilac3.jpg");
          const ref4Path = path.join(process.cwd(), "public/refs/ilac4.jpg");

          const ref1Buffer = await readFile(ref1Path);
          const ref2Buffer = await readFile(ref2Path);
          const ref3Buffer = await readFile(ref3Path);
          const ref4Buffer = await readFile(ref4Path);

          referenceImages = [
            `data:image/jpeg;base64,${ref1Buffer.toString("base64")}`,
            `data:image/jpeg;base64,${ref2Buffer.toString("base64")}`,
            `data:image/jpeg;base64,${ref3Buffer.toString("base64")}`,
            `data:image/jpeg;base64,${ref4Buffer.toString("base64")}`,
          ];
        } else {
          // Default to "With Us" preset references
          const ref1Path = path.join(process.cwd(), "public/refs/withus_guyA.jpg");
          const ref2Path = path.join(process.cwd(), "public/refs/withus_guyB.jpg");

          const ref1Buffer = await readFile(ref1Path);
          const ref2Buffer = await readFile(ref2Path);

          referenceImages = [
            `data:image/jpeg;base64,${ref1Buffer.toString("base64")}`,
            `data:image/jpeg;base64,${ref2Buffer.toString("base64")}`,
          ];
        }
      } catch (error) {
        console.error("Error loading reference images:", error);
        // Continue without refs - the generation may still work
      }
    }

    // Generate content based on preset type
    if (isVideoPreset) {
      // Video generation: use first prompt only, generates 1 video
      const result = await generateVideo({
        baseImage: photoBase64,
        prompt: preset.prompts[0],
      });

      // Note: Videos are already watermarked by Veo 3.1 using SynthID
      // We return the video as-is without additional watermarking
      return NextResponse.json({
        success: true,
        videos: [result.videoUrl],
        metadata: result.metadata,
        isFreeGeneration,
        type: 'video',
      });
    } else {
      // Image generation: use all prompts, generates 4 images
      const result = await generateImages({
        baseImage: photoBase64,
        referenceImages,
        prompts: preset.prompts,
        quality: "high",
      });

      // Watermark all generated images
      // Free users: watermark + downscale to 768px
      // Paid users: watermark only, full size
      const watermarkedImages = await Promise.all(
        result.images.map((img) => watermarkAndDownscale(img, isFreeGeneration))
      );

      return NextResponse.json({
        success: true,
        images: watermarkedImages,
        metadata: result.metadata,
        isFreeGeneration,
        type: 'image',
      });
    }
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
