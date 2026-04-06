import { ProductEditor } from "@/components/admin/product-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/lib/services/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="page-shell space-y-8 py-10 pb-16">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Admin Products</p>
        <h1 className="text-5xl font-semibold text-foreground">Create, edit, and merchandise your catalog</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductEditor />
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="space-y-5 p-6">
              <ProductEditor product={product} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
