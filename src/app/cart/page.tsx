import { CartClient } from "@/components/store/cart-client";
import { SectionHeading } from "@/components/layout/section-heading";

export default function CartPage() {
  return (
    <div className="page-shell space-y-10 py-10 pb-16">
      <SectionHeading
        eyebrow="Cart"
        title="Review your selected pieces"
        description="Adjust quantities, remove products, and move to checkout once the look is locked in."
      />
      <CartClient />
    </div>
  );
}
