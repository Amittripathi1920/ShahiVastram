import { CheckoutForm } from "@/components/store/checkout-form";
import { SectionHeading } from "@/components/layout/section-heading";

export default function CheckoutPage() {
  return (
    <div className="page-shell space-y-10 py-10 pb-16">
      <SectionHeading
        eyebrow="Checkout"
        title="Capture customer details and confirm the order"
        description="This flow supports Razorpay test mode or cash on delivery, then stores the order in Supabase."
      />
      <CheckoutForm />
    </div>
  );
}
