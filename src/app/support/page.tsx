import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL, MATURA_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hilfe & Support",
  description: `Antworten auf häufige Fragen zu ${APP_NAME}: Stundenplan aus PDF importieren, Noten und Matura-Rechner, Widget, Mitteilungen, Nutzungsstatistik und Konto löschen – plus Kontakt zum Support.`,
  alternates: { canonical: "/support/" },
};

const SUBJECT = `${APP_NAME}: Support-Anfrage`;
const BODY = [
  "Hallo",
  "",
  "Mein Anliegen:",
  "",
  "",
  "App-Version (ganz unten in den Einstellungen): ",
  "Gerät und System (z. B. iPhone 13, iOS 18 / Samsung A54, Android 14): ",
].join("\n");

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

const linkClass = "font-medium text-brand-dark underline";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Wie importiere ich meinen Stundenplan aus einem PDF?",
    a: (
      <>
        <p>
          Lade deinen Stundenplan im Schulportal als PDF aus Untis herunter. Öffne dann in der
          App &laquo;Einstellungen &rarr; Stundenpläne&raquo; und tippe auf &laquo;PDF
          importieren&raquo;. Wähl das PDF aus deinen Dateien, such deine Klasse und wähl bei
          geteilten Lektionen deine Kurse. Danach speichern &ndash; fertig.
        </p>
        <p>
          Nimm ein PDF direkt aus Untis, keinen Scan und kein Foto. Es braucht Mo&ndash;Fr als
          Spaltenköpfe und HH:MM-Zeiten links. Klappt das Auslesen nicht, kannst du einen
          Schulplan laden oder deinen Stundenplan von Hand erstellen.
        </p>
      </>
    ),
  },
  {
    q: "Wie funktionieren Noten und der Matura-Rechner?",
    a: (
      <>
        <p>
          Im Tab &laquo;Noten&raquo; erfasst du pro Fach deine Noten mit Gewichtung. Den
          Notendurchschnitt rechnet die App automatisch. Über &laquo;Matura&raquo; siehst du,
          ob du die Matura bestehst, wie hoch dein Saldo ist und welche Noten du in den
          offenen Prüfungen noch brauchst.
        </p>
        <p>
          Den Matura-Rechner gibt es auch{" "}
          <Link href={MATURA_PATH} className={linkClass}>
            im Browser
          </Link>
          , ohne Login. Er setzt das Maturitätsprüfungsreglement des Kantons St.Gallen um.
          Verbindlich ist immer das Reglement deiner Schule.
        </p>
      </>
    ),
  },
  {
    q: "Wie richte ich das Widget ein?",
    a: (
      <>
        <p>
          Das Widget gibt es für Android. Drück lange auf eine freie Stelle des
          Startbildschirms, tippe auf &laquo;Widgets&raquo;, such {APP_NAME} und zieh das
          Widget an seinen Platz. Es zeigt die aktuelle und die nächste Lektion. Tippst du
          darauf, öffnet sich die App.
        </p>
        <p>
          Farben, Design und Schriftgrösse stellst du unter &laquo;Einstellungen &rarr;
          Widget&raquo; ein. Zum Vergrössern drückst du lange auf das Widget und ziehst an den
          Griffen. Auf dem iPhone gibt es noch kein Widget.
        </p>
      </>
    ),
  },
  {
    q: "Warum bekomme ich keine Mitteilungen?",
    a: (
      <>
        <p>Geh diese Punkte der Reihe nach durch:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            In der App unter &laquo;Einstellungen &rarr; Mitteilungen&raquo; ist
            &laquo;Push-Mitteilungen&raquo; eingeschaltet, ebenso die Art, die du erwartest
            (z.&nbsp;B. Prüfungserinnerungen).
          </li>
          <li>
            In den Einstellungen deines Geräts sind Mitteilungen für {APP_NAME} erlaubt.
          </li>
          <li>
            Kein Fokus- oder Nicht-stören-Modus blockiert sie. Auf Android: Nimm {APP_NAME}{" "}
            von der Akku-Optimierung bzw. dem Energiesparmodus aus.
          </li>
          <li>Du bist angemeldet und das Gerät war seit dem Eintragen online.</li>
        </ul>
        <p>
          Prüfungserinnerungen kommen am Tag vor der Prüfung. Kommt trotzdem nichts an, schreib
          uns mit App-Version und Gerät.
        </p>
      </>
    ),
  },
  {
    q: "Was bedeutet «Nutzungsstatistik teilen»?",
    a: (
      <>
        <p>
          Die App erfasst, welche Funktionen wie oft genutzt werden, zum Beispiel ob jemand
          einen Stundenplan importiert oder einen Pomodoro startet. Das hilft uns zu sehen, was
          gebraucht wird und was verbessert werden muss. Die Angaben sind deinem Konto
          zugeordnet. Deine Inhalte wie Noten, Fächer, Notizen oder Nachrichten erfahren wir
          nie.
        </p>
        <p>
          Ausschalten kannst du sie jederzeit unter &laquo;Einstellungen &rarr; Privatsphäre
          &amp; Sicherheit &rarr; Nutzungsstatistik teilen&raquo;. Alle Details stehen in der{" "}
          <Link href="/privacy/" className={linkClass}>
            Datenschutzerklärung
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    q: "Wie lösche ich mein Konto?",
    a: (
      <p>
        Die Löschung beantragst du per E-Mail. Wie das geht und was gelöscht wird, steht auf{" "}
        <Link href="/delete-account/" className={linkClass}>
          Konto und Daten löschen
        </Link>
        . Einzelne Noten, Prüfungen oder Lektionen löschst du direkt in der App.
      </p>
    ),
  },
  {
    q: "Welche App-Version habe ich?",
    a: (
      <p>
        Öffne die Einstellungen: im Tab &laquo;Sozial&raquo; das Zahnrad oben rechts. Ganz
        unten steht zum Beispiel &laquo;{APP_NAME} v1.3.0&raquo;. Steht dort v1.0.0, ist deine
        Version älter als 1.3.0 &ndash; dann zeigt dir der App Store oder Google Play die
        installierte Version. Gib die Version an, wenn du uns einen Fehler meldest.
      </p>
    ),
  },
];

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

export default function SupportPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <article className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hilfe &amp; Support
          </h1>

          <section className="mt-8 space-y-4 leading-relaxed text-slate-700">
            <p>
              Hier findest du Antworten auf die häufigsten Fragen zu {APP_NAME}. Steht deine
              Frage nicht dabei, schreib uns. Wir antworten so bald wie möglich.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={MAILTO}
                className="inline-block rounded-lg bg-brand-dark px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                Support per E-Mail
              </a>
              <Link
                href="/feedback/"
                className="inline-block rounded-lg px-5 py-3 font-semibold text-brand-dark ring-1 ring-line-2 hover:bg-brand-soft"
              >
                Fehler melden oder Idee teilen
              </Link>
            </div>
          </section>

          <Section title="Häufige Fragen">
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-ink">
                    {faq.q}
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="space-y-3 px-6 pb-5 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </Section>

          <Section title="Kontakt">
            <p>
              Schreib an{" "}
              <a href={MAILTO} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              . Gib die App-Version und dein Gerät an, dann können wir schneller helfen. Bitte
              schick uns keine Passwörter und keine Fotos von Zeugnissen.
            </p>
            <p>
              Eltern, Lehrpersonen und Schulen erreichen uns über dieselbe Adresse.
            </p>
          </Section>
        </article>
      </div>
      <Footer />
    </>
  );
}
