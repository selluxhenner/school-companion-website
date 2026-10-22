import type { Metadata } from "next";
import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Feedback & Fehler melden",
  description: `Fehler in ${APP_NAME} gefunden oder eine Idee für eine neue Funktion? Schick sie uns direkt über das Formular – ohne Konto, die E-Mail-Adresse ist freiwillig.`,
  alternates: { canonical: "/feedback/" },
};

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

          <section className="mt-8 space-y-6 leading-relaxed text-slate-700">
            <p>
              {APP_NAME} ist für Schülerinnen und Schüler gemacht. Funktioniert etwas nicht
              oder fehlt dir eine Funktion, sag es uns. Wir lesen jede Nachricht.
            </p>
            <FeedbackForm />
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
            </ul>
            <p>
              Beim Stundenplan-Import hilft es, wenn du Schule und Klasse nennst. Möchtest du
              einen Screenshot oder das PDF mitschicken, schreib uns an{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Was mit deiner Nachricht passiert">
            <p>
              Deine Nachricht landet in unserem Verwaltungsbereich. Lesen können sie nur
              berechtigte Administratoren. Wir nutzen sie, um Fehler zu beheben und Ideen zu
              prüfen, und geben sie nicht weiter. Nach 12 Monaten wird sie gelöscht.
            </p>
            <p>
              Deine E-Mail-Adresse ist freiwillig. Gibst du sie an, nutzen wir sie nur, um dir
              zu antworten. Schreib bitte keine Passwörter, Noten oder andere persönliche
              Angaben in die Nachricht, die wir für deine Meldung nicht brauchen. Mehr dazu
              steht in der{" "}
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
