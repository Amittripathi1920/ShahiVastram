import { createClient } from "@supabase/supabase-js";

import { env, hasServiceRole, hasSupabaseConfig } from "@/lib/env";

export function createSupabaseServerClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createSupabaseAdminClient() {
  if (!hasServiceRole()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
