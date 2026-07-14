import { FEATURES } from "@/lib/site";

const ICONS: Record<string, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
  exam: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2h6v4H9zM9 14l2 2 4-4.5" />
    </>
  ),
  grades: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  social: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6.7M17.5 14.2a6.5 6.5 0 0 1 4 5.8" />
    </>
  ),
  sync: (
    <>
      <path d="M21 12a9 9 0 0 1-15.4 6.4L3 16" />
      <path d="M3 12a9 9 0 0 1 15.4-6.4L21 8" />
      <path d="M3 21v-5h5M21 3v5h-5" />
    </>
  ),
};

export default function Features() {
  return (
    <section aria-labelledby="features-heading" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h2 id="features-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Alles, was Schüler brauchen
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  {ICONS[feature.icon]}
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
