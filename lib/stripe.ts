/**
 * Stripe utility functions for credit management via Customer Metadata.
 * All credit tracking happens in Stripe metadata - no database needed.
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export interface CreditMetadata {
  credits: number;
  total_gens: number;
  last_gen_at?: string;
  last_preset?: string;
  last_event_id?: string;
  last_bytes?: string;
  last_hash?: string;
}

// Simple in-memory mutex per customer
const customerLocks = new Map<string, Promise<void>>();

async function withLock<T>(
  customerId: string,
  fn: () => Promise<T>
): Promise<T> {
  while (customerLocks.has(customerId)) {
    await customerLocks.get(customerId);
  }

  let resolve: () => void;
  const lock = new Promise<void>((r) => (resolve = r));
  customerLocks.set(customerId, lock);

  try {
    return await fn();
  } finally {
    customerLocks.delete(customerId);
    resolve!();
  }
}

export async function getOrCreateStripeCustomer(
  email: string
): Promise<Stripe.Customer> {
  // Search for existing customer
  const existing = await stripe.customers.list({ email, limit: 1 });

  if (existing.data.length > 0) {
    return existing.data[0];
  }

  // Create new customer with 5 free credits
  return await stripe.customers.create({
    email,
    metadata: {
      credits: "5",
      total_gens: "0",
    },
  });
}

export async function getCustomerCredits(
  customerId: string
): Promise<CreditMetadata> {
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    throw new Error("Customer has been deleted");
  }

  const credits = parseInt(customer.metadata.credits || "0");
  const total_gens = parseInt(customer.metadata.total_gens || "0");

  return {
    credits,
    total_gens,
    last_gen_at: customer.metadata.last_gen_at,
    last_preset: customer.metadata.last_preset,
    last_event_id: customer.metadata.last_event_id,
    last_bytes: customer.metadata.last_bytes,
    last_hash: customer.metadata.last_hash,
  };
}

export async function incrementCredits(
  customerId: string,
  amount: number,
  eventId: string
): Promise<void> {
  await withLock(customerId, async () => {
    const current = await getCustomerCredits(customerId);
    const newCredits = current.credits + amount;

    await stripe.customers.update(customerId, {
      metadata: {
        credits: newCredits.toString(),
        total_gens: current.total_gens.toString(),
        last_event_id: eventId,
      },
    });
  });
}

export async function decrementCredit(
  customerId: string,
  presetId: string,
  hashSignature: string,
  approxBytes: number
): Promise<boolean> {
  return await withLock(customerId, async () => {
    // Re-read to ensure atomicity
    const current = await getCustomerCredits(customerId);

    console.log("Credit check:", {
      customerId,
      currentCredits: current.credits,
      totalGens: current.total_gens,
    });

    // Check if user has credits
    if (current.credits <= 0) {
      console.log("Insufficient credits");
      return false;
    }

    // Decrement credits
    const newCredits = current.credits - 1;
    const newTotalGens = current.total_gens + 1;

    console.log("Updating credits:", {
      newCredits,
      newTotalGens,
    });

    await stripe.customers.update(customerId, {
      metadata: {
        credits: newCredits.toString(),
        total_gens: newTotalGens.toString(),
        last_gen_at: new Date().toISOString(),
        last_preset: presetId,
        last_bytes: approxBytes.toString(),
        last_hash: hashSignature,
      },
    });

    return true;
  });
}
