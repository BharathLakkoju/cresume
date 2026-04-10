"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { clearEvaluationSessionData } from "@/store/evaluation-store";
import { clearProfileSessionData } from "@/store/profile-store";

function isAnonymousTrialPath(pathname: string) {
  return pathname === "/app/upload" || pathname.startsWith("/app/upload/");
}

export function AppAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const lastUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const syncEvaluationSession = (userId: string | null) => {
      if (lastUserIdRef.current === undefined) {
        lastUserIdRef.current = userId;
        return;
      }

      if (lastUserIdRef.current !== userId) {
        clearEvaluationSessionData();
        clearProfileSessionData();
      }

      lastUserIdRef.current = userId;
    };

    void supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) =>
        syncEvaluationSession(data.user?.id ?? null),
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        syncEvaluationSession(session?.user?.id ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/app") || isAnonymousTrialPath(pathname)) {
      return;
    }

    const enforceAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
      }
    };

    void enforceAuth();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void enforceAuth();
      }
    };

    const handlePopState = () => {
      void enforceAuth();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, router]);

  return null;
}
