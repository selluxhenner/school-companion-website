/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE CONFIG — every placeholder you need to fill lives here.
 *  Search for "TODO" to find them all.
 * ─────────────────────────────────────────────────────────────────
 */

export const APP_NAME = "School Companion";

// Production domain (no trailing slash).
// Used for canonical URLs, Open Graph, sitemap and robots.txt.
export const SITE_URL = "https://schoolcompanion.ch";

// TODO: APP_ONE_LINER — one-sentence value prop (this is the H1).
export const APP_ONE_LINER = "Dein intelligenter Lernbegleiter.";

// Keyword-bearing <title> for search results (brand + category + top features).
// The H1 keeps the brand voice; this is what Google shows and ranks.
export const SEO_TITLE =
  "School Companion – Schulplaner-App: Stundenplan, Noten & Prüfungen";

// TODO: APP_DESCRIPTION — 2–3 sentence paragraph of what the app does.
export const APP_DESCRIPTION =
  "School Companion vereint Stundenplan, Prüfungen und Noten in einer App – mit Pomodoro-Timer, smarten Lernsessions und Lerngruppen, um gemeinsam mit Freunden zu lernen. Gemacht für Schweizer Schülerinnen und Schüler. Kostenlos für iOS und Android – kein Abo, keine versteckten Kosten.";

// Store listing URLs.
export const APP_STORE_URL =
  "https://apps.apple.com/ch/app/school-companion-production/id6760979206";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=app.school_companion";

// TODO: CONTACT_EMAIL — support email for the store listings & privacy page.
// (Email only — no phone number or address anywhere on this site.)
export const CONTACT_EMAIL = "info@serviweb.ch";

/**
 * TODO: FEATURES — adjust titles/lines to match your store listing.
 * Icons are keys resolved in src/components/Features.tsx.
 */
export const FEATURES = [
  {
    icon: "calendar",
    title: "Dein Stundenplan, immer aktuell",
    line: "Farbcodierte Tages-, Wochen- und Monatsansicht mit Lehrpersonen, Zimmern und Pausen.",
  },
  {
    icon: "exam",
    title: "Keine Prüfung mehr verpassen",
    line: "Behalte jede Prüfung im Blick – mit Countdown und Erinnerungen.",
  },
  {
    icon: "grades",
    title: "Noten mit Insights",
    line: "Durchschnitte, Notenziele und ein integrierter Matura-Rechner zeigen dir, wo du stehst.",
    href: "/matura/",
    cta: "Matura-Rechner im Browser ausprobieren",
  },
  {
    icon: "timer",
    title: "Fokus, wenn es zählt",
    line: "Pomodoro-Timer und smarte Lernsessions organisieren dein Lernen.",
  },
  {
    icon: "social",
    title: "Gemeinsam lernen",
    line: "Teile deinen Code, tritt Lerngruppen bei und lernt zusammen.",
  },
  {
    icon: "sync",
    title: "Überall synchron",
    line: "Dein Account hält alle Geräte aktuell – funktioniert auch offline.",
  },
] as const;

/**
 * FAQ section — concise, self-contained answers so search and answer
 * engines (Google, AI Overviews, ChatGPT, Perplexity) can quote them.
 * Also emitted as FAQPage JSON-LD on the home page.
 */
export const FAQS = [
  {
    q: "Was ist School Companion?",
    a: "School Companion ist eine kostenlose Schulplaner-App für iOS und Android, die Stundenplan, Prüfungen und Noten in einer App vereint – ergänzt durch Pomodoro-Timer, smarte Lernsessions und Lerngruppen. Entwickelt für Schweizer Schülerinnen und Schüler.",
  },
  {
    q: "Ist School Companion wirklich kostenlos?",
    a: "Ja. School Companion ist gratis im App Store und bei Google Play erhältlich – ohne Abo und ohne versteckte Kosten.",
  },
  {
    q: "Für wen ist die App gemacht?",
    a: "Für Schülerinnen und Schüler in der Schweiz – von der Sekundarschule über das Gymnasium bis zur Berufsschule. Der integrierte Matura-Rechner zeigt dir jederzeit, welche Noten du für deinen Abschluss brauchst.",
  },
  {
    q: "Auf welchen Geräten funktioniert School Companion?",
    a: "Die App gibt es für iOS und Android. Dein Account synchronisiert alle Geräte automatisch – und die App funktioniert auch offline.",
  },
  {
    q: "Kann ich zusammen mit Freunden lernen?",
    a: "Ja. Teile deinen persönlichen Freundescode, tritt Lerngruppen bei und lernt gemeinsam – mit geteilten Lernsessions und Prüfungsübersicht.",
  },
  {
    q: "Wie starte ich mit School Companion?",
    a: "App herunterladen, Stundenplan einmal erfassen – mit Fächern, Zimmern und Lehrpersonen – und ab dann bleiben Lektionen, Prüfungen und Noten automatisch aktuell.",
  },
] as const;

/** Screenshots shown in the showcase section (files in /public/screenshots). */
export const SCREENSHOTS = [
  {
    src: "/screenshots/schedule.jpeg",
    alt: "Stundenplan-Ansicht mit farbcodierten Lektionen, Zimmern und Pausen, umschaltbar zwischen Tag, Woche und Monat",
    caption: "Tag, Woche oder Monat – dein Stundenplan, farbcodiert.",
  },
  {
    src: "/screenshots/grades.jpeg",
    alt: "Noten-Ansicht mit aktuellem Durchschnitt, Notenziel sowie Notenziel- und Matura-Rechner",
    caption: "Durchschnitt, Notenziele und Matura-Rechner inklusive.",
  },
  {
    src: "/screenshots/study.jpeg",
    alt: "Study-Ansicht mit automatisch generierten Lernsessions und Prüfungsübersicht",
    caption: "Smarte Lernsessions und Prüfungs-Tracking.",
  },
  {
    src: "/screenshots/social.jpeg",
    alt: "Social-Ansicht mit Schülerprofil, persönlichem Freundescode und Lerngruppen",
    caption: "Teile deinen Code und lerne gemeinsam mit Freunden.",
  },
] as const;

/**
 * /matura/ — the public Matura-Rechner. Copy is Swiss German (ss, du-form), like the app.
 */
export const MATURA_PATH = "/matura/";

export const MATURA_TITLE = "Matura-Rechner – Bestehe ich die Matura?";

export const MATURA_DESCRIPTION =
  "Kostenloser Matura-Rechner für die Kantonsschule Wil: Erfahrungsnoten eintragen und sofort sehen, ob du bestehst, wie hoch dein Saldo ist und welche Noten du in den offenen Prüfungen noch brauchst. Kein Login, nichts wird hochgeladen.";

export const MATURA_FAQS = [
  {
    q: "Wie wird die Maturanote berechnet?",
    a: "In geprüften Fächern ist die Maturanote der Durchschnitt aus Erfahrungsnote und Prüfungsnote, auf eine halbe Note gerundet. Die Erfahrungsnote ist die letzte Jahresnote im Fach, die Prüfungsnote der Durchschnitt aus schriftlicher und mündlicher Prüfung auf eine Dezimale. In Fächern ohne Prüfung ist die Maturanote gleich der Erfahrungsnote (Art. 15 Maturitätsprüfungsreglement des Gymnasiums, Kanton St.Gallen).",
  },
  {
    q: "Wie viele ungenügende Noten darf ich haben?",
    a: "Höchstens vier Maturanoten dürfen unter 4 liegen. Zusätzlich muss der Saldo stimmen: Die doppelte Summe aller Abweichungen unter 4 darf nicht grösser sein als die Summe aller Abweichungen über 4 (Art. 16). Beide Bedingungen müssen erfüllt sein.",
  },
  {
    q: "Was ist der Saldo?",
    a: "Für jede Maturanote zählt der Abstand zu 4. Über 4 zählt er einfach, unter 4 doppelt. Eine 5 bringt +1, eine 3.5 bringt −1. Die Summe über alle 13 Maturanoten ist der Saldo. Er muss mindestens 0 sein.",
  },
  {
    q: "Welche Fächer werden geprüft?",
    a: "Schriftlich und mündlich: Deutsch, Französisch oder Italienisch, Englisch oder Griechisch, Mathematik und das Schwerpunktfach. Nur mündlich, bereits zu Beginn der 4. Klasse (Vormatura): ein Fach aus Biologie, Chemie, Physik und ein Fach aus Geschichte, Geografie. Ist eine Naturwissenschaft dein Schwerpunktfach, kannst du sie nicht als Vormatura-Fach wählen (Art. 6 und 7).",
  },
  {
    q: "Zählt die Maturaarbeit?",
    a: "Ja. Die Maturaarbeit ist eines der 13 Fächer, die für die Matura zählen. Ihre Note geht direkt als Maturanote in Saldo und Zählung ein. Sport, Religion oder Philosophie und Freifächer stehen zwar im Zeugnis, zählen aber nicht.",
  },
  {
    q: "Gilt das für jede Kantonsschule?",
    a: "Der Rechner setzt das Maturitätsprüfungsreglement des Gymnasiums des Kantons St.Gallen um und ist mit dem Beispiel der Kantonsschule Wil geprüft. Die beiden Bestehensregeln – Saldo und höchstens vier ungenügende Noten – sind schweizweit gleich (Maturitätsanerkennungsverordnung, Art. 26). Welche Fächer geprüft werden und aus welchem Jahr die Erfahrungsnote stammt, regelt jeder Kanton selbst.",
  },
  {
    q: "Wo werden meine Noten gespeichert?",
    a: "Nur in deinem Browser. Nichts wird an einen Server geschickt. Löschst du die Website-Daten oder tippst auf Zurücksetzen, sind sie weg.",
  },
] as const;
