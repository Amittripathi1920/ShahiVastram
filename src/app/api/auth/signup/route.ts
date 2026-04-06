import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authCookieOptions, createSessionToken } from "@/lib/auth";
import { createProfileAccount } from "@/lib/services/profiles";

export async function POST(request: Request) {
  const body = await request.json();
  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "Full name, email, and password are required." },
      { status: 400 }
    );
  }

  try {
    const profile = await createProfileAccount(email, password, fullName);
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 }
    );
  }
}
