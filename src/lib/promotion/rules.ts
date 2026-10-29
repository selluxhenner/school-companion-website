/**
 * Rulesets: Promotionsreglement des Gymnasiums, Kanton St.Gallen (Handbuch Mittelschulen 3.2.101).
 *
 *   old  vom 24. Juni 1998, amtsinterner Neudruck Juli 2026 — Kantonsschulen Heerbrugg,
 *        Sargans und Wil (Anhang 1). Applies to classes that finish by 1 Aug 2029.
 *   gdz  vom 17. Juni 2026 ("Gymnasium der Zukunft") — for pupils who enter the 1st class
 *        from 1 Aug 2026 at the Kantonsschulen am Burggraben, Sargans and Wil.
 *
 * Both share the rule at the core (Art. 2): promoted when the doubled sum of the shortfalls
 * below 4 is not greater than the sum of the surpluses above 4 — Saldo ≥ 0. Unlike the Matura
 * there is no cap on the number of insufficient grades.
 *
 * Not modelled, and the page says so: the Konferenz's discretion (old Art. 6bis, GdZ Art. 13),
 * absences (GdZ Art. 5), the sport classes and the IB / bilingual annexes.
 *
 * Article numbers in the copy below refer to the reglement named by the ruleset.
 */
import { SCHWERPUNKTFAECHER } from "@/lib/matura/rules";

export type RulesetId = "old" | "gdz";

export const RULESETS: Record<RulesetId, { label: string; short: string; source: string }> = {
  old: {
    label: "Eingetreten bis August 2025",
    short: "bisheriges Reglement",
    source: "Promotionsreglement des Gymnasiums vom 24. Juni 1998 (Neudruck Juli 2026)",
  },
  gdz: {
    label: "Eingetreten ab August 2026",
    short: "neues Reglement (Gymnasium der Zukunft)",
    source: "Promotionsreglement des Gymnasiums vom 17. Juni 2026",
  },
};

export const SAFETY_ZONE = -1;

export interface Choices {
  /** Art. 5 / Anhang 1: Französisch oder Italienisch */
  l2: "Französisch" | "Italienisch";
  /** Old reglement only: Englisch oder Griechisch */
  l3: "Englisch" | "Griechisch";
  /** Decides the Musik / Bildnerisches Gestalten slot in the old 1st year. */
  spf: (typeof SCHWERPUNKTFAECHER)[number];
}

export const DEFAULT_CHOICES: Choices = { l2: "Französisch", l3: "Englisch", spf: "Wirtschaft und Recht" };

export interface SubjectInput {
  /** Stable across moments, so a grade survives switching the semester. */
  key: string;
  label: string;
}

export interface SubjectDef {
  id: string;
  name: string;
  /** One input, or two (Musik + Bildende Kunst) whose rounded mean is the Zeugnisnote. */
  inputs: SubjectInput[];
}

interface Consequences {
  pass: string;
  fail: string;
  /** −1.0 ≤ Saldo < 0 at the end of the Probezeit. */
  zone?: string;
  /** Fail, when the pupil is currently promoted provisionally. */
  failProvisional?: string;
}

export interface Moment {
  id: string;
  label: string;
  year: 1 | 2 | 3;
  /** The Probezeit semester: a Saldo down to −1.0 leaves the Konferenz a way out. */
  probation?: boolean;
  /** Shows the "currently provisional" switch with this label. */
  provisionalLabel?: string;
  basis: string;
  basisProvisional?: string;
  consequences: Consequences;
}

const EXCLUDE_NOTE = "Wer schon einmal nicht promoviert wurde, wird ausgeschlossen";

const OLD_MOMENTS: Moment[] = [
  {
    id: "y1s1",
    label: "Ende 1. Semester (Probezeit)",
    year: 1,
    probation: true,
    basis: "Noten des 1. Semesters (Art. 1 Abs. 1 lit. a, Art. 8bis)",
    consequences: {
      pass: "Du wirst nach der Probezeit definitiv aufgenommen (Art. 8bis Abs. 1 lit. a).",
      fail: "Du wirst abgewiesen (Art. 8bis Abs. 1 lit. b).",
      zone: "Die Promotionskonferenz kann dich provisorisch ins 2. Semester promovieren (Art. 8bis Abs. 2). Sie muss das nicht tun — sonst wirst du abgewiesen.",
    },
  },
  {
    id: "y1s2",
    label: "Ende 1. Schuljahr",
    year: 1,
    provisionalLabel: "Ich wurde nach der Probezeit provisorisch ins 2. Semester promoviert",
    basis: "Noten des 2. Semesters (Art. 1 Abs. 1 lit. a)",
    basisProvisional: "Nach provisorischer Promotion zählen die Leistungen im ganzen Schuljahr (Art. 1 Abs. 1 lit. c)",
    consequences: {
      pass: "Du wirst ins 2. Schuljahr promoviert (Art. 2).",
      fail: "Du wirst provisorisch ins 2. Schuljahr promoviert (Art. 3).",
      failProvisional: "Du wirst ausgeschlossen (Art. 8bis Abs. 2).",
    },
  },
  {
    id: "y2s1",
    label: "Mitte 2. Schuljahr (nach dem 1. Semester)",
    year: 2,
    provisionalLabel: "Ich bin provisorisch ins 2. Schuljahr promoviert",
    basis: "Noten des 1. Semesters im 2. Schuljahr (Art. 1 Abs. 1 lit. b)",
    consequences: {
      pass: "Du bist definitiv promoviert (Art. 2).",
      fail: "Du wirst provisorisch weiter promoviert (Art. 3) und am Ende des 2. Schuljahrs noch einmal geprüft.",
      failProvisional: `Du wirst nicht promoviert und wiederholst die vorangehende Klasse (Art. 4 Abs. 1 lit. a, Abs. 2). ${EXCLUDE_NOTE} (Art. 5).`,
    },
  },
  {
    id: "y2s2",
    label: "Ende 2. Schuljahr (nur nach provisorischer Promotion)",
    year: 2,
    basis: "Leistungen im Schuljahr (Art. 1 Abs. 1 lit. c)",
    consequences: {
      pass: "Du bist definitiv promoviert und kommst ins 3. Schuljahr (Art. 2).",
      fail: `Du wirst nicht promoviert und wiederholst die vorangehende Klasse (Art. 4 Abs. 1 lit. b, Abs. 2). ${EXCLUDE_NOTE} (Art. 5).`,
    },
  },
  {
    id: "y3",
    label: "Ende 3. Schuljahr",
    year: 3,
    basis: "Leistungen im Schuljahr (Art. 1 Abs. 1 lit. d)",
    consequences: {
      pass: "Du wirst ins 4. Schuljahr promoviert (Art. 2).",
      fail: `Du wirst nicht promoviert und wiederholst die vorangehende Klasse (Art. 4 Abs. 1 lit. b, Abs. 2). ${EXCLUDE_NOTE} (Art. 5).`,
    },
  },
];

const GDZ_MOMENTS: Moment[] = [
  {
    id: "s1",
    label: "Ende 1. Semester (Probezeit)",
    year: 1,
    probation: true,
    basis: "Noten des 1. Semesters (Art. 1, Art. 6)",
    consequences: {
      pass: "Du bist definitiv promoviert (Art. 2).",
      fail: "Du wirst ausgeschlossen (Art. 6 Abs. 1).",
      zone: "Die Promotionskonferenz kann dich provisorisch ins 2. Semester promovieren (Art. 6 Abs. 2). Sie muss das nicht tun — sonst wirst du ausgeschlossen.",
    },
  },
  {
    id: "s2",
    label: "Ende 1. Schuljahr (2. Semester)",
    year: 1,
    provisionalLabel: "Ich wurde nach dem 1. Semester provisorisch promoviert",
    basis: "Noten des 2. Semesters (Art. 1, Art. 7)",
    consequences: {
      pass: "Du wirst ins 3. und 4. Semester promoviert (Art. 7 Abs. 1).",
      fail: "Du wirst provisorisch ins 3. Semester promoviert (Art. 7 Abs. 2).",
      failProvisional: "Du wirst ausgeschlossen (Art. 7 Abs. 3).",
    },
  },
  {
    id: "s3",
    label: "Mitte 2. Schuljahr (3. Semester)",
    year: 2,
    provisionalLabel: "Ich bin provisorisch ins 3. Semester promoviert",
    basis: "Noten des 3. Semesters (Art. 1, Art. 8)",
    consequences: {
      pass: "Du bist definitiv promoviert (Art. 2).",
      fail: "Für das 3. Semester nennt das Reglement nur die Folge für provisorisch Promovierte (Art. 8). Frag bei deiner Schule nach.",
      failProvisional: "Du wiederholst das 2. und 3. Semester (Art. 8 Abs. 1).",
    },
  },
  {
    id: "s4",
    label: "Ende 2. Schuljahr (4. Semester)",
    year: 2,
    basis: "Leistungen im 3. und 4. Semester (Art. 9)",
    consequences: {
      pass: "Du bist definitiv promoviert (Art. 2).",
      fail: `Du wiederholst das 3. und 4. Semester (Art. 9). ${EXCLUDE_NOTE} (Art. 11).`,
    },
  },
  {
    id: "s6",
    label: "Ende 3. Schuljahr (6. Semester)",
    year: 3,
    basis: "Leistungen im 5. und 6. Semester (Art. 10)",
    consequences: {
      pass: "Du bist definitiv promoviert (Art. 2).",
      fail: `Du wiederholst das 5. und 6. Semester (Art. 10). ${EXCLUDE_NOTE} (Art. 11).`,
    },
  },
];

export const MOMENTS: Record<RulesetId, Moment[]> = { old: OLD_MOMENTS, gdz: GDZ_MOMENTS };

export const momentOf = (ruleset: RulesetId, id: string): Moment | undefined =>
  MOMENTS[ruleset].find((m) => m.id === id);

const single = (id: string, name: string, key = id): SubjectDef => ({ id, name, inputs: [{ key, label: name }] });

const artPair: SubjectDef = {
  id: "art",
  name: "Musik und Bildnerisches Gestalten",
  inputs: [
    { key: "art.m", label: "Musik" },
    { key: "art.b", label: "Bildnerisches Gestalten" },
  ],
};

/**
 * Anhang 1, as it applies to this moment. The old reglement's first year turns on the
 * Schwerpunktfach: whoever has Musik takes Bildnerisches Gestalten, and vice versa; with any
 * other Schwerpunktfach the rounded mean of both counts. Religion oder Philosophie has only a
 * Jahresnote at the end of the 2nd year, so it is not a promotion subject in mid-year 2.
 */
export function subjectsFor(ruleset: RulesetId, moment: Moment, c: Choices): SubjectDef[] {
  const l2 = single("l2", c.l2);
  const rel = single("rel", "Religion oder Philosophie");

  if (ruleset === "old") {
    const l3 = single("l3", c.l3);
    const core = [single("de", "Deutsch"), l2, l3, single("ma", "Mathematik"), single("bio", "Biologie"), single("ch", "Chemie")];
    const spf = single("spf", "Schwerpunktfach");
    const art = single("art", "Musik oder Bildnerisches Gestalten", "art.one");
    const wr = single("ewr", "Einführung in Wirtschaft und Recht");
    if (moment.year === 1) {
      const slot = c.spf === "Musik" ? single("art", "Bildnerisches Gestalten", "art.b") : c.spf === "Bildnerisches Gestalten" ? single("art", "Musik", "art.m") : artPair;
      return [...core, single("ge", "Geschichte"), single("geo", "Geografie"), slot, spf];
    }
    const mid = [...core, single("ph", "Physik"), single("ge", "Geschichte"), single("geo", "Geografie"), wr, art, spf];
    return moment.id === "y2s1" ? mid : [...mid, rel];
  }

  const core = [single("de", "Deutsch"), l2, single("en", "Englisch"), single("ma", "Mathematik"), single("bio", "Biologie"), single("ch", "Chemie")];
  const spf = single("spf", "Schwerpunktfach");
  const sport = single("sport", "Sport");
  const inf = single("inf", "Informatik inkl. ICT");
  const wr = single("wr", "Wirtschaft und Recht");
  const iwp = single("iwp", "Interdisziplinäres Wahlpflichtfach");
  const art = single("art", "Bildende Kunst und/oder Musik", "art.one");
  const ge = single("ge", "Geschichte (inkl. Politische Bildung)");
  const geo = single("geo", "Geografie (inkl. BNE)");
  if (moment.year === 1) return [...core, inf, geo, wr, { ...artPair, name: "Musik und Bildende Kunst" }, spf, sport];
  if (moment.year === 2) return [...core, single("ph", "Physik"), inf, ge, geo, wr, art, spf, iwp, sport, rel];
  return [...core, single("ph", "Physik"), ge, geo, art, spf, iwp, sport, rel];
}
