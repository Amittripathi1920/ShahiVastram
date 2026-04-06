"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/formatters";
import { checkoutSchema } from "@/lib/validations";

const formSchema = checkoutSchema.extend({
  customer: checkoutSchema.shape.customer
});

type FormValues = z.infer<typeof formSchema>;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function loadRazorpay() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: {
        name: "",
        address: "",
        phone: "",
        city: "",
        state: "",
        postalCode: ""
      },
      items: [],
      paymentMethod: env.razorpayKeyId ? "razorpay" : "cod"
    }
  });

  useEffect(() => {
    form.setValue(
      "items",
      items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
        stock: item.stock
      }))
    );
  }, [form, items]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
        stock: item.stock
      }))
    };

    try {
      if (values.paymentMethod === "razorpay" && env.razorpayKeyId) {
        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
          throw new Error("Unable to load Razorpay checkout.");
        }

        const orderRes = await fetch("/api/payment/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.error ?? "Unable to initiate payment.");
        }

        const RazorpayCtor = window.Razorpay;
        if (!RazorpayCtor) {
          throw new Error("Unable to initialize Razorpay checkout.");
        }

        const razorpay = new RazorpayCtor({
          key: env.razorpayKeyId,
          amount: orderData.razorpayOrder.amount,
          currency: orderData.razorpayOrder.currency,
          name: "Shahi Vastram",
          description: "Occasionwear order",
          order_id: orderData.razorpayOrder.id,
          prefill: {
            name: values.customer.name,
            contact: values.customer.phone
          },
          handler: async (response: Record<string, string>) => {
            const verifyRes = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                pendingOrderId: orderData.pendingOrderId
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error ?? "Payment verification failed.");
            }
            clearCart();
            router.push(`/order-confirmation/${verifyData.orderId}`);
          },
          theme: {
            color: "#6e3c18"
          }
        });

        razorpay.open();
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Unable to place order.");
        }
        clearCart();
        router.push(`/order-confirmation/${data.order.id}`);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to complete checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Your cart is empty. Add products before checking out.
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" autoComplete="name" {...form.register("customer.name")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" autoComplete="street-address" {...form.register("customer.address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" {...form.register("customer.phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" autoComplete="address-level2" {...form.register("customer.city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" autoComplete="address-level1" {...form.register("customer.state")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" inputMode="numeric" autoComplete="postal-code" {...form.register("customer.postalCode")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select id="paymentMethod" {...form.register("paymentMethod")}>
              {env.razorpayKeyId ? <option value="razorpay">Razorpay Test Mode</option> : null}
              <option value="cod">Cash on Delivery</option>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <p className="whitespace-nowrap font-semibold text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-4 text-base">
            <span>Total</span>
            <span className="font-semibold text-primary">{formatCurrency(subtotal)}</span>
          </div>
          {error ? <p aria-live="polite" className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order…" : "Place Order"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
