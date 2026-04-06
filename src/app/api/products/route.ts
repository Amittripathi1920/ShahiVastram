import { NextResponse } from "next/server";

import { getProducts, createProduct } from "@/lib/services/products";
import { getAdminSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const products = await getProducts(category);
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await createProduct({ id: body.id, ...parsed.data });
  return NextResponse.json({ product }, { status: 201 });
}
