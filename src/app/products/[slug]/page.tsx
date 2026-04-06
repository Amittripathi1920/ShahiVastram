import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { getProductBySlug } from "@/lib/services/products";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/5] bg-secondary">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Card>
        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              <Badge variant="outline">{product.category}</Badge>
              <h1 className="text-5xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary">{formatCurrency(product.price)}</p>
              <p className="text-base leading-7 text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AddToCartButton product={product} />
              <Button asChild variant="outline">
                <Link href="/products">Back to Products</Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 p-2 backdrop-blur">
            <div className="rounded-3xl bg-secondary/70 p-5 text-sm text-muted-foreground">
              Stock available: <span className="font-semibold text-foreground">{product.stock}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
