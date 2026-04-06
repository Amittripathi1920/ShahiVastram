import { NextResponse } from "next/server";

import { createOrder, getOrders } from "@/lib/services/orders";
import { checkoutSchema } from "@/lib/validations";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const totalAmount = parsed.data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const order = await createOrder({
    customer_name: parsed.data.customer.name,
    address: parsed.data.customer.address,
    phone: parsed.data.customer.phone,
    city: parsed.data.customer.city,
    state: parsed.data.customer.state,
    postal_code: parsed.data.customer.postalCode,
    status: "Pending",
    payment_status: parsed.data.paymentMethod === "cod" ? "pending" : "paid",
    // order_status: parsed.data.paymentMethod === "cod" ? "pending" : "paid", // ✅ ADD THIS
    payment_provider: parsed.data.paymentMethod,
    payment_reference: null,
    total_amount: totalAmount,
    order_items: parsed.data.items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      image_url: item.image_url,
    })),
  });

  return NextResponse.json({ order }, { status: 201 });
}
