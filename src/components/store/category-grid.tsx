import Link from "next/link";

import { categories } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

const categoryArt: Record<string, string> = {
  Coats: "Warm layers for formal winter statements.",
  Blazers: "Sharp evening tailoring with bold textures.",
  Sherwanis: "Ceremonial silhouettes with regal presence.",
  "Indo-Western": "Contemporary fusion for festive moments.",
  "Kurta Pajama": "Comfort-first elegance for every celebration.",
  "Modi Jackets": "Refined finishing layers with day-to-night appeal."
};

export function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => (
        <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
          <Card className="h-full overflow-hidden border-white/70 bg-gradient-to-br from-white to-secondary/60 transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
            <CardContent className="flex min-h-52 flex-col justify-between p-6">
              <div className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
                0{index + 1}
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-semibold text-foreground">{category}</h3>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  {categoryArt[category]}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
