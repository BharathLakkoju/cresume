import { createClient } from "@supabase/supabase-js";

/** Service-role client that bypasses RLS. Use only in server-side API routes. */
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}
