import crypto from "crypto";
import { NextResponse } from "next/server";

import { updateOrderStatus } from "@/lib/services/orders";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env.server";

export async function POST(request: Request) {
  const body = await request.json();

  // ✅ Ensure secret exists
  if (!serverEnv.razorpayKeySecret) {
    return NextResponse.json(
      { error: "Razorpay secret not configured." },
      { status: 500 }
    );
  }

  // ✅ Generate signature securely using server secret
  const generatedSignature = crypto
    .createHmac("sha256", serverEnv.razorpayKeySecret)
    .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
    .digest("hex");

  // ❌ Invalid signature (tampered request)
  if (generatedSignature !== body.razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid payment signature." },
      { status: 400 }
    );
  }

  // ✅ Update order in DB (admin access)
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: body.razorpay_payment_id,
        order_status: "paid" // ✅ IMPORTANT (you were missing this)
      })
      .eq("id", body.pendingOrderId);
  }

  // ✅ Optional status update (business logic)
  await updateOrderStatus(body.pendingOrderId, "Pending");

  return NextResponse.json({
    success: true,
    orderId: body.pendingOrderId
  });
}