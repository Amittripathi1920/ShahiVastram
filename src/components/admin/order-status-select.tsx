"use client";

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/select";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();

  async function updateStatus(nextStatus: string) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    router.refresh();
  }

  return (
    <Select
      aria-label={`Update order status for ${orderId}`}
      defaultValue={status}
      onChange={(event) => void updateStatus(event.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
    </Select>
  );
}
