import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById } from "@/lib/services/orders";

export default async function OrderConfirmationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  return (
    <div className="page-shell py-16">
      <Card>
        <CardContent className="space-y-5 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Order Confirmed</p>
          <h1 className="text-5xl font-semibold text-foreground">Thank you for your purchase.</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Your order reference is <span className="font-semibold text-foreground">{order?.id ?? id}</span>. The admin panel can now track and update fulfillment status.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/orders">View Orders in Admin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
