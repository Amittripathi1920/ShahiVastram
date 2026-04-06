import crypto from "crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

import { createOrder } from "@/lib/services/orders";
import { clientEnv } from "@/lib/env.client";
import { serverEnv } from "@/lib/env.server";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (!clientEnv.razorpayKeyId || !serverEnv.razorpayKeySecret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const totalAmount = parsed.data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const razorpay = new Razorpay({
    key_id: clientEnv.razorpayKeyId,
    key_secret: serverEnv.razorpayKeySecret
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  const order = await createOrder({
    customer_name: parsed.data.customer.name,
    address: parsed.data.customer.address,
    phone: parsed.data.customer.phone,
    city: parsed.data.customer.city,
    state: parsed.data.customer.state,
    postal_code: parsed.data.customer.postalCode,
    status: "Pending",
    payment_status: "pending",
    // order_status: "pending", // ✅ added
    payment_provider: "razorpay",
    payment_reference: razorpayOrder.id,
    total_amount: totalAmount,
    order_items: parsed.data.items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      image_url: item.image_url
    }))
  });

  return NextResponse.json({ razorpayOrder, pendingOrderId: order.id });
}