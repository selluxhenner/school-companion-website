import Link from "next/link";
import PhoneFrame from "./PhoneFrame";
import { MATURA_PATH } from "@/lib/site";

const POINTS = [
  {
    title: "Bestanden oder nicht — sofort",
    line: "Saldo und Anzahl ungenügender Noten nach den Bestehensnormen des Kantons St.Gallen, geprüft am Beispiel der Kanti Wil.",
  },
  {
    title: "Was du noch brauchst",
    line: "Eine Zahl für alle offenen Prüfungen — und ein Plan, der die Arbeit nach deinen Stärken verteilt.",
  },
  {
    title: "Ziel setzen, Szenarien vergleichen",
    line: "Bestehen oder ein Schnitt von 5.0? Schätze deine Prüfungen realistisch und sieh Minimum, Realistisch und Sehr gut nebeneinander.",
  },
];

/** Homepage section for the free web calculator — the one thing on the site that needs no app. */
export default function MaturaTeaser() {
  return (
    <section aria-labelledby="matura-heading" className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
            Ohne App · direkt im Browser
          </p>
          <h2 id="matura-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Bestehst du die Matura?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Trag deine Erfahrungsnoten ein und der Matura-Rechner sagt dir, wo du stehst und welche Noten du in den
            offenen Prüfungen noch brauchst. Kein Login, nichts wird hochgeladen — alles bleibt auf deinem Gerät.
          </p>
          <ul className="mt-8 space-y-5">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{p.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href={MATURA_PATH}
              className="inline-flex h-12 items-center rounded-control bg-brand px-6 text-[15px] font-semibold text-white transition hover:bg-brand-dark"
            >
              Matura-Rechner öffnen
            </Link>
            <span className="text-sm text-slate-500">Kostenlos · 30 Sekunden</span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[300px] sm:max-w-[330px]">
          <PhoneFrame
            src="/matura/preview.png"
            alt="Matura-Rechner: Prognose mit Saldo, Anzahl Noten unter 4.0 und der Note, die in den offenen Prüfungen noch nötig ist"
          />
        </div>
      </div>
    </section>
  );
}
