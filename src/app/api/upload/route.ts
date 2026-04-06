import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ url: "/images/products/coat.svg", warning: "Supabase storage not configured." });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return NextResponse.json({ url: data.publicUrl });
}
