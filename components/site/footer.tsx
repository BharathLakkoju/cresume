import Link from "next/link";

const footerLinks: Array<{ label: string; href: string }> = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "AI Ethics", href: "/ai-ethics" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="hidden lg:block border-t border-[hsl(var(--border)/0.08)] bg-surface-base py-10">
      <div className="container flex flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="font-display text-base font-bold text-foreground"
        >
          atsprecise
        </Link>
        <nav className="flex flex-wrap items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href as any}
              className="label-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} atsprecise. Engineered for Clarity.
        </p>
      </div>
    </footer>
  );
}
