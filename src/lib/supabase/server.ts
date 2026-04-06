import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env.client";
import { serverEnv } from "@/lib/env.server";

export function createSupabaseServerClient() {
  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    return null;
  }

  return createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createSupabaseAdminClient() {
  if (!clientEnv.supabaseUrl || !serverEnv.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(clientEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}