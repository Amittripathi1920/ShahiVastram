"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/constants";
import { useCart } from "@/components/providers/cart-provider";
import { type AppSession } from "@/lib/types";

export function SiteHeaderClient({ session }: { session: AppSession | null }) {
  const router = useRouter();
  const { itemCount } = useCart();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-background/85 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="min-w-0">
          <div className="font-display text-3xl font-semibold tracking-wide text-primary">
            Shahi Vastram
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navigationLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {session?.role === "admin" ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard">Admin</Link>
            </Button>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
              Sign Out
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/login">Sign In</Link>
            </Button>
          )}
          <Button asChild size="sm" className="shrink-0">
            <Link href="/cart" aria-label={`Open cart with ${itemCount} items`}>
              <ShoppingBag aria-hidden="true" className="size-4" />
              Cart ({itemCount})
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
