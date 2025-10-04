/**
 * DEV ONLY: Reset credits for testing
 * Delete this file before production!
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateStripeCustomer } from "@/lib/stripe";
import { stripe } from "@/lib/stripe";
import { resetRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Reset preview rate limit
    resetRateLimit(ip);

    const { userId } = await auth();

    if (!userId) {
      // For anonymous users, just reset rate limit
      return NextResponse.json({
        success: true,
        message: "Preview rate limit reset successfully",
      });
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

    // Reset metadata to initial state
    await stripe.customers.update(customer.id, {
      metadata: {
        credits: "0",
        total_gens: "0",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Credits and preview rate limit reset successfully",
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error resetting credits:", error);
    return NextResponse.json(
      { error: "Failed to reset credits" },
      { status: 500 }
    );
  }
}
