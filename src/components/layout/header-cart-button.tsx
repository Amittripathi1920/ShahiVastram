"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";

export function HeaderCartButton() {
  const { itemCount } = useCart();

  return (
    <Button asChild size="sm" className="shrink-0">
      <Link href="/cart" aria-label={`Open cart with ${itemCount} items`}>
        <ShoppingBag aria-hidden="true" className="size-4" />
        Cart ({itemCount})
      </Link>
    </Button>
  );
}
