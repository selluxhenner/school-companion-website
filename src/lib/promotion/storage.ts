/**
 * Grades never leave the browser. One localStorage key, versioned so a later ruleset or
 * shape change can migrate instead of silently misreading.
 */
import { DEFAULT_CHOICES, MOMENTS, momentOf, type Choices, type RulesetId } from "./rules";
import type { Grades } from "./engine";

const KEY = "sc.promotion.v1";

export interface Saved {
  ruleset: RulesetId;
  moment: string;
  choices: Choices;
  /** Whether the pupil is currently promoted provisionally. */
  provisional: boolean;
  grades: Grades;
}

export const DEFAULT_SAVED: Saved = {
  ruleset: "old",
  moment: MOMENTS.old[0].id,
  choices: DEFAULT_CHOICES,
  provisional: false,
  grades: {},
};

export function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Saved>;
    if ((p.ruleset !== "old" && p.ruleset !== "gdz") || !p.moment || !momentOf(p.ruleset, p.moment)) return null;
    if (!p.grades || typeof p.grades !== "object") return null;
    const grades: Grades = {};
    for (const [k, v] of Object.entries(p.grades)) if (typeof v === "string") grades[k] = v;
    return {
      ruleset: p.ruleset,
      moment: p.moment,
      choices: { ...DEFAULT_CHOICES, ...(p.choices ?? {}) },
      provisional: p.provisional === true,
      grades,
    };
  } catch {
    return null;
  }
}

export function save(data: Saved): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private mode or storage disabled: the page still works for this visit.
  }
}

export function clear(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
