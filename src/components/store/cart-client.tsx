"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

export function CartClient() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (!items.length) {
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <h2 className="text-3xl font-semibold">Your cart is empty.</h2>
          <p className="text-muted-foreground">Add a few standout pieces to continue to checkout.</p>
          <Button asChild className="mx-auto w-fit">
            <Link href="/products">Explore Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{item.category}</p>
                <h3 className="text-2xl font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-border bg-white">
                  <button
                    type="button"
                    aria-label={`Decrease quantity for ${item.name}`}
                    className="rounded-l-full px-3 py-2 transition-colors hover:bg-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </button>
                  <span className="min-w-10 px-2 text-center tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity for ${item.name}`}
                    className="rounded-r-full px-3 py-2 transition-colors hover:bg-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <p className="min-w-24 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Order Summary</p>
            <div className="flex items-center justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shipping and taxes are calculated during checkout.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
