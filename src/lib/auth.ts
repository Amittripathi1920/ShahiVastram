import { createHash } from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { type AppSession } from "@/lib/types";

const secret = new TextEncoder().encode(env.adminJwtSecret);
const cookieName = "shahi_session";

export function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function createSessionToken(session: AppSession) {
  const payload: JWTPayload = {
    email: session.email,
    role: session.role
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const result = await jwtVerify(token, secret);
    if (typeof result.payload.email !== "string") {
      return null;
    }
    if (result.payload.role !== "admin" && result.payload.role !== "user") {
      return null;
    }

    return {
      email: result.payload.email,
      role: result.payload.role
    } as AppSession;
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function getAdminSession() {
  const session = await getCurrentSession();
  return session?.role === "admin";
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

export const AUTH_COOKIE_NAME = cookieName;
