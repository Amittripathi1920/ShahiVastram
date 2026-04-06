import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/");
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-8 max-w-2xl space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Welcome Back</p>
        <h1 className="text-5xl font-semibold text-foreground">Login to continue shopping and managing your account.</h1>
      </div>
      <LoginForm />
    </div>
  );
}
