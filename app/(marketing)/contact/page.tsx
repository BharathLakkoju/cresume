import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — ATS Precision",
  description: "Get in touch with the ATS Precision team.",
};

export default function ContactPage() {
  return (
    <main className="py-24">
      <div className="container max-w-2xl">
        <p className="label-sm text-muted-foreground">GET IN TOUCH</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Have a question, found a bug, or want to share feedback? We&apos;d
          love to hear from you.
        </p>

        <div className="mt-12 space-y-8">
          {/* Email card */}
          <div className="flex items-start gap-5 rounded-2xl border border-[hsl(var(--border)/0.15)] bg-card p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Mail className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                For support, feedback, data requests, or anything else.
              </p>
              <a
                href="mailto:lbharath0712@gmail.com"
                className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                lbharath0712@gmail.com
              </a>
            </div>
          </div>

          {/* Response time */}
          <div className="rounded-2xl border border-[hsl(var(--border)/0.15)] bg-muted/40 p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">
                Typical response time:
              </strong>{" "}
              1–2 business days. We read every message and aim to respond to all
              enquiries promptly.
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              We can help with:
            </p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
              <li>Questions about your account or evaluation history</li>
              <li>Requests to export or delete your data</li>
              <li>Reporting inaccurate or harmful AI output</li>
              <li>Bug reports and feature suggestions</li>
              <li>Partnership or collaboration enquiries</li>
            </ul>
          </div>
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
