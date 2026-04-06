import crypto from "crypto";
import { NextResponse } from "next/server";

import { updateOrderStatus } from "@/lib/services/orders";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.json();
  const generatedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== body.razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (supabase) {
    await supabase
      .from("orders")
      .update({ payment_status: "paid", payment_reference: body.razorpay_payment_id })
      .eq("id", body.pendingOrderId);
  }

  await updateOrderStatus(body.pendingOrderId, "Pending");

  return NextResponse.json({ success: true, orderId: body.pendingOrderId });
}
