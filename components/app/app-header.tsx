"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { clearEvaluationSessionData } from "@/store/evaluation-store";

export function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    clearEvaluationSessionData();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border)/0.08)] bg-surface-base">
      <div className="flex h-16 items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-foreground"
        >
          ATS Precision
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block truncate max-w-40">
                {user.email}
              </span>
              <Button variant="outline" size="default" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Button size="default" asChild>
                <Link href="/app/upload">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
