import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { getDashboardStats, getOrders } from "@/lib/services/orders";

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getDashboardStats(), getOrders()]);

  return (
    <div className="page-shell space-y-8 py-10 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Admin Dashboard</p>
          <h1 className="text-5xl font-semibold text-foreground">Store operations at a glance</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline"><Link href="/admin/products">Manage Products</Link></Button>
          <Button asChild><Link href="/admin/orders">Manage Orders</Link></Button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Products", stats.totalProducts],
          ["Orders", stats.totalOrders],
          ["Pending", stats.pendingOrders],
          ["Revenue", formatCurrency(stats.revenue)]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="space-y-2 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
              <p className="text-4xl font-semibold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length ? orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/70 px-4 py-3">
              <div>
                <p className="font-medium text-foreground">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.id}</p>
              </div>
              <p className="text-sm text-muted-foreground">{order.status}</p>
              <p className="font-semibold text-primary">{formatCurrency(order.total_amount)}</p>
            </div>
          )) : <p className="text-muted-foreground">No orders yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
