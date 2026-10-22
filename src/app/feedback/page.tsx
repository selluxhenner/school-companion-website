import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Feedback & Fehler melden",
  description: `Fehler in ${APP_NAME} gefunden oder eine Idee für eine neue Funktion? So meldest du dich bei uns – mit Vorlage für eine gute Fehlermeldung.`,
  alternates: { canonical: "/feedback/" },
};

// No backend on this site: both buttons open the student's mail app with a template.
const DETAILS = [
  "App-Version (ganz unten in den Einstellungen): ",
  "Gerät und System (z. B. iPhone 13, iOS 18 / Samsung A54, Android 14): ",
];

const BUG_SUBJECT = `${APP_NAME}: Fehler melden`;
const BUG_BODY = [
  "Was ist passiert?",
  "",
  "",
  "Was hättest du erwartet?",
  "",
  "",
  "Wie kommt man dorthin? (Schritte)",
  "1. ",
  "2. ",
  "",
  ...DETAILS,
].join("\n");

const IDEA_SUBJECT = `${APP_NAME}: Idee`;
const IDEA_BODY = [
  "Das wünsche ich mir:",
  "",
  "",
  "Dafür würde ich es brauchen:",
  "",
  "",
  ...DETAILS,
].join("\n");

const mailto = (subject: string, body: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const linkClass = "font-medium text-brand-dark underline";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function FeedbackPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <article className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Feedback &amp; Fehler melden
          </h1>

          <section className="mt-8 space-y-4 leading-relaxed text-slate-700">
            <p>
              {APP_NAME} ist für Schülerinnen und Schüler gemacht. Funktioniert etwas nicht oder fehlt dir eine Funktion, sag es uns. Wir
              lesen jede Nachricht.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={mailto(BUG_SUBJECT, BUG_BODY)}
                className="inline-block rounded-lg bg-brand-dark px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                Fehler melden
              </a>
              <a
                href={mailto(IDEA_SUBJECT, IDEA_BODY)}
                className="inline-block rounded-lg px-5 py-3 font-semibold text-brand-dark ring-1 ring-line-2 hover:bg-brand-soft"
              >
                Idee teilen
              </a>
            </div>
            <p className="text-sm text-slate-500">
              Die Buttons öffnen deine E-Mail-App mit einer Vorlage. Klappt das nicht, schreib
              direkt an{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <Section title="So hilft uns deine Fehlermeldung am meisten">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Was ist passiert, und was hättest du erwartet?</strong> Ein, zwei Sätze
                reichen.
              </li>
              <li>
                <strong>Die Schritte dorthin.</strong> Zum Beispiel: &laquo;Noten &rarr; Fach
                Mathematik &rarr; Note hinzufügen &rarr; Speichern&raquo;.
              </li>
              <li>
                <strong>App-Version und Gerät.</strong> Die Version steht ganz unten in den
                Einstellungen, zum Beispiel &laquo;{APP_NAME} v1.3.0&raquo;.
              </li>
              <li>
                <strong>Ein Screenshot</strong>, wenn er etwas zeigt. Deck Angaben ab, die wir
                nicht sehen sollen.
              </li>
            </ul>
            <p>
              Beim Stundenplan-Import hilft es, wenn du Schule und Klasse nennst. Schick das
              PDF nur mit, wenn du willst.
            </p>
          </Section>

          <Section title="Was mit deiner Nachricht passiert">
            <p>
              Deine E-Mail landet bei uns, nicht in der App. Wir nutzen sie und deine
              E-Mail-Adresse nur, um dir zu antworten und den Fehler zu beheben oder die Idee
              zu prüfen. Wir geben sie nicht weiter. Mehr dazu steht in der{" "}
              <Link href="/privacy/" className={linkClass}>
                Datenschutzerklärung
              </Link>
              .
            </p>
            <p>
              Eine Frage zur Bedienung? Vielleicht steht die Antwort schon unter{" "}
              <Link href="/support/" className={linkClass}>
                Hilfe &amp; Support
              </Link>
              .
            </p>
          </Section>
        </article>
      </div>
      <Footer />
    </>
  );
}
