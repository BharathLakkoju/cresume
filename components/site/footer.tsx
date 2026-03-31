import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "AI Ethics", href: "#" },
  { label: "Contact", href: "#" }
];

export function Footer() {
  return (
    <footer className="hidden lg:block border-t border-[hsl(var(--border)/0.08)] bg-surface-base py-10">
      <div className="container flex flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-display text-base font-bold text-foreground">
          ATS Precision
        </Link>
        <nav className="flex flex-wrap items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="label-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ATS Precision. Engineered for Clarity.
        </p>
      </div>
    </footer>
  );
}
