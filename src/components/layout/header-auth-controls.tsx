"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { type AppSession } from "@/lib/types";

export function HeaderAuthControls({ session }: { session: AppSession | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (session) {
    return (
      <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
        Sign Out
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/signup">Sign Up</Link>
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}
