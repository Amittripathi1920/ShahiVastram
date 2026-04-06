import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/constants";
import { getProducts } from "@/lib/services/products";
import Link from "next/link";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const products = await getProducts(selectedCategory);

  return (
    <div className="page-shell space-y-10 py-10 pb-16">
      {/* <SectionHeading
        eyebrow="Collection"
        title="A polished product catalog with category-first browsing"
        description="Filter directly from the URL, browse by product grid, and move quickly from discovery to cart."
      /> */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant={!selectedCategory ? "default" : "outline"} size="sm">
          <Link href="/products">All</Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            asChild
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
          >
            <Link href={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
          </Button>
        ))}
      </div>
      {products.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-surface p-10 text-center text-muted-foreground">
          No products found for this category.
        </div>
      )}
    </div>
  );
}
