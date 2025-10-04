/**
 * API route to create Stripe Checkout session for purchasing credits.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Validate price ID
    const validPriceIds = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_1,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_5,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_10,
    ];

    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
