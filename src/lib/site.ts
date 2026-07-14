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
