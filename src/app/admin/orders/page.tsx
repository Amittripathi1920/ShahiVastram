import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getOrders } from "@/lib/services/orders";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="page-shell space-y-8 py-10 pb-16">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Admin Orders</p>
        <h1 className="text-5xl font-semibold text-foreground">Track every customer order from checkout to delivery</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length ? orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.order_items?.map((item) => (
                        <p key={`${order.id}-${item.product_id}`} className="text-sm text-muted-foreground">
                          {item.product_name} x {item.quantity}
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell className="min-w-44"><OrderStatusSelect orderId={order.id} status={order.status} /></TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
