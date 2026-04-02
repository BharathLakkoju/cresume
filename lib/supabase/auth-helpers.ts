import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Returns the authenticated Supabase user from the current request cookies, or null. */
export async function getCurrentUser() {
  const result = await getAuthenticatedClient();
  return result?.user ?? null;
}

/**
 * Returns both the authenticated Supabase client and user in one call.
 * Avoids creating the server client twice when the caller also needs it for queries.
 */
export async function getAuthenticatedClient(): Promise<{ supabase: SupabaseClient; user: User } | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return { supabase, user };
}
