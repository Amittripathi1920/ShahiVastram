import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, getCurrentSession } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentSession();
  return NextResponse.json({ session });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
