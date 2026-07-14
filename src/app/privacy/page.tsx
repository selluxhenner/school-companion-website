import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Wie ${APP_NAME} deine Daten erhebt, nutzt und schützt – Datenschutzerklärung nach Schweizer Datenschutzgesetz (revDSG).`,
  alternates: { canonical: "/privacy/" },
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

export default function PrivacyPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <article className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-2 text-sm text-slate-500">Stand: 13. Juli 2026</p>

          <section className="mt-8 space-y-4 leading-relaxed text-slate-700">
            <p>
              Diese Datenschutzerklärung informiert darüber, wie {APP_NAME} (&laquo;die
              App&raquo;, &laquo;wir&raquo;, &laquo;uns&raquo;) Personendaten bearbeitet, wenn
              du die {APP_NAME} Mobile-App für iOS und Android oder diese Website nutzt. Wir
              bearbeiten Personendaten nach den Grundsätzen des Schweizer Bundesgesetzes über
              den Datenschutz (DSG) und, soweit anwendbar, der EU-Datenschutz-Grundverordnung
              (DSGVO).
            </p>
          </section>

          <Section title="1. Verantwortlicher">
            <p>
              Verantwortlich für die Datenbearbeitung ist:
              <br />
              Serviweb, Kevin Schmid, Ostschweiz, Schweiz
              <br />
              E-Mail:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-dark underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="2. Welche Daten wir bearbeiten">
            <p>
              <strong>Kontodaten:</strong> Beim Erstellen eines Kontos erheben wir deine
              E-Mail-Adresse und einen von dir gewählten Anzeigenamen. Meldest du dich über
              Google an, erhalten wir von Google deine E-Mail-Adresse und deinen Namen
              (Abschnitt 5).
            </p>
            <p>
              <strong>Inhaltsdaten:</strong> Die App speichert die Schuldaten, die du selbst
              erfasst – Stundenplan (Fächer, Zimmer, Namen von Lehrpersonen), Prüfungen,
              Noten, Lernsessions sowie freiwillige Profilangaben wie Schule, Klasse oder
              Schwerpunktfach.
            </p>
            <p>
              <strong>Technische Daten:</strong> Beim Betrieb der App können technisch
              notwendige Daten anfallen (z.&nbsp;B. Geräte-Token für Push-Benachrichtigungen,
              Protokolldaten zur Fehlerbehebung). Wir erheben weder deinen Standort noch
              deine Kontakte oder Werbe-Identifikatoren und zeigen keine Werbung von Dritten.
            </p>
          </Section>

          <Section title="3. Zwecke der Bearbeitung">
            <p>
              Wir bearbeiten deine Daten ausschliesslich, um die Funktionen der App
              bereitzustellen: Anzeige deines Stundenplans, Erinnerungen an Prüfungen,
              Berechnung von Notendurchschnitten, Organisation von Lernsessions, Betrieb der
              Social-Funktionen sowie die Synchronisierung zwischen deinen Geräten
              (Cloud-Sync) inklusive Offline-Verfügbarkeit. Wir verkaufen keine Personendaten
              und nutzen sie nicht für Werbung oder Profiling.
            </p>
          </Section>

          <Section title="4. Social-Funktionen">
            <p>
              Die App enthält optionale Social-Funktionen: Über deinen persönlichen Code
              können dich Freundinnen und Freunde finden; in Lerngruppen sind die von dir
              geteilten Informationen (z.&nbsp;B. Anzeigename und Lernaktivität) für die
              Gruppenmitglieder sichtbar. Du entscheidest selbst, ob und was du teilst –
              diese Funktionen sind freiwillig und lassen sich jederzeit in der App
              deaktivieren.
            </p>
          </Section>

          <Section title="5. Anmeldung mit Google">
            <p>
              Als optionale Anmeldemethode bieten wir &laquo;Mit Google anmelden&raquo; an.
              Nutzt du sie, verarbeitet Google LLC deine Anmeldedaten gemäss eigener
              Datenschutzerklärung (
              <a
                href="https://policies.google.com/privacy"
                className="font-medium text-brand-dark underline"
              >
                policies.google.com/privacy
              </a>
              ). Wir erhalten dabei nur die für das Konto nötigen Angaben (E-Mail-Adresse,
              Name); wir erhalten keinen Zugriff auf dein Google-Passwort.
            </p>
          </Section>

          <Section title="6. Weitergabe an Dritte">
            <p>
              Wir geben deine Personendaten nicht an Dritte weiter, ausser dies ist für den
              Betrieb der App technisch erforderlich (z.&nbsp;B. Hosting- und
              Infrastruktur-Anbieter als Auftragsbearbeiter, die vertraglich zur
              Vertraulichkeit und zum Datenschutz verpflichtet sind) oder wir sind gesetzlich
              dazu verpflichtet.
            </p>
          </Section>

          <Section title="7. Datenspeicherung und Sicherheit">
            <p>
              Deine Daten werden auf gesicherten Servern gespeichert und bei der Übertragung
              verschlüsselt (TLS). Der Zugriff ist auf das für Betrieb und Support notwendige
              Minimum beschränkt. Lokale Daten auf deinem Gerät unterliegen zusätzlich den
              Schutzmechanismen deines Betriebssystems.
            </p>
          </Section>

          <Section title="8. Aufbewahrung und Löschung">
            <p>
              Wir bewahren deine Daten auf, solange dein Konto besteht. Einzelne Inhalte
              (z.&nbsp;B. Prüfungen, Noten, Lektionen) kannst du jederzeit direkt in der App
              löschen. Löschst du dein Konto, werden deine Personendaten innert 30 Tagen von
              unseren Servern entfernt, soweit keine gesetzliche Aufbewahrungspflicht
              besteht. Die Kontolöschung kannst du in den Einstellungen der App auslösen oder
              per E-Mail an{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-dark underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              beantragen.
            </p>
          </Section>

          <Section title="9. Deine Rechte">
            <p>
              Nach dem Schweizer DSG (und ggf. der DSGVO) hast du insbesondere das Recht auf
              Auskunft über die zu deiner Person bearbeiteten Daten, auf Berichtigung
              unrichtiger Daten, auf Löschung sowie auf Herausgabe bzw. Übertragung deiner
              Daten in einem gängigen Format. Wende dich dazu an{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-dark underline"
              >
                {CONTACT_EMAIL}
              </a>
              . Du hast zudem das Recht, dich bei der zuständigen Aufsichtsbehörde zu
              beschweren; in der Schweiz ist dies der Eidgenössische Datenschutz- und
              Öffentlichkeitsbeauftragte (EDÖB).
            </p>
          </Section>

          <Section title="10. Datenschutz von Kindern und Jugendlichen">
            <p>
              {APP_NAME} ist ein Schulplaner und richtet sich an Schülerinnen und Schüler,
              auch unter 16 Jahren. Die App verlangt keine persönlichen Angaben über das
              hinaus, was für das Konto nötig ist und was du selbst erfasst; sie zeigt keine
              Werbung von Dritten und verkauft keine Daten. Wenn du als Elternteil oder
              erziehungsberechtigte Person glaubst, dass dein Kind Personendaten angegeben
              hat, die entfernt werden sollen, kontaktiere uns – wir löschen die Daten
              umgehend.
            </p>
          </Section>

          <Section title="11. Diese Website">
            <p>
              Diese Website ist eine rein statische Informationsseite. Sie verwendet keine
              Cookies, keine Analyse-Tools und kein Tracking. Beim Aufruf fallen lediglich
              die technisch üblichen Server-Logdaten an (z.&nbsp;B. IP-Adresse, Zeitpunkt des
              Zugriffs), die vom Hosting-Anbieter zur Gewährleistung des Betriebs kurzzeitig
              gespeichert werden.
            </p>
          </Section>

          <Section title="12. Änderungen dieser Erklärung">
            <p>
              Wir können diese Datenschutzerklärung anpassen, etwa wenn sich die App oder
              die Rechtslage ändert. Es gilt die jeweils aktuelle, auf dieser Seite
              veröffentlichte Fassung.
            </p>
          </Section>

          <Section title="13. Kontakt">
            <p>
              Fragen zum Datenschutz oder zu deinen Daten:{" "}
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
