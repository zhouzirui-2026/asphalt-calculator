export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({
  items,
  heading = "Frequently asked questions",
  eyebrow = "Questions, answered plainly",
}: {
  items: readonly FaqItem[];
  heading?: string;
  eyebrow?: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="content-section faq-section" aria-labelledby="faq-heading">
      <div className="section-heading section-heading--compact">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="faq-heading">{heading}</h2>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary data-faq-question>{item.question}</summary>
            <p data-faq-answer>{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
    </section>
  );
}
