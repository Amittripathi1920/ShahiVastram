import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryGrid } from "@/components/store/category-grid";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/services/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="space-y-14 py-4 pb-12 sm:space-y-16 sm:py-6 sm:pb-16">
      <section className="page-shell">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-hero-grid px-5 py-5 text-white shadow-glow sm:px-7 sm:py-6 lg:min-h-[calc(100vh-14rem)] lg:pl-20 lg:pr-16 lg:py-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.22),transparent_22%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.2fr_0.78fr] lg:items-center">
            <div className="max-w-2xl space-y-4 animate-fade-up motion-reduce:animate-none">
              <p className="text-[11px] uppercase tracking-[0.38em] text-white/70 sm:text-xs">Premium Menswear</p>
              <h1 className="text-3xl font-semibold leading-[0.95] sm:text-4xl lg:text-5xl xl:text-6xl">
                Occasionwear with royal character and modern ease.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Discover sherwanis, blazers, kurta pajama sets, and elevated festive essentials designed for weddings, receptions, and unforgettable entrances.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-10 bg-white px-4 text-primary hover:bg-white/90 sm:h-11 sm:px-5">
                  <Link href="/products">
                    Shop Collection
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 border-white/30 bg-white/10 px-4 text-white hover:bg-white/20 sm:h-11 sm:px-5">
                  <Link href="/products?category=Sherwanis">Explore Sherwanis</Link>
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 p-2 backdrop-blur">
              <div className="relative aspect-[4/4.4] overflow-hidden rounded-[1.1rem] lg:aspect-[4/4.8]">
                <Image
                  src="https://manyavar.scene7.com/is/image/manyavar/SHOS466_302_28-02-2026-14-23:650x900?&dpr=on,2"
                  alt="Manyavar occasionwear look in hero section"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell space-y-6">
        <SectionHeading
          eyebrow="Featured"
          title="Editorial picks for wedding season"
          description="A storefront designed around high-impact occasionwear, mixing premium silhouettes with fast browsing and conversion-focused interactions."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell space-y-6">
        <SectionHeading
          eyebrow="Categories"
          title="Built for every celebration on the calendar"
          description="From sharp evening tailoring to ceremonial statementwear, each category is merchandised for quick discovery and easy filtering."
        />
        <CategoryGrid />
      </section>
    </div>
  );
}
