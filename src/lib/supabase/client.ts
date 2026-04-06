import { createClient } from "@supabase/supabase-js";

import { env, hasSupabaseConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}
