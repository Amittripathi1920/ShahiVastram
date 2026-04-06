import { sampleProducts } from "@/lib/sample-data";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient
} from "@/lib/supabase/server";
import { type Product } from "@/lib/types";

function sortProducts(items: Product[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProducts(category?: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return sortProducts(
      category ? sampleProducts.filter((item) => item.category === category) : sampleProducts
    );
  }

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error || !data) {
    return sortProducts(
      category ? sampleProducts.filter((item) => item.category === category) : sampleProducts
    );
  }

  return data as Product[];
}

export async function getFeaturedProducts() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return sampleProducts.filter((item) => item.featured).slice(0, 4);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data) {
    return sampleProducts.filter((item) => item.featured).slice(0, 4);
  }

  return data as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return sampleProducts.find((item) => item.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  return (data as Product | null) ?? null;
}

export async function createProduct(product: Product) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return product;
  }

  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { id, ...updates };
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
