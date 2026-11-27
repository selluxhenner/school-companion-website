/**
 * Grades never leave the browser. One localStorage key, versioned so a later ruleset
 * or shape change can migrate instead of silently misreading.
 */
import type { Grades } from "./engine";
import { PASS, type Estimates, type Goal, type ScenarioKind } from "./planner";
import { DEFAULT_CHOICES, RULESET_ID, type Choices } from "./rules";

const KEY = "sc.matura.v1";

export interface Saved {
  ruleset: string;
  choices: Choices;
  grades: Grades;
  estimates: Estimates;
  goal: Goal;
  scenario: ScenarioKind;
}

/** The first release stored a single "wish" per exam; it lives on as the realistic estimate. */
interface Legacy {
  wishes?: Record<string, string>;
}

export function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Saved> & Legacy;
    if (parsed.ruleset !== RULESET_ID || typeof parsed.grades !== "object" || !parsed.grades) return null;

    const estimates: Estimates = {};
    if (parsed.estimates && typeof parsed.estimates === "object") {
      for (const [k, v] of Object.entries(parsed.estimates)) {
        estimates[k] = { realistic: String(v?.realistic ?? ""), best: String(v?.best ?? "") };
      }
    } else if (parsed.wishes && typeof parsed.wishes === "object") {
      for (const [k, v] of Object.entries(parsed.wishes)) estimates[k] = { realistic: String(v ?? ""), best: "" };
    }

    // The goal list offers 4.0 to 6.0 in tenths; bring anything stored outside that onto it.
    const goal: Goal =
      parsed.goal?.kind === "mean" && typeof parsed.goal.mean === "number" && Number.isFinite(parsed.goal.mean)
        ? { kind: "mean", mean: Math.min(6, Math.max(4, Math.round(parsed.goal.mean * 10) / 10)) }
        : PASS;

    return {
      ruleset: RULESET_ID,
      choices: { ...DEFAULT_CHOICES, ...(parsed.choices ?? {}) },
      grades: parsed.grades,
      estimates,
      goal,
      scenario: parsed.scenario === "real" || parsed.scenario === "best" ? parsed.scenario : "min",
    };
  } catch {
    return null;
  }
}

export function save(data: Omit<Saved, "ruleset">): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ruleset: RULESET_ID, ...data }));
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
