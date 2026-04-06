import { redirect } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { getCurrentSession } from "@/lib/auth";

export default async function SignupPage() {
  const session = await getCurrentSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/");
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-8 max-w-2xl space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Create Account</p>
        <h1 className="text-5xl font-semibold text-foreground">Sign up and start shopping with your own customer account.</h1>
      </div>
      <SignupForm />
    </div>
  );
}
