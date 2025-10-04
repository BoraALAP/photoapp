/**
 * API route for paid generation with credit deduction.
 * Validates credits, decrements, and calls NB-G2.5 for high-quality images.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateStripeCustomer, decrementCredit } from "@/lib/stripe";
import { generateImages } from "@/lib/nb-gemini";
import { getPreset } from "@/lib/presets";
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

    // Convert photo to base64
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoBase64 = `data:${photoFile.type};base64,${photoBuffer.toString("base64")}`;

    // Create hash for audit
    const hash = crypto
      .createHash("sha256")
      .update(photoBuffer)
      .digest("hex")
      .substring(0, 16);

    // Attempt to decrement credit atomically
    const success = await decrementCredit(
      customer.id,
      presetId,
      hash,
      photoBuffer.length
    );

    if (!success) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Load reference images if needed
    let referenceImages: string[] | undefined;
    if (preset.requiresRefs) {
      try {
        const ref1Path = path.join(process.cwd(), "public/refs/withus_guyA.jpg");
        const ref2Path = path.join(process.cwd(), "public/refs/withus_guyB.jpg");

        const ref1Buffer = await readFile(ref1Path);
        const ref2Buffer = await readFile(ref2Path);

        referenceImages = [
          `data:image/jpeg;base64,${ref1Buffer.toString("base64")}`,
          `data:image/jpeg;base64,${ref2Buffer.toString("base64")}`,
        ];
      } catch (error) {
        console.error("Error loading reference images:", error);
        // Continue without refs - the generation may still work
      }
    }

    // Generate images with NB-G2.5
    const result = await generateImages({
      baseImage: photoBase64,
      referenceImages,
      prompts: preset.prompts,
      quality: "high",
    });

    return NextResponse.json({
      success: true,
      images: result.images,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
