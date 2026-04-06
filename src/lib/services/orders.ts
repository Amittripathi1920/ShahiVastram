import { randomUUID } from "crypto";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { type DashboardStats, type Order, type OrderItem } from "@/lib/types";

export async function getOrders() {
  const supabase = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!supabase) {
    return [] as Order[];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as Order[];
  }

  return data as unknown as Order[];
}

export async function getOrderById(id: string) {
  const supabase = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  return (data as unknown as Order | null) ?? null;
}

export async function createOrder(input: Omit<Order, "id">) {
  const supabase = createSupabaseAdminClient();
  const orderId = randomUUID();

  if (!supabase) {
    return { id: orderId, ...input };
  }

  const { order_items, ...orderPayload } = input;
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    ...orderPayload,
  });
  if (orderError) {
    throw new Error(orderError.message);
  }

  const itemsPayload = order_items.map((item: OrderItem) => ({
    ...item,
    order_id: orderId,
  }));
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);
  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { id: orderId, ...input };
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { id, status };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      totalProducts: 6,
      totalOrders: 0,
      pendingOrders: 0,
      revenue: 0,
    };
  }

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("status, total_amount"),
  ]);

  const orders = ordersRes.data ?? [];

  return {
    totalProducts: productsRes.count ?? 0,
    totalOrders: orders.length,
    pendingOrders: orders.filter((item) => item.status === "pending").length,
    revenue: orders.reduce(
      (sum, item) => sum + Number(item.total_amount ?? 0),
      0,
    ),
  };
}
