import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Returns the authenticated Supabase user from the current request cookies, or null. */
export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}
