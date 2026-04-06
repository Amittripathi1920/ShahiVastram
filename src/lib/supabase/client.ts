import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env.client";

export function createSupabaseBrowserClient() {
  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    return null;
  }

  return createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}