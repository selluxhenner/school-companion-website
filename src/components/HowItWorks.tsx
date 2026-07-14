const STEPS = [
  {
    title: "Herunterladen",
    line: "Hol dir School Companion kostenlos im App Store oder bei Google Play.",
  },
  {
    title: "Einrichten",
    line: "Erfasse deinen Stundenplan einmal – Fächer, Zimmer und Lehrpersonen inklusive.",
  },
  {
    title: "Organisiert bleiben",
    line: "Lektionen, Prüfungen und Noten bleiben automatisch aktuell.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h2 id="how-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        In wenigen Minuten startklar
      </h2>
      <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-1.5 max-w-[28ch] text-sm leading-relaxed text-slate-600">{step.line}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
