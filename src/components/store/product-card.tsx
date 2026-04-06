import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { type Product } from "@/lib/types";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.15] overflow-hidden bg-secondary sm:aspect-[4/4.4]">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>
      <CardContent className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] tracking-[0.16em]">{product.category}</Badge>
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-base font-semibold leading-5 text-foreground transition-colors hover:text-primary sm:text-[1.05rem]">
                {product.name}
              </h3>
            </Link>
          </div>
          <p className="whitespace-nowrap text-sm font-semibold text-primary sm:text-base">
            {formatCurrency(product.price)}
          </p>
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm">{product.description}</p>
        <div className="flex items-center gap-2">
          <AddToCartButton product={product} className="h-9 flex-1 px-3 text-xs sm:text-sm" />
          <Button asChild variant="outline" className="h-9 flex-1 px-3 text-xs sm:text-sm">
            <Link href={`/products/${product.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
