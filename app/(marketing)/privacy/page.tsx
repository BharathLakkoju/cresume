import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ATS Precision",
  description: "How ATS Precision collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="py-24">
      <div className="container max-w-3xl">
        <p className="label-sm text-muted-foreground">LEGAL</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>

        <div className="prose-custom mt-12 space-y-10 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              When you use ATS Precision, we may collect the following types of
              information:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-foreground">Account data</strong>: email
                address and hashed password when you create an account.
              </li>
              <li>
                <strong className="text-foreground">Resume content</strong>: the
                text extracted from resumes you upload, used solely to perform
                the requested analysis.
              </li>
              <li>
                <strong className="text-foreground">Job descriptions</strong>:
                the job description text you paste, used for matching analysis.
              </li>
              <li>
                <strong className="text-foreground">Usage data</strong>:
                anonymised IP address (for rate-limiting free tier), browser
                type, and pages visited.
              </li>
              <li>
                <strong className="text-foreground">Profile data</strong>:
                skills, experience, and preferences you optionally save to your
                profile.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                To provide ATS analysis, resume tailoring, and profile building
                features.
              </li>
              <li>
                To enforce free-tier usage limits (2 analyses per IP address).
              </li>
              <li>
                To store your evaluation history and profile when you are signed
                in.
              </li>
              <li>
                To improve our AI models and service quality (in aggregate,
                anonymised form only).
              </li>
            </ul>
            <p className="leading-relaxed">
              We do <strong className="text-foreground">not</strong> sell, rent,
              or trade your personal data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              3. Data Storage &amp; Security
            </h2>
            <p className="leading-relaxed">
              All data is stored on Supabase-hosted PostgreSQL databases with
              row-level security policies. Your data is accessible only to your
              own authenticated session. We use HTTPS/TLS for all data in
              transit and rely on Supabase&apos;s industry-standard encryption
              at rest.
            </p>
            <p className="leading-relaxed">
              Resume content processed by our AI is sent to{" "}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                OpenRouter
              </a>{" "}
              via their API. We do not instruct OpenRouter to retain or train on
              your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              4. Cookies &amp; Local Storage
            </h2>
            <p className="leading-relaxed">
              We use Supabase authentication cookies to maintain your logged-in
              session. We use browser{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                localStorage
              </code>{" "}
              to persist your evaluation history and settings on your device. No
              third-party tracking cookies are used.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              5. Data Retention &amp; Deletion
            </h2>
            <p className="leading-relaxed">
              You can delete your account and all associated data at any time by
              contacting us. Anonymous (guest) data is stored only as an
              IP-based usage counter and is not linked to any personal identity.
              Local browser data can be cleared from your browser settings at
              any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              6. Your Rights
            </h2>
            <p className="leading-relaxed">
              Depending on your location, you may have rights to access,
              correct, port, or erase your personal data. To exercise any of
              these rights, contact us at{" "}
              <a
                href="mailto:lbharath0712@gmail.com"
                className="underline hover:text-foreground"
              >
                lbharath0712@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              7. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this policy periodically. Significant changes will
              be communicated via email or a notice on the platform. Continued
              use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              8. Contact
            </h2>
            <p className="leading-relaxed">
              Questions about this policy?{" "}
              <a
                href="mailto:lbharath0712@gmail.com"
                className="underline hover:text-foreground"
              >
                lbharath0712@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-[hsl(var(--border)/0.15)] pt-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
