"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/lib/types";

export function AddToCartButton({
  product,
  className
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <Button className={cn(className)} onClick={() => addItem(product)}>
      <ShoppingBag aria-hidden="true" className="size-4" />
      Add to Cart
    </Button>
  );
}
