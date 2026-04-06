import Link from "next/link";

import { getCurrentSession } from "@/lib/auth";
import { navigationLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { HeaderAuthControls } from "@/components/layout/header-auth-controls";
import { HeaderCartButton } from "@/components/layout/header-cart-button";

export async function SiteHeader() {
  const session = await getCurrentSession();

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
          <HeaderAuthControls session={session} />
          <HeaderCartButton />
        </div>
      </div>
    </header>
  );
}
