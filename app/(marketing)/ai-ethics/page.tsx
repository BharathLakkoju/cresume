import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Ethics — ATS Precision",
  description:
    "Our principles for responsible and transparent AI use in ATS Precision.",
};

export default function AiEthicsPage() {
  return (
    <main className="py-24">
      <div className="container max-w-3xl">
        <p className="label-sm text-muted-foreground">RESPONSIBILITY</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          AI Ethics
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
          We believe AI tools that influence careers must be built with
          transparency, fairness, and human agency at the centre.
        </p>

        <div className="mt-12 space-y-10 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Transparency in AI Output
            </h2>
            <p className="leading-relaxed">
              ATS Precision uses large language models (LLMs) to analyse resumes
              and job descriptions. We surface{" "}
              <strong className="text-foreground">explicit reasoning</strong>{" "}
              for every score and recommendation — not just numbers. You can
              read why a skill was flagged, what keyword was missed, and how the
              model assessed your experience against the role.
            </p>
            <p className="leading-relaxed">
              We never present AI scores as objective truths. Every evaluation
              includes a confidence context and should be read as an advisory
              signal, not a definitive judgement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Fairness &amp; Bias Awareness
            </h2>
            <p className="leading-relaxed">
              Language models can reflect biases present in their training data,
              including demographic, cultural, and linguistic biases. We
              acknowledge this limitation openly:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                We do not use or expose information about a candidate&apos;s
                gender, ethnicity, age, or other protected characteristics.
              </li>
              <li>
                We do not score candidates against each other — evaluations are
                always relative to a specific job description.
              </li>
              <li>
                We encourage users to treat AI recommendations as one input
                among many, not a final hiring or rejection criterion.
              </li>
            </ul>
            <p className="leading-relaxed">
              If you encounter a response that appears biased or harmful, please
              report it to{" "}
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
              Human Agency
            </h2>
            <p className="leading-relaxed">
              ATS Precision is a tool to <em>augment</em> your judgement, not
              replace it. We design every feature so that you remain in control:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                AI-generated resume tailoring suggestions are always editable —
                we never auto-apply changes.
              </li>
              <li>
                Your profile data is yours; you can export or delete it at any
                time.
              </li>
              <li>
                We do not make automated hiring decisions. No employer data is
                shared through the platform.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Data Minimisation
            </h2>
            <p className="leading-relaxed">
              We process only the data necessary to provide the requested
              analysis. Resume and job description text is transmitted to our AI
              provider (OpenRouter / Google Gemini) for inference and is not
              retained for model training by our instruction. We do not build
              behavioural profiles or add tracking beyond what is required for
              session management and rate limiting.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Accountability
            </h2>
            <p className="leading-relaxed">
              We are committed to continuous improvement of our AI systems. If
              our models produce harmful, misleading, or inaccurate outputs at
              scale, we will investigate and take corrective action. We welcome
              scrutiny and feedback from users, researchers, and the broader
              community.
            </p>
            <p className="leading-relaxed">
              Contact us at{" "}
              <a
                href="mailto:lbharath0712@gmail.com"
                className="underline hover:text-foreground"
              >
                lbharath0712@gmail.com
              </a>{" "}
              to raise any concerns about AI safety or ethics.
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
