"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/constants";
import { type Product } from "@/lib/types";

const emptyState = {
  id: "",
  name: "",
  slug: "",
  category: categories[0],
  description: "",
  price: 0,
  stock: 1,
  image_url: "/images/products/coat.svg",
  featured: false
} satisfies Product;

export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Product>(product ?? emptyState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateValue<Key extends keyof Product>(key: Key, value: Product[Key]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(file?: File | null) {
    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Image upload failed.");
    }
    updateValue("image_url", data.url);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const isEdit = Boolean(product?.id);
    const endpoint = isEdit ? `/api/products/${product?.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        id: isEdit ? product?.id : crypto.randomUUID(),
        slug:
          formData.slug ||
          formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to save product.");
      return;
    }

    router.refresh();
    router.push("/admin/products");
  }

  async function handleDelete() {
    if (!product?.id || !confirm("Delete this product?")) {
      return;
    }

    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
      router.push("/admin/products");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" value={formData.name} onChange={(event) => updateValue("name", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={formData.slug} onChange={(event) => updateValue("slug", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={formData.category} onChange={(event) => updateValue("category", event.target.value as Product["category"])}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={formData.price} onChange={(event) => updateValue("price", Number(event.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" value={formData.stock} onChange={(event) => updateValue("stock", Number(event.target.value))} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={formData.description} onChange={(event) => updateValue("description", event.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" value={formData.image_url} onChange={(event) => updateValue("image_url", event.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image_upload">Upload Image</Label>
          <Input id="image_upload" type="file" accept="image/*" onChange={(event) => void uploadImage(event.target.files?.[0])} />
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm sm:col-span-2">
          <input type="checkbox" checked={formData.featured} onChange={(event) => updateValue("featured", event.target.checked)} />
          Mark as featured product
        </label>
      </div>
      {error ? <p aria-live="polite" className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save Product"}</Button>
        {product ? <Button type="button" variant="danger" onClick={() => void handleDelete()}>Delete Product</Button> : null}
      </div>
    </form>
  );
}
