/**
 * Pure Promotion arithmetic for the rulesets in ./rules.ts. No DOM, no storage.
 *
 * Art. 2 (both reglements): promoted when the doubled sum of the shortfalls below 4 is not
 * greater than the sum of the surpluses above 4 — the same Saldo as the Matura, without the
 * "at most four insufficient grades" rule.
 *
 * Rounding: the Promotionsnote is a whole or half grade (Art. 14 MSV, sGS 215.11). A quarter
 * rounds up — the Verwaltungsgericht SG, B 2012/89 — so 3.75 → 4.0 and 4.25 → 4.5. A student
 * can type either the Zeugnisnote or today's average; the row shows what it rounds to.
 */
import { parseGrade, roundHalf, saldoOf } from "@/lib/matura/engine";
import { SAFETY_ZONE, type Moment, type SubjectDef } from "./rules";

export { parseGrade, roundHalf, saldoOf };

/** One field per input key; a Musik + Bildende Kunst pair has two. */
export type Grades = Record<string, string>;

export interface Row {
  def: SubjectDef;
  /** The typed values, parsed — one per input. */
  parsed: Array<number | null>;
  /** The Promotionsnote (whole or half grade), once every input of the row is filled. */
  note: number | null;
  saldo: number | null;
}

export type Status = "empty" | "incomplete" | "pass" | "zone" | "fail";

export interface Result {
  rows: Row[];
  status: Status;
  /** Subjects still without a complete grade. */
  missing: number;
  saldo: number;
  /** Subjects whose Promotionsnote is below 4. */
  below: number;
}

const EPS = 1e-9;
const round1 = (v: number) => Math.round(v * 10 + EPS) / 10;

export function evaluateRow(def: SubjectDef, grades: Grades): Row {
  const parsed = def.inputs.map((i) => parseGrade(grades[i.key]));
  if (parsed.some((p) => p === null)) return { def, parsed, note: null, saldo: null };
  const values = parsed as number[];
  const note = roundHalf(values.reduce((a, b) => a + b, 0) / values.length);
  return { def, parsed, note, saldo: saldoOf(note) };
}

export function evaluate(subjects: SubjectDef[], grades: Grades, moment: Moment): Result {
  const rows = subjects.map((def) => evaluateRow(def, grades));
  const scored = rows.filter((r) => r.note !== null);
  const missing = rows.length - scored.length;
  const saldo = round1(scored.reduce((a, r) => a + (r.saldo ?? 0), 0));
  const below = scored.filter((r) => (r.note ?? 4) < 4).length;

  // A half-filled sheet always looks better than the semester it projects: every subject
  // that is missing adds nothing to the Saldo. So no verdict until the sheet is complete.
  let status: Status;
  if (scored.length === 0) status = "empty";
  else if (missing > 0) status = "incomplete";
  else if (saldo >= -EPS) status = "pass";
  else if (moment.probation && saldo >= SAFETY_ZONE - EPS) status = "zone";
  else status = "fail";

  return { rows, status, missing, saldo, below };
}

// ---------------------------------------------------------------------------
// planner
// ---------------------------------------------------------------------------

export interface Move {
  name: string;
  from: number;
  to: number;
  /** The lowest average that still rounds to `to` — quarters round up. */
  fromAverage: number;
  gain: number;
}

export interface Plan {
  /** Points still missing (fail / zone) — 0 when the Saldo is fine. */
  deficit: number;
  /** One way to close the gap with as few half grades as possible. */
  moves: Move[];
  /** Saldo points to spare (pass). */
  reserve: number;
  /** How many whole half grades below 4.0 the reserve can absorb: a 4.0 → 3.5 costs 1.0. */
  dropsAvailable: number;
}

/** What one half grade up is worth at this grade: below 4 it counts double. */
const stepGain = (note: number) => (note < 4 ? 1 : 0.5);

/**
 * Closes a deficit with the fewest half grades: a half grade on a grade below 4 is worth a
 * full point, anywhere else only half a point. Takes the grades closest to 4 first, since
 * those are the cheapest to lift. Deliberately no per-subject minimum — each one would
 * assume that every other subject stays exactly where it is.
 */
export function plan(result: Result): Plan | null {
  if (result.status === "empty" || result.status === "incomplete") return null;
  const reserve = Math.max(0, result.saldo);
  const dropsAvailable = Math.floor(reserve + EPS);
  if (result.saldo >= -EPS) return { deficit: 0, moves: [], reserve, dropsAvailable };

  let deficit = round1(-result.saldo);
  const notes = result.rows.map((r) => ({ name: r.def.name, from: r.note as number, now: r.note as number }));
  const bump = (n: (typeof notes)[number]) => { const g = stepGain(n.now); n.now += 0.5; deficit = round1(deficit - g); };

  // 1) grades below 4, closest to 4 first — one half grade there is worth 1.0
  while (deficit > EPS) {
    const next = notes.filter((n) => n.now < 4).sort((a, b) => b.now - a.now)[0];
    if (!next) break;
    bump(next);
  }
  // 2) everything else, lowest first — 0.5 each
  while (deficit > EPS) {
    const next = notes.filter((n) => n.now < 6).sort((a, b) => a.now - b.now)[0];
    if (!next) break;
    bump(next);
  }

  const moves = notes
    .filter((n) => n.now !== n.from)
    .map((n) => ({ name: n.name, from: n.from, to: n.now, fromAverage: n.now - 0.25, gain: round1(gainBetween(n.from, n.now)) }));
  return { deficit: round1(-result.saldo), moves, reserve: 0, dropsAvailable: 0 };
}

/** Saldo points between two Promotionsnoten of the same subject. */
export const gainBetween = (from: number, to: number): number => saldoOf(to) - saldoOf(from);
