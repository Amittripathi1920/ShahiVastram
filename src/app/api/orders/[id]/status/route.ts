import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { statusSchema } from "@/lib/validations";
import { updateOrderStatus } from "@/lib/services/orders";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const order = await updateOrderStatus(id, parsed.data.status);
  return NextResponse.json({ order });
}
