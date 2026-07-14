import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description: `Nutzungsbedingungen für die ${APP_NAME} Mobile-App und Website (Schweizer Recht).`,
  alternates: { canonical: "/terms/" },
};

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

export default function TermsPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <article className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Nutzungsbedingungen
          </h1>
          <p className="mt-2 text-sm text-slate-500">Stand: 13. Juli 2026</p>

          <section className="mt-8 space-y-4 leading-relaxed text-slate-700">
            <p>
              Diese Nutzungsbedingungen regeln die Nutzung der {APP_NAME} Mobile-App für iOS
              und Android sowie dieser Website (zusammen &laquo;der Dienst&raquo;). Anbieter
              ist Serviweb, Kevin Schmid, Ostschweiz, Schweiz (&laquo;wir&raquo;,
              &laquo;uns&raquo;). Mit dem Herunterladen oder der Nutzung der App erklärst du
              dich mit diesen Bedingungen einverstanden.
            </p>
          </section>

          <Section title="1. Leistungsbeschreibung">
            <p>
              {APP_NAME} ist ein digitaler Schulplaner: Stundenplan, Prüfungen, Noten,
              Lernsessions und Social-Funktionen wie Lerngruppen. Die App ist kostenlos –
              ohne Abo und ohne versteckte Kosten. Wir entwickeln den Dienst laufend weiter
              und können Funktionen anpassen, erweitern oder einstellen; einzelne Funktionen
              können als &laquo;Coming Soon&raquo; oder Beta gekennzeichnet sein.
            </p>
          </Section>

          <Section title="2. Konto">
            <p>
              Für die Synchronisierung zwischen Geräten ist ein Konto erforderlich. Du
              verpflichtest dich, wahrheitsgemässe Angaben zu machen und deine Zugangsdaten
              geheim zu halten. Du bist für Aktivitäten verantwortlich, die über dein Konto
              erfolgen. Bist du minderjährig, bestätigst du, dass deine
              Erziehungsberechtigten mit der Nutzung einverstanden sind, soweit dies nach
              anwendbarem Recht erforderlich ist.
            </p>
          </Section>

          <Section title="3. Zulässige Nutzung">
            <p>Bei der Nutzung des Dienstes ist es untersagt:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                rechtswidrige, beleidigende oder persönlichkeitsverletzende Inhalte zu
                erfassen oder in Lerngruppen zu teilen;
              </li>
              <li>
                den Dienst zu missbrauchen, zu stören oder zu überlasten (z.&nbsp;B. durch
                automatisierte Zugriffe, Umgehung von Sicherheitsmassnahmen);
              </li>
              <li>
                die App zu dekompilieren, zurückzuentwickeln oder abgeleitete Werke zu
                erstellen, soweit dies nicht gesetzlich erlaubt ist;
              </li>
              <li>Konten oder Codes anderer Personen ohne deren Einwilligung zu nutzen.</li>
            </ul>
          </Section>

          <Section title="4. Deine Inhalte">
            <p>
              Die von dir erfassten Inhalte (Stundenplan, Noten, Prüfungen usw.) bleiben
              deine Daten. Du räumst uns lediglich das Recht ein, sie zu speichern, zu
              verarbeiten und zwischen deinen Geräten zu synchronisieren, soweit dies für
              den Betrieb des Dienstes nötig ist. Einzelheiten zur Datenbearbeitung findest
              du in der{" "}
              <Link href="/privacy/" className="font-medium text-brand-dark underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </Section>

          <Section title="5. Keine Gewähr für Inhalte und Berechnungen">
            <p>
              Notendurchschnitte, Notenziele, Matura-/Abschlussrechner und ähnliche
              Berechnungen sind Hilfsmittel ohne Gewähr. Massgebend sind stets die
              offiziellen Angaben und Berechnungen deiner Schule. Auch für die Richtigkeit
              der von dir oder anderen erfassten Inhalte übernehmen wir keine Verantwortung.
            </p>
          </Section>

          <Section title="6. Verfügbarkeit">
            <p>
              Wir bemühen uns um einen zuverlässigen Betrieb, garantieren jedoch keine
              ununterbrochene Verfügbarkeit des Dienstes. Wartungsarbeiten, Weiterentwicklung
              oder Umstände ausserhalb unserer Kontrolle können zu vorübergehenden
              Einschränkungen führen. Es besteht kein Anspruch auf bestimmte Funktionen oder
              deren Fortbestand.
            </p>
          </Section>

          <Section title="7. Haftung">
            <p>
              Soweit gesetzlich zulässig, ist unsere Haftung für leichte Fahrlässigkeit
              sowie für indirekte Schäden und Folgeschäden (z.&nbsp;B. Datenverlust,
              entgangene Vorteile) ausgeschlossen. Unberührt bleibt die Haftung für Vorsatz
              und grobe Fahrlässigkeit sowie jede weitere Haftung, die von Gesetzes wegen
              nicht ausgeschlossen werden kann. Wir empfehlen, wichtige Daten zusätzlich
              ausserhalb der App festzuhalten.
            </p>
          </Section>

          <Section title="8. Geistiges Eigentum">
            <p>
              Die App, ihr Design, ihre Software und Marken (insbesondere &laquo;
              {APP_NAME}&raquo;) sind rechtlich geschützt und bleiben unser Eigentum bzw.
              das Eigentum der jeweiligen Rechteinhaber. Du erhältst ein einfaches, nicht
              übertragbares Recht zur persönlichen Nutzung der App.
            </p>
          </Section>

          <Section title="9. Beendigung">
            <p>
              Du kannst die Nutzung jederzeit beenden und dein Konto in den Einstellungen
              der App löschen. Wir können Konten sperren oder löschen, wenn diese
              Bedingungen erheblich oder wiederholt verletzt werden; soweit zumutbar, weisen
              wir vorgängig darauf hin.
            </p>
          </Section>

          <Section title="10. Änderungen dieser Bedingungen">
            <p>
              Wir können diese Bedingungen anpassen, etwa bei neuen Funktionen oder
              geänderter Rechtslage. Wesentliche Änderungen zeigen wir in der App oder auf
              dieser Website an. Nutzt du den Dienst nach Inkrafttreten weiter, gilt dies
              als Zustimmung. Es gilt die jeweils aktuelle, auf dieser Seite veröffentlichte
              Fassung.
            </p>
          </Section>

          <Section title="11. Schlussbestimmungen">
            <p>
              Es gilt Schweizer Recht unter Ausschluss der Kollisionsnormen. Gerichtsstand
              ist – soweit gesetzlich zulässig – der Sitz des Anbieters; zwingende
              Gerichtsstände bleiben vorbehalten. Sollten einzelne Bestimmungen unwirksam
              sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </Section>

          <Section title="12. Kontakt">
            <p>
              Fragen zu diesen Bedingungen:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-dark underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        </article>
      </div>
      <Footer />
    </>
  );
}
