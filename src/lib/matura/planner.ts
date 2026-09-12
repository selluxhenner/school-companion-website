/**
 * What the open exams have to deliver, measured against a goal.
 *
 *   uniformFloor — the ONE grade that, scored in every open exam, reaches the goal.
 *                  The number to carry into the exam hall.
 *   plan         — every open exam scored at "your Erfahrungsnote plus the same lift δ",
 *                  with the smallest δ that reaches the goal. Spreads the work the way a
 *                  student actually can: a strong subject carries a weak one.
 *   scenario     — a complete set of grades for the open exams, three flavours:
 *                  "min"  your realistic estimates where you gave them, the plan minimum
 *                         for the rest;
 *                  "real" your realistic estimate, else the Erfahrungsnote;
 *                  "best" your best-case estimate, else Erfahrungsnote + 0.5.
 *
 * Per-subject minimums ("what do I need in Deutsch alone") are deliberately absent: each
 * would assume every other exam lands as forecast and therefore says 1.0.
 */
import { ceilToStep, clampGrade, evaluate, parseGrade, type GradeEntry, type Grades, type Result } from "./engine";
import type { SubjectDef } from "./rules";

export type Part = "written" | "oral";

export interface Slot {
  subject: SubjectDef;
  part: Part;
  /** Art. 14: written grades in tenths, oral grades in halves. */
  step: 0.1 | 0.5;
  /** Vormatura oral, taken at the start of the 4th year (Art. 7 Abs. 3). */
  early: boolean;
}

export const slotKey = (slot: Pick<Slot, "part"> & { subject: Pick<SubjectDef, "id"> }): string =>
  `${slot.subject.id}:${slot.part}`;

// ---------------------------------------------------------------------------
// goal
// ---------------------------------------------------------------------------

/** "Bestehen", or a mean of the 13 Maturanoten of at least `mean` (which implies passing). */
export type Goal = { kind: "pass" } | { kind: "mean"; mean: number };

export const PASS: Goal = { kind: "pass" };

export function reaches(result: Result, goal: Goal): boolean {
  if (result.status === "incomplete" || result.status === "empty" || !result.passed) return false;
  return goal.kind === "pass" || result.mean >= goal.mean - EPS;
}

// ---------------------------------------------------------------------------
// estimates — what the student themselves expects per open exam
// ---------------------------------------------------------------------------

export interface Estimate {
  /** What you honestly expect. Empty → the Erfahrungsnote. */
  realistic: string;
  /** What full effort could bring. Empty → Erfahrungsnote + 0.5. */
  best: string;
}

export type Estimates = Record<string, Estimate>;

/** The default lift for a best case nobody has estimated. */
export const BEST_DEFAULT_LIFT = 0.5;

export function openSlots(subjects: SubjectDef[], grades: Grades): Slot[] {
  const out: Slot[] = [];
  for (const s of subjects) {
    const g = grades[s.id];
    if (s.exam === "writtenOral" && parseGrade(g?.written) === null)
      out.push({ subject: s, part: "written", step: 0.1, early: false });
    if (s.exam !== "none" && parseGrade(g?.oral) === null)
      out.push({ subject: s, part: "oral", step: 0.5, early: s.exam === "oralEarly" });
  }
  return out;
}

/** Copy of the grades with every listed slot filled by `fill(slot)`. */
function fillSlots(grades: Grades, slots: Slot[], fill: (slot: Slot) => number): Grades {
  const next: Grades = {};
  for (const [id, e] of Object.entries(grades)) next[id] = { ...e };
  for (const slot of slots) {
    const e: GradeEntry = next[slot.subject.id] ?? { en: "", written: "", oral: "" };
    e[slot.part] = fill(slot).toFixed(1);
    next[slot.subject.id] = e;
  }
  return next;
}

/** The grades with every slot that has a parsable `field` estimate treated as scored. */
export function withEstimates(grades: Grades, estimates: Estimates, slots: Slot[], field: keyof Estimate): Grades {
  const given = slots.filter((s) => parseGrade(estimates[slotKey(s)]?.[field]) !== null);
  if (!given.length) return grades;
  return fillSlots(grades, given, (s) => parseGrade(estimates[slotKey(s)]?.[field]) as number);
}

const ready = (subjects: SubjectDef[], grades: Grades) => subjects.every((s) => parseGrade(grades[s.id]?.en) !== null);

// ---------------------------------------------------------------------------
// floor and plan
// ---------------------------------------------------------------------------

export interface FloorResult {
  /** null → not even 6.0 everywhere reaches the goal; check `slots` first: 0 means nothing is open. */
  grade: number | null;
  slots: number;
  /** True when the Erfahrungsnoten are complete, i.e. the answer means something. */
  ready: boolean;
}

export function uniformFloor(subjects: SubjectDef[], grades: Grades, goal: Goal = PASS): FloorResult {
  const slots = openSlots(subjects, grades);
  const ok = ready(subjects, grades);
  if (!ok || slots.length === 0) return { grade: null, slots: slots.length, ready: ok };
  for (let g = 1; g <= 6 + EPS; g += 0.5) {
    if (reaches(evaluate(subjects, fillSlots(grades, slots, () => g)), goal)) return { grade: round1(g), slots: slots.length, ready: ok };
  }
  return { grade: null, slots: slots.length, ready: ok };
}

export type Effort = "hold" | "some" | "more" | "much";

export interface Target {
  slot: Slot;
  grade: number;
  /** The student's Erfahrungsnote in that subject — the reference the target is measured against. */
  en: number;
}

export interface PlanResult {
  ready: boolean;
  /**
   * Mean lift the targets actually carry over the Erfahrungsnoten (after rounding each
   * to its exam's step, an oral can only move in halves); null when unreachable.
   */
  delta: number | null;
  effort: Effort | null;
  targets: Target[];
}

export function plan(subjects: SubjectDef[], grades: Grades, goal: Goal = PASS): PlanResult {
  const slots = openSlots(subjects, grades);
  const ok = ready(subjects, grades);
  if (!ok || slots.length === 0) return { ready: ok, delta: null, effort: null, targets: [] };

  const enOf = (slot: Slot) => parseGrade(grades[slot.subject.id]?.en) as number;
  const targetFor = (slot: Slot, delta: number) => ceilToStep(clampGrade(enOf(slot) + delta), slot.step);

  for (let d = -3; d <= 3 + EPS; d += 0.1) {
    const delta = round1(d);
    if (reaches(evaluate(subjects, fillSlots(grades, slots, (slot) => targetFor(slot, delta))), goal)) {
      const targets = slots.map((slot) => ({ slot, grade: round1(targetFor(slot, delta)), en: enOf(slot) }));
      const lift = round1(targets.reduce((a, t) => a + (t.grade - t.en), 0) / targets.length);
      return { ready: ok, delta: lift, effort: effortOf(lift), targets };
    }
  }
  return { ready: ok, delta: null, effort: null, targets: [] };
}

export function effortOf(delta: number): Effort {
  if (delta <= 0.05) return "hold";
  if (delta <= 0.55) return "some";
  if (delta <= 1.05) return "more";
  return "much";
}

// ---------------------------------------------------------------------------
// scenarios
// ---------------------------------------------------------------------------

export type ScenarioKind = "min" | "real" | "best";

export interface ScenarioGrade {
  slot: Slot;
  /** null only in "min" when the goal is out of reach. */
  grade: number | null;
  /** Where the grade came from. */
  source: "estimate" | "plan" | "default";
  en: number;
}

export interface Scenario {
  kind: ScenarioKind;
  ready: boolean;
  grades: ScenarioGrade[];
  /** The evaluation with those grades filled in; null when nothing could be filled. */
  result: Result | null;
  /** Goal reached with these grades. */
  reached: boolean;
  /** "min" only: the floor and plan for the exams without a realistic estimate. */
  floor: FloorResult | null;
  plan: PlanResult | null;
}

export function scenario(subjects: SubjectDef[], grades: Grades, estimates: Estimates, goal: Goal, kind: ScenarioKind): Scenario {
  const slots = openSlots(subjects, grades);
  const ok = ready(subjects, grades);
  const enOf = (slot: Slot) => parseGrade(grades[slot.subject.id]?.en) as number;
  const est = (slot: Slot, field: keyof Estimate) => parseGrade(estimates[slotKey(slot)]?.[field]);
  const empty: Scenario = { kind, ready: ok, grades: [], result: null, reached: false, floor: null, plan: null };
  if (!ok) return empty;

  if (kind === "min") {
    const fixed = withEstimates(grades, estimates, slots, "realistic");
    const floor = uniformFloor(subjects, fixed, goal);
    const planned = plan(subjects, fixed, goal);
    const target = new Map(planned.targets.map((t) => [slotKey(t.slot), t.grade]));
    const list: ScenarioGrade[] = slots.map((slot) => {
      const r = est(slot, "realistic");
      if (r !== null) return { slot, grade: r, source: "estimate", en: enOf(slot) };
      return { slot, grade: target.get(slotKey(slot)) ?? null, source: "plan", en: enOf(slot) };
    });
    const complete = list.every((g) => g.grade !== null);
    const result = complete ? evaluate(subjects, fillSlots(grades, slots, (s) => list.find((g) => g.slot === s)!.grade as number)) : null;
    return { kind, ready: ok, grades: list, result, reached: result ? reaches(result, goal) : false, floor, plan: planned };
  }

  const list: ScenarioGrade[] = slots.map((slot) => {
    const en = enOf(slot);
    if (kind === "real") {
      const r = est(slot, "realistic");
      return r !== null ? { slot, grade: r, source: "estimate", en } : { slot, grade: en, source: "default", en };
    }
    const b = est(slot, "best");
    if (b !== null) return { slot, grade: b, source: "estimate", en };
    return { slot, grade: ceilToStep(clampGrade(en + BEST_DEFAULT_LIFT), slot.step), source: "default", en };
  });
  const result = evaluate(subjects, fillSlots(grades, slots, (s) => list.find((g) => g.slot === s)!.grade as number));
  return { kind, ready: ok, grades: list, result, reached: reaches(result, goal), floor: null, plan: null };
}

const EPS = 1e-9;
const round1 = (v: number) => Math.round(v * 10 + EPS) / 10;
