import type { Metadata } from "next";

import { Sidebar } from "@/components/app/sidebar";
import { AppAuthGuard } from "@/components/app/app-auth-guard";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Application",
  description:
    "Private atsprecise application area for resume uploads, analysis history, and account settings.",
  path: "/app",
  noIndex: true,
});

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppAuthGuard />
      <Sidebar />
      {/* pt-14 = mobile top bar height, pb-16 = mobile bottom tab bar height */}
      <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-surface-base pt-14 pb-16 lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
