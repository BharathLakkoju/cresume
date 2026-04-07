"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function isAnonymousTrialPath(pathname: string) {
  return pathname === "/app/upload" || pathname.startsWith("/app/upload/");
}

export function AppAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

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
