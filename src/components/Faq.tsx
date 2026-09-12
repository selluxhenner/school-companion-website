import { FAQS } from "@/lib/site";

type Item = { readonly q: string; readonly a: string };

export default function Faq({ items = FAQS }: { items?: readonly Item[] }) {
  return (
    <section aria-labelledby="faq-heading" className="bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h2 id="faq-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Häufige Fragen
        </h2>
        <div className="mt-12 space-y-3">
            {items.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold">
                  {faq.q}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </details>
            ))}
        </div>
      </div>
    </section>
  );
}
