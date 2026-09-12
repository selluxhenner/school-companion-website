/**
 * Pure Matura arithmetic for the ruleset in ./rules.ts. No DOM, no storage.
 *
 * Rounding follows the school's own Excel sheet ("Bestehensnormen für die Matura ab
 * 2014"): RUNDEN rounds midpoints away from zero, so a Maturanote of 4.25 becomes 4.5.
 * An epsilon keeps binary floats from turning 4.25 into 4.2499… first.
 */
import { MAX_INSUFFICIENT, type ExamKind, type SubjectDef } from "./rules";

const EPS = 1e-9;

/** Nearest half grade, midpoints up (Art. 15 Abs. 2 as the sheet applies it). */
export const roundHalf = (v: number): number => Math.round(v * 2 + EPS) / 2;
/** Nearest tenth (Art. 15 Abs. 1 lit. b: "ausgerechnet auf eine Dezimale"). */
export const roundTenth = (v: number): number => Math.round(v * 10 + EPS) / 10;
/** Smallest grade on the given step that is ≥ v. */
export const ceilToStep = (v: number, step: number): number =>
  Math.ceil(v / step - EPS) * step;
export const clampGrade = (v: number): number => Math.min(6, Math.max(1, v));

/** "4,5", "4.5", " 5 " → number; anything else → null. Grades live in [1, 6]. */
export function parseGrade(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = raw.trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 1 || n > 6) return null;
  return n;
}

export interface GradeEntry {
  /** Erfahrungsnote — the last Jahresnote. For the Maturaarbeit: its grade. */
  en: string;
  written: string;
  oral: string;
}

export type Grades = Record<string, GradeEntry>;

export const emptyEntry = (): GradeEntry => ({ en: "", written: "", oral: "" });

export type Stage = "empty" | "awaitingBoth" | "awaitingWritten" | "awaitingOral" | "final";

export interface Row {
  def: SubjectDef;
  en: number | null;
  written: number | null;
  oral: number | null;
  /** Prüfungsnote from the parts that exist (null when none do). */
  pn: number | null;
  /** Maturanote; open exam parts are forecast at the Erfahrungsnote. */
  mn: number | null;
  saldo: number | null;
  stage: Stage;
  /** True when `mn` rests on a forecast rather than on final grades. */
  forecast: boolean;
}

export const saldoOf = (mn: number): number => (mn < 4 ? (mn - 4) * 2 : mn - 4);

function partsFor(kind: ExamKind): { written: boolean; oral: boolean } {
  return { written: kind === "writtenOral", oral: kind !== "none" };
}

export function evaluateSubject(def: SubjectDef, entry: GradeEntry): Row {
  const en = parseGrade(entry.en);
  const wants = partsFor(def.exam);
  const written = wants.written ? parseGrade(entry.written) : null;
  const oral = wants.oral ? parseGrade(entry.oral) : null;

  const base: Omit<Row, "pn" | "mn" | "saldo" | "stage" | "forecast"> = { def, en, written, oral };

  if (en === null) {
    return { ...base, pn: null, mn: null, saldo: null, stage: "empty", forecast: false };
  }

  if (def.exam === "none") {
    // Not examined (incl. Maturaarbeit): the Maturanote is the Erfahrungsnote — still
    // rounded to a half (Art. 15 Abs. 2), in case someone types a 5.4.
    const mn = roundHalf(en);
    return { ...base, pn: null, mn, saldo: saldoOf(mn), stage: "final", forecast: false };
  }

  const missingW = wants.written && written === null;
  const missingO = wants.oral && oral === null;
  const stage: Stage =
    missingW && missingO ? "awaitingBoth" : missingW ? "awaitingWritten" : missingO ? "awaitingOral" : "final";

  const known = [written, oral].filter((g): g is number => g !== null);
  const pn = known.length ? roundTenth(known.reduce((a, b) => a + b, 0) / known.length) : null;

  // Forecast: an open part scores like the Erfahrungsnote.
  const fW = wants.written ? (written ?? en) : null;
  const fO = wants.oral ? (oral ?? en) : null;
  const fParts = [fW, fO].filter((g): g is number => g !== null);
  const fPn = roundTenth(fParts.reduce((a, b) => a + b, 0) / fParts.length);
  const mn = roundHalf((fPn + en) / 2);

  return { ...base, pn, mn, saldo: saldoOf(mn), stage, forecast: stage !== "final" };
}

export type Status = "empty" | "incomplete" | "forecast" | "final";

export interface Result {
  rows: Row[];
  status: Status;
  /** Number of subjects still without an Erfahrungsnote. */
  missing: number;
  /** Number of exam parts still open. */
  openParts: number;
  saldo: number;
  insufficient: number;
  sum: number;
  mean: number;
  /** Art. 16 lit. a */
  saldoOk: boolean;
  /** Art. 16 lit. b */
  countOk: boolean;
  /** Only meaningful when status is "forecast" or "final". */
  passed: boolean;
}

export function evaluate(subjects: SubjectDef[], grades: Grades): Result {
  const rows = subjects.map((def) => evaluateSubject(def, grades[def.id] ?? emptyEntry()));
  const scored = rows.filter((r) => r.mn !== null);
  const missing = rows.length - scored.length;
  const openParts = rows.reduce((n, r) => {
    const wants = partsFor(r.def.exam);
    return n + (wants.written && r.written === null ? 1 : 0) + (wants.oral && r.oral === null ? 1 : 0);
  }, 0);

  const saldo = round1(scored.reduce((a, r) => a + (r.saldo ?? 0), 0));
  const insufficient = scored.filter((r) => (r.mn ?? 4) < 4).length;
  const sum = round1(scored.reduce((a, r) => a + (r.mn ?? 0), 0));
  const mean = scored.length ? Math.round((sum / scored.length) * 100) / 100 : 0;

  const status: Status =
    scored.length === 0 ? "empty" : missing > 0 ? "incomplete" : rows.some((r) => r.forecast) ? "forecast" : "final";

  const saldoOk = saldo >= 0;
  const countOk = insufficient <= MAX_INSUFFICIENT;
  return { rows, status, missing, openParts, saldo, insufficient, sum, mean, saldoOk, countOk, passed: saldoOk && countOk };
}

const round1 = (v: number) => Math.round(v * 10 + EPS) / 10;
