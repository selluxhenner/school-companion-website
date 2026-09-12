/**
 * Ruleset: Kanton St.Gallen, Maturitätsprüfungsreglement des Gymnasiums (4.103)
 * vom 24. Juni 1998, amtsinterner Neudruck Oktober 2019 — as applied at the
 * Kantonsschule Wil. Article numbers below refer to that document.
 *
 *   Art. 5   the 13 Maturitätsfächer
 *   Art. 6   written exams: Deutsch, Französisch/Italienisch, Englisch/Griechisch,
 *            Mathematik, Schwerpunktfach
 *   Art. 7   oral exams: the same five, plus ONE of Biologie/Chemie/Physik and ONE of
 *            Geschichte/Geografie. Abs. 2: a science that is the Schwerpunktfach cannot
 *            be chosen. Abs. 3: these two are examined at the start of the 4th year
 *            (the "Vormatura" in the school's Terminplan).
 *   Art. 14  written grades in tenths, oral grades in halves
 *   Art. 15  Erfahrungsnote = the LAST Jahresnote of the subject; Prüfungsnote = mean of
 *            written and oral to one decimal; Maturanote = mean of PN and EN, rounded
 *            to a half grade. Subjects without an exam: MN = EN.
 *   Art. 16  passed when 2 × (sum of shortfalls below 4) ≤ sum of surpluses above 4,
 *            AND at most four Maturanoten below 4.
 *
 * Which year a subject's last Jahresnote comes from is the Promotionsreglement des
 * Gymnasiums (3.2.101), Anhang 1 (Heerbrugg, Sargans, Wil): Biologie, Chemie, Geografie
 * and Musik/BG end in the 3rd year; everything else runs to the 4th.
 *
 * The federal MAV 2023 (in force 1 Aug 2024) keeps Art. 16's two pass rules unchanged
 * (MAV Art. 26 Abs. 2), so the verdict logic holds for the GdZ cohorts as well.
 */

export const RULESET_ID = "sg-gym-4.103";
export const MAX_INSUFFICIENT = 4;

export type ExamKind = "none" | "writtenOral" | "oralEarly";

export interface SubjectDef {
  id: string;
  /** Display name. Alternatives (Italienisch, Griechisch, Musik) are chosen in `Choices`. */
  name: string;
  /** Which school year the Erfahrungsnote (last Jahresnote) comes from. */
  enYear: 3 | 4;
  /** How the subject is examined by default. `oralEarly` is decided by `Choices`. */
  exam: ExamKind;
  /** Shown as a short label in the row. */
  short: string;
}

export const SUBJECTS: SubjectDef[] = [
  { id: "de",  name: "Deutsch",                  short: "D",   enYear: 4, exam: "writtenOral" },
  { id: "l2",  name: "Französisch",              short: "F",   enYear: 4, exam: "writtenOral" },
  { id: "l3",  name: "Englisch",                 short: "E",   enYear: 4, exam: "writtenOral" },
  { id: "ma",  name: "Mathematik",               short: "M",   enYear: 4, exam: "writtenOral" },
  { id: "bio", name: "Biologie",                 short: "Bio", enYear: 3, exam: "none" },
  { id: "ch",  name: "Chemie",                   short: "Ch",  enYear: 3, exam: "none" },
  { id: "ph",  name: "Physik",                   short: "Ph",  enYear: 4, exam: "none" },
  { id: "ge",  name: "Geschichte",               short: "G",   enYear: 4, exam: "none" },
  { id: "geo", name: "Geografie",                short: "Gg",  enYear: 3, exam: "none" },
  { id: "art", name: "Bildnerisches Gestalten",  short: "BG",  enYear: 3, exam: "none" },
  { id: "spf", name: "Schwerpunktfach",          short: "SPF", enYear: 4, exam: "writtenOral" },
  { id: "ef",  name: "Ergänzungsfach",           short: "EF",  enYear: 4, exam: "none" },
  { id: "ma_arbeit", name: "Maturaarbeit",       short: "MA",  enYear: 4, exam: "none" },
];

/** Anhang 2 of the Promotionsreglement. */
export const SCHWERPUNKTFAECHER = [
  "Latein",
  "Italienisch",
  "Spanisch",
  "Physik und Anwendungen der Mathematik",
  "Biologie und Chemie",
  "Wirtschaft und Recht",
  "Bildnerisches Gestalten",
  "Musik",
] as const;

export const ERGAENZUNGSFAECHER = [
  "Physik",
  "Chemie",
  "Biologie",
  "Anwendungen der Mathematik",
  "Geschichte",
  "Geografie",
  "Philosophie",
  "Religionslehre",
  "Wirtschaft und Recht",
  "Pädagogik/Psychologie",
  "Bildnerisches Gestalten",
  "Musik",
  "Sport",
  "Informatik",
] as const;

export interface Choices {
  /** Art. 5 Ziff. 2 */
  l2: "Französisch" | "Italienisch";
  /** Art. 5 Ziff. 3 */
  l3: "Englisch" | "Griechisch";
  /** Art. 5 Ziff. 10 */
  art: "Bildnerisches Gestalten" | "Musik";
  spf: (typeof SCHWERPUNKTFAECHER)[number];
  ef: (typeof ERGAENZUNGSFAECHER)[number];
  /** Art. 7 Abs. 1 Ziff. 5 — the science examined orally at the start of the 4th year. */
  scienceOral: "bio" | "ch" | "ph";
  /** Art. 7 Abs. 1 Ziff. 6 */
  humanitiesOral: "ge" | "geo";
}

export const DEFAULT_CHOICES: Choices = {
  l2: "Französisch",
  l3: "Englisch",
  art: "Bildnerisches Gestalten",
  spf: "Wirtschaft und Recht",
  ef: "Geschichte",
  scienceOral: "bio",
  humanitiesOral: "ge",
};

/** Art. 7 Abs. 2 — the sciences a Schwerpunktfach takes out of the oral choice. */
export function blockedSciences(spf: Choices["spf"]): Array<"bio" | "ch" | "ph"> {
  if (spf === "Biologie und Chemie") return ["bio", "ch"];
  if (spf === "Physik und Anwendungen der Mathematik") return ["ph"];
  return [];
}

/** The subject list with the student's choices applied: names and exam kinds resolved. */
export function resolveSubjects(choices: Choices): SubjectDef[] {
  const blocked = blockedSciences(choices.spf);
  const science = blocked.includes(choices.scienceOral)
    ? (["bio", "ch", "ph"] as const).find((s) => !blocked.includes(s))!
    : choices.scienceOral;

  return SUBJECTS.map((s) => {
    switch (s.id) {
      case "l2":  return { ...s, name: choices.l2, short: choices.l2 === "Italienisch" ? "I" : "F" };
      case "l3":  return { ...s, name: choices.l3, short: choices.l3 === "Griechisch" ? "Gr" : "E" };
      case "art": return { ...s, name: choices.art, short: choices.art === "Musik" ? "Mu" : "BG" };
      case "spf": return { ...s, name: `SPF ${choices.spf}` };
      case "ef":  return { ...s, name: `EF ${choices.ef}` };
      case "bio": case "ch": case "ph":
        return { ...s, exam: s.id === science ? "oralEarly" : "none" };
      case "ge": case "geo":
        return { ...s, exam: s.id === choices.humanitiesOral ? "oralEarly" : "none" };
      default:    return s;
    }
  });
}
