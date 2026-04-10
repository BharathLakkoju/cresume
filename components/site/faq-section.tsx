const faqs = [
  {
    question: "How does atsprecise check ATS resume compatibility?",
    answer:
      "atsprecise compares your resume against a target job description, evaluates keyword alignment, experience relevance, section quality, and readability, then returns a detailed match report with concrete gaps and rewrite guidance.",
  },
  {
    question: "Is atsprecise only a keyword scanner?",
    answer:
      "No. It checks keywords, but it also looks at evidence quality, role alignment, resume structure, and whether your experience bullets communicate impact in the language hiring teams expect.",
  },
  {
    question: "Can I use atsprecise for any industry or role?",
    answer:
      "Yes. The evaluator is built for role-specific analysis, so you can compare your resume against software, data, product, marketing, operations, and other job descriptions instead of relying on generic advice.",
  },
  {
    question: "What makes an ATS-friendly resume?",
    answer:
      "An ATS-friendly resume uses clear section headings, readable formatting, strong keyword relevance, and concise impact-focused bullet points that prove your fit for the role you are targeting.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <div className="container max-w-4xl">
        <p className="label-sm text-muted-foreground">FAQ</p>
        <h2
          id="faq-heading"
          className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Questions candidates ask before improving an ATS resume score
        </h2>
        <div className="mt-12 grid gap-6">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="bg-surface-lowest p-8 shadow-ambient"
            >
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
