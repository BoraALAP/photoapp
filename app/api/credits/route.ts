/**
 * API route to check current user's credit balance from Stripe metadata.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateStripeCustomer, getCustomerCredits } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get credit metadata
    const creditData = await getCustomerCredits(customer.id);

    return NextResponse.json({
      customerId: customer.id,
      free_credits: creditData.free_credits,
      image_credits: creditData.image_credits,
      video_credits: creditData.video_credits,
      total_credits: creditData.free_credits + creditData.image_credits,
      total_gens: creditData.total_gens,
      lastGeneratedAt: creditData.last_gen_at,
      lastPreset: creditData.last_preset,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
