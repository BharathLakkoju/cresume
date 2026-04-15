"use client";

import type { Route } from "next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { roleGuidesHubPath } from "@/lib/route-paths";

const navLinks = [
  { label: "Role Guides", href: roleGuidesHubPath, isRoute: true },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
];

function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  onClose?: () => void,
) {
  if (href.startsWith("/#")) {
    const id = href.slice(2);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Always close the menu whether we scroll or navigate
    onClose?.();
  }
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[hsl(var(--border)/0.08)]">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground"
        >
          <Image
            src="/logo.ico"
            alt="atsprecise"
            width={32}
            height={32}
            className="rounded-sm"
          />
          atsprecise
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href as Route<string>}
                className="transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/auth"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Button size="default" asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[hsl(var(--border)/0.08)] bg-surface-base md:hidden"
          >
            <nav className="container flex flex-col gap-4 py-6">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    href={link.href as Route<string>}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href, () => setMobileOpen(false))
                    }
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign In
                </Link>
                <Button size="default" asChild>
                  <Link href="/auth" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
