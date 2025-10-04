"use client";

/**
 * CreditManager Component
 *
 * Displays user's credit balance and provides purchase options for credit packs.
 * Integrates with Stripe Checkout for payments.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface CreditData {
  credits: number;
  totalGenerations: number;
  lastGeneratedAt?: string;
}

const CREDIT_PACKS = [
  {
    id: "1",
    name: "1 Token",
    price: "$5 CAD",
    credits: 1,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_1!,
  },
  {
    id: "5",
    name: "5 Tokens",
    price: "$20 CAD",
    credits: 5,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_5!,
    badge: "Save 20%",
  },
  {
    id: "10",
    name: "10 Tokens",
    price: "$35 CAD",
    credits: 10,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEN_10!,
    badge: "Best Value",
  },
];

export function CreditManager() {
  const { isSignedIn } = useUser();
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchCredits();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (priceId: string) => {
    setPurchasing(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Failed to start purchase");
    } finally {
      setPurchasing(null);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Your Credits
        </CardTitle>
        <CardDescription>
          Purchase credits to generate high-resolution images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Available Credits</p>
            <p className="text-3xl font-bold">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                credits?.credits || 0
              )}
            </p>
          </div>
          {!loading && credits && credits.totalGenerations > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Generated</p>
              <p className="text-xl font-semibold">{credits.totalGenerations}</p>
            </div>
          )}
        </div>

        {/* Purchase Options */}
        <div className="space-y-2">
          <p className="font-medium">Buy More Credits</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CREDIT_PACKS.map((pack) => (
              <Button
                key={pack.id}
                variant="outline"
                className="h-auto flex-col items-start p-4 relative"
                onClick={() => handlePurchase(pack.priceId)}
                disabled={purchasing !== null}
              >
                {pack.badge && (
                  <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    {pack.badge}
                  </span>
                )}
                <span className="text-lg font-bold">{pack.name}</span>
                <span className="text-sm text-muted-foreground">{pack.price}</span>
                {purchasing === pack.priceId && (
                  <Loader2 className="h-4 w-4 animate-spin mt-2" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
