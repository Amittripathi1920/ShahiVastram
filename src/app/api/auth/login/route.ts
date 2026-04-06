import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authCookieOptions, createSessionToken } from "@/lib/auth";
import { signInWithProfile } from "@/lib/services/profiles";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const profile = await signInWithProfile(email, password);
  if (!profile) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createSessionToken({ email: profile.email, role: profile.role });
  const store = await cookies();
  store.set("shahi_session", token, authCookieOptions());

  return NextResponse.json({
    success: true,
    session: {
      email: profile.email,
      role: profile.role
    }
  });
}
