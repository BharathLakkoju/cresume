import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — ATS Precision",
  description: "Terms and conditions for using ATS Precision.",
};

export default function TermsPage() {
  return (
    <main className="py-24">
      <div className="container max-w-3xl">
        <p className="label-sm text-muted-foreground">LEGAL</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>

        <div className="mt-12 space-y-10 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using ATS Precision (&ldquo;the Service&rdquo;),
              you agree to be bound by these Terms of Service. If you do not
              agree, please do not use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p className="leading-relaxed">
              ATS Precision is an AI-powered resume analysis platform that
              evaluates resumes against job descriptions, provides tailoring
              suggestions, and helps users build structured resume profiles. The
              Service uses large language models via third-party APIs to
              generate analysis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              3. Free Tier &amp; Accounts
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Anonymous users may perform up to{" "}
                <strong className="text-foreground">2 free analyses</strong>{" "}
                without creating an account, subject to IP-based rate limiting.
              </li>
              <li>
                Registered accounts unlock unlimited evaluations and
                cloud-synced history storage.
              </li>
              <li>
                You are responsible for maintaining the security of your account
                credentials.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              4. Acceptable Use
            </h2>
            <p className="leading-relaxed">You agree not to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                regulations.
              </li>
              <li>
                Attempt to circumvent rate limits, authentication, or access
                controls.
              </li>
              <li>
                Upload content containing personal data of third parties without
                their consent.
              </li>
              <li>
                Use automated scripts or bots to scrape or abuse the Service.
              </li>
              <li>
                Reverse engineer, decompile, or attempt to extract source code
                from the Service.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              5. AI-Generated Content
            </h2>
            <p className="leading-relaxed">
              ATS Precision uses AI language models to generate analysis and
              recommendations. These outputs are for informational and advisory
              purposes only. We do not guarantee employment outcomes, interview
              opportunities, or the accuracy of any AI-generated evaluation.
              Users should exercise independent judgement when acting on AI
              recommendations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              6. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content, design, and code comprising the ATS Precision
              platform is owned by ATS Precision and protected by applicable
              intellectual property laws. You retain ownership of the resume
              content and documents you upload.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              7. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, ATS Precision shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Service, including
              loss of employment opportunities or decisions made based on
              AI-generated content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              8. Termination
            </h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these Terms. You may delete your account at any time by contacting{" "}
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
              9. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We may revise these Terms at any time. Continued use of the
              Service after changes are posted constitutes your acceptance of
              the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              10. Contact
            </h2>
            <p className="leading-relaxed">
              For questions regarding these Terms, contact us at{" "}
              <a
                href="mailto:lbharath0712@gmail.com"
                className="underline hover:text-foreground"
              >
                lbharath0712@gmail.com
              </a>
              .
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
