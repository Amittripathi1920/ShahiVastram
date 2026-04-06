import { hashPassword } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { type Profile } from "@/lib/types";

const fallbackProfiles: Profile[] = [
  {
    id: "seed-admin",
    email: "admin@shahivastram.com",
    full_name: "Store Owner",
    role: "admin",
    password_hash: hashPassword("change-this-password")
  }
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getProfileByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return fallbackProfiles.find((profile) => profile.email === normalizedEmail) ?? null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, password_hash, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  return (data as Profile | null) ?? null;
}

export async function createUserProfile(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const supabase = createSupabaseAdminClient();
  const payload = {
    email: normalizedEmail,
    role: "user",
    password_hash: hashPassword(password)
  };

  if (!supabase) {
    const profile: Profile = {
      id: `user-${normalizedEmail}`,
      email: normalizedEmail,
      role: "user",
      password_hash: payload.password_hash
    };
    fallbackProfiles.push(profile);
    return profile;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select("id, email, full_name, role, password_hash, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function createProfileAccount(
  email: string,
  password: string,
  fullName?: string
) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await getProfileByEmail(normalizedEmail);

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const supabase = createSupabaseAdminClient();
  const payload = {
    email: normalizedEmail,
    full_name: fullName?.trim() || null,
    role: "user" as const,
    password_hash: hashPassword(password)
  };

  if (!supabase) {
    const profile: Profile = {
      id: `user-${normalizedEmail}`,
      email: normalizedEmail,
      full_name: payload.full_name,
      role: "user",
      password_hash: payload.password_hash
    };
    fallbackProfiles.push(profile);
    return profile;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select("id, email, full_name, role, password_hash, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function signInWithProfile(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await getProfileByEmail(normalizedEmail);

  if (!existing) {
    return null;
  }

  if (existing.password_hash !== hashPassword(password)) {
    return null;
  }

  return existing;
}
