/**
 * Stripe webhook handler for processing checkout.session.completed events.
 * Increments customer credits based on purchased quantity.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe, incrementCredits } from "@/lib/stripe";
import { getPricingByPriceId } from "@/lib/pricing";
import Stripe from "stripe";

console.log("✅ Stripe webhook route loaded");

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  console.log("Webhook event received:", event.type);

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Processing checkout session:", session.id);

    try {
      // Get customer ID
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      console.log("Customer ID:", customerId);

      if (!customerId) {
        console.error("No customer ID in checkout session");
        return NextResponse.json(
          { error: "No customer ID" },
          { status: 400 }
        );
      }

      // Get line items to determine credit amount
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 100 }
      );

      console.log("Line items:", lineItems.data.length);

      let totalCredits = 0;

      for (const item of lineItems.data) {
        const priceId = typeof item.price === "string" ? item.price : item.price?.id;
        const quantity = item.quantity || 0;

        console.log("Processing line item:", { priceId, quantity });

        // Get pricing option from centralized config
        if (priceId) {
          const pricingOption = getPricingByPriceId(priceId);
          if (pricingOption) {
            totalCredits += pricingOption.credits * quantity;
            console.log(`Matched ${pricingOption.label}: ${pricingOption.credits} credits`);
          } else {
            console.log("No price match found for:", priceId);
          }
        }
      }

      console.log("Total credits to add:", totalCredits);

      if (totalCredits > 0) {
        await incrementCredits(customerId, totalCredits, event.id);
        console.log(
          `✅ Added ${totalCredits} credits to customer ${customerId} from event ${event.id}`
        );
      } else {
        console.warn("⚠️ No credits to add");
      }

      return NextResponse.json({ received: true, credits: totalCredits });
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      return NextResponse.json(
        { error: "Processing failed" },
        { status: 500 }
      );
    }
  }

  console.log("Event type not handled:", event.type);
  return NextResponse.json({ received: true });
}
