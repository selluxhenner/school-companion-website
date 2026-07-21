import { FAQS } from "@/lib/site";

export default function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h2 id="faq-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Häufige Fragen
        </h2>
        <dl className="mt-12 space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <dt className="text-lg font-semibold">{faq.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
