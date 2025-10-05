/**
 * Centralized pricing configuration.
 * Update prices here and they will reflect across the entire app.
 */

export interface PricingOption {
  id: string;
  label: string;
  price: string;
  priceId: string | undefined;
  credits: number;
}

export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "gen_5",
    label: "5 Generation",
    price: "$2.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_1,
    credits: 5,
  },
  {
    id: "gen_10",
    label: "10 Generation",
    price: "$4.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_5,
    credits: 10,
  },
  {
    id: "gen_25",
    label: "25 Generation",
    price: "$9.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_10,
    credits: 25,
  },
];

/**
 * Get pricing option by ID
 */
export function getPricingOption(id: string): PricingOption | undefined {
  return PRICING_OPTIONS.find((option) => option.id === id);
}

/**
 * Get pricing option by price ID
 */
export function getPricingByPriceId(priceId: string): PricingOption | undefined {
  return PRICING_OPTIONS.find((option) => option.priceId === priceId);
}
