import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Konto und Daten löschen",
  description: `So löschst du dein ${APP_NAME}-Konto und alle zugehörigen Daten – Schritte, was gelöscht wird und wie lange es dauert.`,
  alternates: { canonical: "/delete-account/" },
};

const SUBJECT = `${APP_NAME}: Konto und Daten löschen`;
const BODY = [
  `Bitte lösche mein ${APP_NAME}-Konto und alle zugehörigen Daten.`,
  "",
  "Mit dieser E-Mail-Adresse habe ich mich in der App registriert (Absender dieser Mail).",
  "Ich möchte: [ ] alles löschen  [ ] nur die Nutzungsstatistik löschen",
].join("\n");

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

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

export default function DeleteAccountPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <article className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Konto und Daten löschen
          </h1>
          <p className="mt-2 text-sm text-slate-500">Stand: 22. Oktober 2026</p>

          <section className="mt-8 space-y-4 leading-relaxed text-slate-700">
            <p>
              Du kannst jederzeit und kostenlos verlangen, dass dein {APP_NAME}-Konto und alle
              dazugehörigen Daten gelöscht werden. Du musst dafür keinen Grund angeben. Auch
              Eltern und Erziehungsberechtigte können die Löschung für ihr Kind beantragen.
            </p>
            <p>
              <a
                href={MAILTO}
                className="inline-block rounded-lg bg-brand-dark px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                Löschung per E-Mail beantragen
              </a>
            </p>
          </section>

          <Section title="So funktioniert es">
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong>E-Mail senden.</strong> Schreib an{" "}
                <a
                  href={MAILTO}
                  className="font-medium text-brand-dark underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                mit dem Betreff &laquo;{SUBJECT}&raquo; (der Button oben füllt beides für dich
                aus). Sende die E-Mail <strong>von der Adresse, mit der du dich in der App
                registriert hast</strong> &ndash; so können wir sicherstellen, dass das Konto
                wirklich dir gehört. Bei Google-Anmeldung ist das die E-Mail-Adresse deines
                Google-Kontos.
              </li>
              <li>
                <strong>Bestätigung.</strong> Wir bestätigen dir den Eingang. Wenn wir
                unsicher sind, ob die Anfrage von dir stammt, stellen wir dir eine
                Kontrollfrage zu deinem Konto.
              </li>
              <li>
                <strong>Löschung.</strong> Wir löschen dein Konto und deine Daten innert 30
                Tagen und teilen dir per E-Mail mit, wenn es erledigt ist.
              </li>
            </ol>
            <p>
              Eltern oder Erziehungsberechtigte schreiben bitte ebenfalls und nennen die
              E-Mail-Adresse, mit der das Konto des Kindes registriert ist.
            </p>
          </Section>

          <Section title="Was gelöscht wird">
            <ul className="list-disc space-y-2 pl-6">
              <li>dein Konto und der Zugang zur App (Anmeldung per E-Mail oder Google);</li>
              <li>
                dein Profil: Name, Schule, Klasse, Schwerpunktfach und weitere freiwillige
                Angaben;
              </li>
              <li>
                alle Inhalte, die du erfasst hast: Stundenpläne, Prüfungen, Hausaufgaben,
                Noten, Lernsessions, Freunde und Einstellungen;
              </li>
              <li>deine Geräte-Token für Push-Benachrichtigungen;</li>
              <li>
                deine Nutzungsstatistik (Zusammenfassung pro Konto, siehe{" "}
                <Link href="/privacy/" className="font-medium text-brand-dark underline">
                  Datenschutzerklärung, Abschnitt 7
                </Link>
                ) und noch nicht gelöschte Rohdaten dazu.
              </li>
            </ul>
          </Section>

          <Section title="Was bleibt">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Zusammengefasste Tageswerte der App-Nutzung (z.&nbsp;B. &laquo;an einem Tag
                haben 25 Personen die App geöffnet&raquo;). Sie enthalten keine Angabe, die
                auf dich zurückgeführt werden könnte.
              </li>
              <li>
                Technische Protokolldaten des Hostings, die automatisch nach kurzer Zeit
                gelöscht werden.
              </li>
              <li>
                Daten, die wir gesetzlich aufbewahren müssen. Das ist bei {APP_NAME} nach
                heutigem Stand nicht der Fall.
              </li>
            </ul>
          </Section>

          <Section title="Nur einen Teil löschen">
            <p>
              Du musst nicht das ganze Konto löschen. Einzelne Prüfungen, Noten, Lektionen
              und andere Inhalte kannst du jederzeit direkt in der App löschen. Die
              Nutzungsstatistik schaltest du unter &laquo;Einstellungen &rarr; Privatsphäre
              &amp; Sicherheit &rarr; Nutzungsstatistik teilen&raquo; aus. Möchtest du, dass
              auch die bereits übermittelte Nutzungsstatistik gelöscht wird, ohne dein Konto
              zu löschen, schreib uns über den Button oben und wähle &laquo;nur die
              Nutzungsstatistik löschen&raquo;.
            </p>
          </Section>

          <Section title="Hinweis">
            <p>
              Die Löschung ist endgültig. Gelöschte Daten können wir nicht wiederherstellen.
              Eine Löschfunktion direkt in der App ist geplant. Bis dahin läuft die Löschung
              über diese Seite. Mehr zum Umgang mit deinen Daten steht in der{" "}
              <Link href="/privacy/" className="font-medium text-brand-dark underline">
                Datenschutzerklärung
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
