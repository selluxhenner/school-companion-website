"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { evaluate, parseGrade, type GradeEntry, type Grades, type Result, type Row } from "@/lib/matura/engine";
import {
  PASS,
  effortOf,
  openSlots,
  scenario as buildScenario,
  slotKey,
  type Effort,
  type Estimate,
  type Estimates,
  type Goal,
  type Scenario,
  type ScenarioKind,
  type Slot,
} from "@/lib/matura/planner";
import {
  DEFAULT_CHOICES,
  ERGAENZUNGSFAECHER,
  SCHWERPUNKTFAECHER,
  blockedSciences,
  resolveSubjects,
  type Choices,
  type SubjectDef,
} from "@/lib/matura/rules";
import { clear, load, save } from "@/lib/matura/storage";
import { drawShareImage, shareImage, type ShareData } from "@/lib/matura/share";
import { MATURA_PATH, SITE_URL } from "@/lib/site";

// ---------------------------------------------------------------------------
// formatting
// ---------------------------------------------------------------------------

const fmt = (n: number | null) => (n === null ? "—" : n.toFixed(1));
const fmtSaldo = (n: number | null) =>
  n === null ? "—" : n > 0 ? `+${n.toFixed(1)}` : n < 0 ? `−${Math.abs(n).toFixed(1)}` : "±0.0";

const EFFORT: Record<Effort, { label: string; cls: string }> = {
  hold: { label: "Halte dein Niveau", cls: "bg-brand/15 text-brand-dark" },
  some: { label: "Etwas mehr als bisher", cls: "bg-brand/15 text-brand-dark" },
  more: { label: "Deutlich mehr als bisher", cls: "bg-warning/30 text-ink" },
  much: { label: "Sehr viel mehr als bisher", cls: "bg-accent/15 text-accent" },
};

const SCENARIOS: Array<{ kind: ScenarioKind; label: string; short: string }> = [
  { kind: "min", label: "Minimum", short: "Min." },
  { kind: "real", label: "Realistisch", short: "Real." },
  { kind: "best", label: "Sehr gut", short: "Best" },
];

// Same hues the app gives these subjects (constants/colors.ts, resolveSubjectColor).
const SUBJECT_COLOR: Record<string, string> = {
  de: "#EF4444", l2: "#EC4899", l3: "#F97316", ma: "#6366F1", bio: "#22C55E", ch: "#10B981",
  ph: "#3B82F6", ge: "#F59E0B", geo: "#84CC16", art: "#FF6B6B", spf: "#8B5CF6", ef: "#5D78C1", ma_arbeit: "#4ECDC4",
};

const partLabel = (slot: Slot) => (slot.part === "written" ? "schriftlich" : slot.early ? "mündlich · Vormatura" : "mündlich");
const goalLabel = (goal: Goal) => (goal.kind === "pass" ? "Bestehen" : `Schnitt ≥ ${goal.mean.toFixed(1)}`);

const Chevron = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-ink-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ---------------------------------------------------------------------------
// root
// ---------------------------------------------------------------------------

export default function MaturaRechner({ rules }: { rules?: ReactNode }) {
  const [choices, setChoices] = useState<Choices>(DEFAULT_CHOICES);
  const [grades, setGrades] = useState<Grades>({});
  const [estimates, setEstimates] = useState<Estimates>({});
  const [goal, setGoal] = useState<Goal>(PASS);
  const [kind, setKind] = useState<ScenarioKind>("min");
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage after mount so the static HTML and the first client render agree.
  useEffect(() => {
    const saved = load();
    if (saved) {
      setChoices(saved.choices);
      setGrades(saved.grades);
      setEstimates(saved.estimates);
      setGoal(saved.goal);
      setKind(saved.scenario);
    }
    setHydrated(true);
  }, []);

  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => save({ choices, grades, estimates, goal, scenario: kind }), 300);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [choices, grades, estimates, goal, kind, hydrated]);

  const subjects = useMemo(() => resolveSubjects(choices), [choices]);
  const result = useMemo(() => evaluate(subjects, grades), [subjects, grades]);
  const slots = useMemo(() => openSlots(subjects, grades), [subjects, grades]);
  const scenarios = useMemo(
    () => ({
      min: buildScenario(subjects, grades, estimates, goal, "min"),
      real: buildScenario(subjects, grades, estimates, goal, "real"),
      best: buildScenario(subjects, grades, estimates, goal, "best"),
    }),
    [subjects, grades, estimates, goal],
  );
  const selected = scenarios[kind];

  const setGrade = (id: string, part: keyof GradeEntry, value: string) =>
    setGrades((g) => ({ ...g, [id]: { ...(g[id] ?? { en: "", written: "", oral: "" }), [part]: value } }));
  const setEstimate = (key: string, field: keyof Estimate, value: string) =>
    setEstimates((e) => ({ ...e, [key]: { ...(e[key] ?? { realistic: "", best: "" }), [field]: value } }));

  const reset = () => {
    if (!window.confirm("Alle Noten löschen?")) return;
    clear();
    setGrades({});
    setEstimates({});
    setGoal(PASS);
    setKind("min");
    setChoices(DEFAULT_CHOICES);
  };

  const forecasting = result.status === "forecast" && slots.length > 0;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
      {/* On a phone the verdict comes first; on a laptop it sits beside the grades and stays put. */}
      <aside className="order-first flex flex-col gap-7 lg:order-last lg:sticky lg:top-6">
        <VerdictCard result={result} scenarios={scenarios} kind={kind} onKind={setKind} goal={goal} onGoal={setGoal} forecasting={forecasting} />
        {forecasting && <Comparison scenarios={scenarios} kind={kind} onKind={setKind} goal={goal} />}
        {forecasting && <PlanList slots={slots} estimates={estimates} onEstimate={setEstimate} scenario={selected} goal={goal} grades={grades} />}
        <ShareBar result={result} scenario={forecasting ? selected : null} goal={goal} />
      </aside>

      <div className="flex flex-col gap-7">
        <section aria-labelledby="subjects-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 id="subjects-heading" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
              13 Maturanoten
            </h2>
            <button type="button" onClick={reset} className="text-[13px] font-medium text-ink-2 hover:text-ink">
              Zurücksetzen
            </button>
          </div>
          <ChoicesPanel choices={choices} onChange={setChoices} />
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {result.rows.map((row) => (
              <SubjectRow key={row.def.id} row={row} entry={grades[row.def.id]} onChange={(part, v) => setGrade(row.def.id, part, v)} />
            ))}
          </div>
          <p className="px-1 text-xs leading-relaxed text-ink-3">
            Erfahrungsnote = letzte Jahresnote im Fach (Art. 15). Schriftliche Noten auf Zehntel, mündliche auf
            halbe Noten (Art. 14). Solange eine Prüfung offen ist, rechnet der Rechner dort mit deiner
            Erfahrungsnote weiter — das ist die Prognose, markiert mit *.
          </p>
        </section>
        {rules}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// verdict card — the one shadowed surface on the page
// ---------------------------------------------------------------------------

function VerdictCard({ result, scenarios, kind, onKind, goal, onGoal, forecasting }: {
  result: Result;
  scenarios: Record<ScenarioKind, Scenario>;
  kind: ScenarioKind;
  onKind: (k: ScenarioKind) => void;
  goal: Goal;
  onGoal: (g: Goal) => void;
  forecasting: boolean;
}) {
  const { status } = result;
  const sc = scenarios[kind];
  const shown = forecasting && sc.result ? sc.result : result;

  const dot =
    status === "final" ? (result.passed ? "bg-success" : "bg-accent") : status === "forecast" ? "bg-warning" : "bg-line-2";
  const label =
    status === "final"
      ? "Ergebnis · alle 13 Maturanoten stehen fest"
      : status === "forecast"
        ? `Prognose · ${result.openParts} ${result.openParts === 1 ? "Prüfung" : "Prüfungen"} noch offen`
        : status === "incomplete"
          ? `Noch unvollständig · ${result.missing} ${result.missing === 1 ? "Fach" : "Fächer"} ohne Erfahrungsnote`
          : "Trag deine Noten ein";

  return (
    <section aria-live="polite" className="flex flex-col gap-[18px] rounded-card bg-surface p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">{label}</span>
      </div>

      {status !== "empty" && <GoalControl goal={goal} onGoal={onGoal} />}

      {forecasting && (
        <div role="tablist" aria-label="Szenario" className="grid grid-cols-3 rounded-control bg-surface-2 p-1">
          {SCENARIOS.map((s) => (
            <button
              key={s.kind}
              type="button"
              role="tab"
              aria-selected={kind === s.kind}
              onClick={() => onKind(s.kind)}
              className={`h-8 rounded-thumb text-[13px] font-semibold transition ${kind === s.kind ? "bg-surface text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-ink-2 hover:text-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {status === "empty" && (
        <p className="text-[15px] leading-relaxed text-ink-2">
          Beginn mit den <strong className="font-semibold text-ink">Erfahrungsnoten</strong> — der letzten Jahresnote in
          jedem Fach. Damit steht die Prognose, noch bevor eine Prüfung geschrieben ist.
        </p>
      )}

      {status === "incomplete" && (
        <p className="text-[15px] leading-relaxed text-ink-2">
          Solange Fächer fehlen, zählt der Saldo nur, was schon dasteht — das Ergebnis sähe besser aus, als es ist.
          Deshalb gibt es noch kein Verdikt.
        </p>
      )}

      {forecasting && (kind === "min" ? <MinAnswer sc={sc} goal={goal} /> : <ScenarioAnswer sc={sc} goal={goal} />)}

      {status === "final" && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-2">Ergebnis</span>
          <span className={`text-[34px] font-bold leading-none tracking-[-0.8px] ${result.passed ? "text-brand-dark" : "text-accent"}`}>
            {result.passed ? "Bestanden" : "Nicht bestanden"}
          </span>
          <span className="mt-1 text-sm text-ink-2">
            Saldo {fmtSaldo(result.saldo)} · {result.insufficient} {result.insufficient === 1 ? "Note" : "Noten"} unter 4.0 · Schnitt{" "}
            <span className="tnum">{result.mean.toFixed(2)}</span>
            {goal.kind === "mean" && <> · Ziel {result.mean >= goal.mean ? "erreicht" : "nicht erreicht"}</>}
          </span>
        </div>
      )}

      {status !== "empty" && (
        <>
          <div className="h-px bg-line" />
          <Criteria result={shown} />
        </>
      )}
    </section>
  );
}

function GoalControl({ goal, onGoal }: { goal: Goal; onGoal: (g: Goal) => void }) {
  const sel = "h-8 rounded-thumb border border-line bg-surface px-2 text-[13px] font-medium text-ink";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-xs font-medium text-ink-2" htmlFor="goal-kind">Ziel</label>
      <select
        id="goal-kind"
        className={sel}
        value={goal.kind}
        onChange={(e) => onGoal(e.target.value === "mean" ? { kind: "mean", mean: goal.kind === "mean" ? goal.mean : 5.0 } : PASS)}
      >
        <option value="pass">Bestehen</option>
        <option value="mean">Schnitt mindestens</option>
      </select>
      {goal.kind === "mean" && (
        <input
          type="number"
          inputMode="decimal"
          min={4}
          max={6}
          step={0.1}
          aria-label="Zielschnitt"
          value={goal.mean}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onGoal({ kind: "mean", mean: Math.min(6, Math.max(4, Math.round(v * 10) / 10)) });
          }}
          className={`tnum w-[68px] text-center ${sel}`}
        />
      )}
    </div>
  );
}

/** The "min" scenario: what the exams without a realistic estimate must bring. */
function MinAnswer({ sc, goal }: { sc: Scenario; goal: Goal }) {
  const floor = sc.floor!, planned = sc.plan!;
  const goalText = goal.kind === "mean" ? `Für einen Schnitt von ${goal.mean.toFixed(1)} brauchst du` : "Das brauchst du noch";
  const anyEstimate = sc.grades.some((g) => g.source === "estimate");

  // Every open exam carries a realistic estimate → nothing left to ask for.
  if (floor.slots === 0 && sc.result) {
    return <ScenarioAnswer sc={sc} goal={goal} title="Mit deinen realistischen Noten" />;
  }

  if (floor.grade === null) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-ink-2">{goalText}</span>
        <span className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-accent">Nicht erreichbar</span>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          {anyEstimate
            ? "Mit diesen realistischen Noten reicht auch eine 6.0 in den übrigen Prüfungen nicht. Setz eine Schätzung höher oder das Ziel tiefer."
            : goal.kind === "mean"
              ? "Auch eine 6.0 in allen offenen Prüfungen erreicht diesen Schnitt nicht. Setz das Ziel tiefer."
              : "Auch eine 6.0 in allen offenen Prüfungen reicht für den Saldo nicht mehr. Sprich mit deiner Klassenlehrperson."}
        </p>
      </div>
    );
  }

  const tone = floor.grade <= 4 ? "text-brand-dark" : floor.grade <= 5 ? "text-yellow" : "text-accent";
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-2">{anyEstimate ? `${goalText} in den übrigen Prüfungen` : goalText}</span>
      <div className="flex items-baseline gap-2.5">
        <span className={`tnum text-[44px] font-bold leading-none tracking-[-1px] ${tone}`}>{fmt(floor.grade)}</span>
        <span className="text-sm text-ink-2">
          in {floor.slots === 1 ? "der offenen Prüfung" : `jeder der ${floor.slots} offenen Prüfungen`}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">
        {floor.slots === 1
          ? `Schaffst du das, ist das Ziel «${goalLabel(goal)}» erreicht.`
          : `Schaffst du das überall, ist das Ziel «${goalLabel(goal)}» erreicht — egal wie der Rest ausfällt.`}
        {planned.delta !== null && planned.effort && (
          <>
            {" "}
            Nach deinen Stärken verteilt heisst das:{" "}
            <span className={`inline-block rounded-tag px-1.5 py-0.5 text-xs font-medium ${EFFORT[planned.effort].cls}`}>
              {EFFORT[planned.effort].label}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

/** "real" and "best": where those grades land. */
function ScenarioAnswer({ sc, goal, title }: { sc: Scenario; goal: Goal; title?: string }) {
  const r = sc.result;
  if (!r) return null;
  const heading = title ?? (sc.kind === "best" ? "Wenn es sehr gut läuft" : "Wenn es realistisch läuft");
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ink-2">{heading}</span>
      <span className={`text-[34px] font-bold leading-none tracking-[-0.8px] ${r.passed ? "text-brand-dark" : "text-accent"}`}>
        {r.passed ? "Bestanden" : "Nicht bestanden"}
      </span>
      <span className="mt-1 text-sm text-ink-2">
        Schnitt <span className="tnum">{r.mean.toFixed(2)}</span> · Ziel «{goalLabel(goal)}»{" "}
        <span className={sc.reached ? "font-medium text-brand-dark" : "font-medium text-accent"}>{sc.reached ? "erreicht" : "nicht erreicht"}</span>
      </span>
    </div>
  );
}

function Criteria({ result }: { result: Result }) {
  const s = result.saldo;
  const clamp = Math.max(-12, Math.min(12, s));
  const left = 50 + Math.min(0, clamp / 24) * 100;
  const width = (Math.abs(clamp) / 24) * 100;
  const n = result.insufficient;
  const tone = (ok: boolean) => (ok ? "text-brand-dark" : "text-accent");
  const belowHint =
    n > 4 ? "Über der Grenze — höchstens vier sind erlaubt" : n === 4 ? "Kein Platz mehr — eine fünfte lässt dich durchfallen" : n === 3 ? "Eine weitere ist noch möglich" : `${4 - n} weitere sind noch möglich`;

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1 lg:gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">Saldo</span>
          <span className={`tnum text-lg font-semibold ${tone(result.saldoOk)}`}>{fmtSaldo(s)}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-surface-2">
          <div
            className={`absolute top-0 h-1.5 rounded-full ${result.saldoOk ? "bg-brand" : "bg-accent"}`}
            style={{ left: `${left}%`, width: `${width}%` }}
          />
          <div className="absolute -top-[3px] -bottom-[3px] left-1/2 w-0.5 rounded-sm bg-line-2" />
        </div>
        <span className="text-xs font-medium text-ink-2">Minuspunkte zählen doppelt · mindestens 0</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">Noten unter 4.0</span>
          <span className={`tnum text-lg font-semibold ${tone(result.countOk)}`}>{n} / 4</span>
        </div>
        <div className="flex gap-[5px]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < n ? "bg-accent" : "bg-surface-2"}`} />
          ))}
        </div>
        <span className="text-xs font-medium text-ink-2">{belowHint}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// comparison — the three scenarios side by side
// ---------------------------------------------------------------------------

function Comparison({ scenarios, kind, onKind, goal }: { scenarios: Record<ScenarioKind, Scenario>; kind: ScenarioKind; onKind: (k: ScenarioKind) => void; goal: Goal }) {
  return (
    <section aria-label="Vergleich der Szenarien" className="grid grid-cols-3 overflow-hidden rounded-card border border-line bg-surface">
      {SCENARIOS.map((s, i) => {
        const sc = scenarios[s.kind];
        const r = sc.result;
        const active = kind === s.kind;
        return (
          <button
            key={s.kind}
            type="button"
            onClick={() => onKind(s.kind)}
            aria-pressed={active}
            className={`flex flex-col gap-1.5 px-3 py-3 text-left transition ${i > 0 ? "border-l border-line" : ""} ${active ? "bg-brand-soft/60" : "hover:bg-surface-2"}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">{s.label}</span>
            {r ? (
              <>
                <span className={`text-[15px] font-semibold ${sc.reached ? "text-brand-dark" : "text-accent"}`}>
                  {sc.reached ? "Ziel ✓" : r.passed ? "Ziel ✗" : "Nicht best."}
                </span>
                <span className="tnum text-xs text-ink-2">Schnitt {r.mean.toFixed(2)}</span>
                <span className="tnum text-xs text-ink-2">Saldo {fmtSaldo(r.saldo)} · {r.insufficient} u. 4</span>
              </>
            ) : (
              <span className="text-[15px] font-semibold text-accent">—</span>
            )}
          </button>
        );
      })}
      <p className="col-span-3 border-t border-line px-3 py-2 text-[11px] leading-relaxed text-ink-3">
        Ziel: {goalLabel(goal)}. Minimum nimmt deine realistischen Schätzungen als gegeben und rechnet den Rest aus.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// plan — every open exam: realistic and best-case estimates, plus the selected scenario's grade
// ---------------------------------------------------------------------------

function PlanList({ slots, estimates, onEstimate, scenario, goal, grades }: {
  slots: Slot[];
  estimates: Estimates;
  onEstimate: (key: string, field: keyof Estimate, value: string) => void;
  scenario: Scenario;
  goal: Goal;
  grades: Grades;
}) {
  const gradeOf = new Map(scenario.grades.map((g) => [slotKey(g.slot), g]));
  const col = SCENARIOS.find((s) => s.kind === scenario.kind)!;
  const anyEstimate = slots.some((s) => parseGrade(estimates[slotKey(s)]?.realistic) !== null || parseGrade(estimates[slotKey(s)]?.best) !== null);

  return (
    <section aria-labelledby="plan-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 id="plan-heading" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
          Offene Prüfungen
        </h2>
        {scenario.kind === "min" && scenario.plan?.delta !== null && scenario.plan?.delta !== undefined && (
          <span className="tnum text-xs font-medium text-ink-2">
            Erfahrungsnote {scenario.plan.delta >= 0 ? "+" : "−"}{Math.abs(scenario.plan.delta).toFixed(1)}
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex items-center gap-2.5 border-b border-line bg-surface-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
          <span className="flex-1">Prüfung</span>
          <span className="w-14 text-center">Realist.</span>
          <span className="w-14 text-center">Sehr gut</span>
          <span className="w-11 text-right">{col.short}</span>
        </div>
        {slots.map((slot) => {
          const key = slotKey(slot);
          const est = estimates[key] ?? { realistic: "", best: "" };
          const g = gradeOf.get(key);
          const en = parseGrade(grades[slot.subject.id]?.en);
          const effort = scenario.kind === "min" && g?.source === "plan" && g.grade !== null && en !== null ? EFFORT[effortOf(g.grade - en)] : null;
          const gradeCls = g?.source === "plan" ? "text-ink" : g?.source === "estimate" ? "text-ink-3" : "text-ink-2";
          return (
            <div key={key} className="flex items-center gap-2.5 border-t border-line px-4 py-2.5 first:border-t-0">
              <span className="h-7 w-1 shrink-0 rounded-sm" style={{ background: SUBJECT_COLOR[slot.subject.id] }} aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[15px] font-semibold">{slot.subject.name}</span>
                <span className="truncate text-xs text-ink-2">
                  {partLabel(slot)} · bisher <span className="tnum">{fmt(en)}</span>
                  {effort && <span className={`ml-1.5 rounded-tag px-1.5 py-px text-[11px] font-medium ${effort.cls}`}>{effort.label}</span>}
                </span>
              </div>
              <GradeInput value={est.realistic} parsed={parseGrade(est.realistic)} step={slot.step} label={`${slot.subject.name} ${partLabel(slot)} — realistisch`} onChange={(v) => onEstimate(key, "realistic", v)} placeholder="—" />
              <GradeInput value={est.best} parsed={parseGrade(est.best)} step={slot.step} label={`${slot.subject.name} ${partLabel(slot)} — sehr gut`} onChange={(v) => onEstimate(key, "best", v)} placeholder="—" />
              <span className={`tnum w-11 text-right text-lg font-semibold ${g?.grade === null ? "text-accent" : gradeCls}`} title={g?.source === "estimate" ? "deine Schätzung" : g?.source === "default" ? "Standard" : undefined}>
                {g ? fmt(g.grade) : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="px-1 text-xs leading-relaxed text-ink-3">
        {scenario.kind === "min" && (
          <>
            <strong className="font-medium text-ink-2">Min.</strong> ist, was jede Prüfung mindestens bringen muss, damit das Ziel «{goalLabel(goal)}» steht — jede um denselben Betrag über deiner Erfahrungsnote, ein starkes Fach trägt ein schwaches.
            {anyEstimate ? " Prüfungen mit realistischer Schätzung gelten als gegeben; Min. gilt für den Rest." : " Trag ein, was du dir realistisch zutraust, und Min. rechnet nur noch für die übrigen."}
            {scenario.floor?.grade !== null && scenario.floor && scenario.floor.slots > 0 && (
              <> Oder überall gleich: <span className="tnum font-medium text-ink-2">{fmt(scenario.floor.grade)}</span>.</>
            )}
          </>
        )}
        {scenario.kind === "real" && "Realistisch nimmt deine Schätzung; wo keine steht, deine Erfahrungsnote — du schneidest ab wie bisher."}
        {scenario.kind === "best" && "Sehr gut nimmt deine Best-Case-Schätzung; wo keine steht, Erfahrungsnote + 0.5."}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// choices — Art. 5 alternatives, Schwerpunkt-/Ergänzungsfach, the two Vormatura orals
// ---------------------------------------------------------------------------

function ChoicesPanel({ choices, onChange }: { choices: Choices; onChange: (c: Choices) => void }) {
  const blocked = blockedSciences(choices.spf);
  const set = <K extends keyof Choices>(k: K, v: Choices[K]) => onChange({ ...choices, [k]: v });
  const sel = "h-9 w-full rounded-thumb border border-line bg-surface px-2 text-sm text-ink";
  const lab = "flex flex-col gap-1 text-xs font-medium text-ink-2";
  const science = blocked.includes(choices.scienceOral) ? (["bio", "ch", "ph"] as const).find((s) => !blocked.includes(s)) : choices.scienceOral;

  return (
    <details className="group rounded-card border border-line bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[15px] font-medium">
        Deine Fächer
        <Chevron />
      </summary>
      <div className="grid gap-3 border-t border-line px-4 py-4 sm:grid-cols-2">
        <label className={lab}>Zweite Landessprache
          <select className={sel} value={choices.l2} onChange={(e) => set("l2", e.target.value as Choices["l2"])}>
            <option>Französisch</option><option>Italienisch</option>
          </select>
        </label>
        <label className={lab}>Dritte Sprache
          <select className={sel} value={choices.l3} onChange={(e) => set("l3", e.target.value as Choices["l3"])}>
            <option>Englisch</option><option>Griechisch</option>
          </select>
        </label>
        <label className={lab}>Musik oder Bildnerisches Gestalten
          <select className={sel} value={choices.art} onChange={(e) => set("art", e.target.value as Choices["art"])}>
            <option>Bildnerisches Gestalten</option><option>Musik</option>
          </select>
        </label>
        <label className={lab}>Schwerpunktfach
          <select className={sel} value={choices.spf} onChange={(e) => set("spf", e.target.value as Choices["spf"])}>
            {SCHWERPUNKTFAECHER.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className={lab}>Ergänzungsfach
          <select className={sel} value={choices.ef} onChange={(e) => set("ef", e.target.value as Choices["ef"])}>
            {ERGAENZUNGSFAECHER.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="hidden sm:block" />
        <label className={lab}>Vormatura mündlich · Naturwissenschaft
          <select className={sel} value={science} onChange={(e) => set("scienceOral", e.target.value as Choices["scienceOral"])}>
            {(["bio", "ch", "ph"] as const).map((id) => (
              <option key={id} value={id} disabled={blocked.includes(id)}>
                {{ bio: "Biologie", ch: "Chemie", ph: "Physik" }[id]}{blocked.includes(id) ? " (Schwerpunktfach)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className={lab}>Vormatura mündlich · Geschichte oder Geografie
          <select className={sel} value={choices.humanitiesOral} onChange={(e) => set("humanitiesOral", e.target.value as Choices["humanitiesOral"])}>
            <option value="ge">Geschichte</option><option value="geo">Geografie</option>
          </select>
        </label>
        <p className="text-xs leading-relaxed text-ink-3 sm:col-span-2">
          Die beiden Vormatura-Fächer werden zu Beginn der 4. Klasse mündlich geprüft (Art. 7). Eine Naturwissenschaft,
          die dein Schwerpunktfach ist, kannst du nicht wählen.
        </p>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// subject row
// ---------------------------------------------------------------------------

function SubjectRow({ row, entry, onChange }: { row: Row; entry: GradeEntry | undefined; onChange: (part: keyof GradeEntry, v: string) => void }) {
  const def: SubjectDef = row.def;
  const e = entry ?? { en: "", written: "", oral: "" };
  const hasWritten = def.exam === "writtenOral";
  const hasOral = def.exam !== "none";
  const isMA = def.id === "ma_arbeit";
  const enLabel = isMA ? "Note" : `Zeugnis ${def.enYear}. Kl.`;

  const saldoCls =
    row.saldo === null ? "bg-surface-2 text-ink-3" : row.saldo < 0 ? "bg-accent/15 text-accent" : row.saldo > 0 ? "bg-brand/15 text-brand-dark" : "bg-surface-2 text-ink-3";

  return (
    <div className="flex flex-col gap-2.5 border-t border-line px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex flex-1 items-center gap-3">
        <span className="h-7 w-1 shrink-0 rounded-sm" style={{ background: SUBJECT_COLOR[def.id] }} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{def.name}</span>
        {!hasOral && (
          <Cell label={enLabel} inline>
            <GradeInput value={e.en} parsed={row.en} step={0.5} label={`${def.name} — ${enLabel}`} onChange={(v) => onChange("en", v)} />
          </Cell>
        )}
        <span className="tnum w-9 text-right text-[15px] font-semibold sm:order-last">
          {fmt(row.mn)}
          {row.forecast && <span className="text-ink-3" title="Prognose">*</span>}
        </span>
        <span className={`tnum min-w-[46px] rounded-tag px-2 py-[3px] text-center text-xs font-medium sm:order-last ${saldoCls}`}>{fmtSaldo(row.saldo)}</span>
      </div>
      {/* Exam subjects: the cells always sit on their own line. Others: inline on a phone, right-aligned on wider screens. */}
      <div className={`gap-2.5 pl-4 sm:pl-0 ${hasOral ? "flex" : "hidden sm:flex"}`}>
        <Cell label={enLabel}>
          <GradeInput value={e.en} parsed={row.en} step={0.5} label={`${def.name} — ${enLabel}`} onChange={(v) => onChange("en", v)} />
        </Cell>
        {hasWritten && (
            <Cell label="schriftlich">
              <GradeInput value={e.written} parsed={row.written} step={0.1} label={`${def.name} — schriftlich`} onChange={(v) => onChange("written", v)} />
            </Cell>
          )}
        {hasOral && (
          <Cell label={def.exam === "oralEarly" ? "Vormatura" : "mündlich"}>
            <GradeInput value={e.oral} parsed={row.oral} step={0.5} label={`${def.name} — mündlich`} onChange={(v) => onChange("oral", v)} />
          </Cell>
        )}
      </div>
    </div>
  );
}

function Cell({ label, children, inline = false }: { label: string; children: ReactNode; inline?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${inline ? "sm:hidden" : ""}`}>
      {children}
      <span className="text-[11px] font-medium text-ink-3">{label}</span>
    </div>
  );
}

function GradeInput({ value, parsed, step, label, onChange, placeholder }: { value: string; parsed: number | null; step: 0.1 | 0.5; label: string; onChange: (v: string) => void; placeholder?: string }) {
  const invalid = value.trim() !== "" && parsed === null;
  const low = parsed !== null && parsed < 4;
  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={label}
      placeholder={placeholder ?? (step === 0.5 ? "4.5" : "4.3")}
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
      className={`tnum h-9 w-14 shrink-0 rounded-thumb border bg-surface text-center text-sm text-ink placeholder:text-line-2 focus:outline-none focus:ring-2 focus:ring-brand/40 ${
        invalid || low ? "border-accent" : "border-line"
      }`}
    />
  );
}

// ---------------------------------------------------------------------------
// share
// ---------------------------------------------------------------------------

function ShareBar({ result, scenario, goal }: { result: Result; scenario: Scenario | null; goal: Goal }) {
  const [note, setNote] = useState<string | null>(null);
  const canShare = result.status === "forecast" || result.status === "final";
  const url = `${SITE_URL}${MATURA_PATH}`;

  const share = async () => {
    let data: ShareData;
    const stats = (r: Result) => ({ saldo: fmtSaldo(r.saldo), below: `${r.insufficient} / 4` });
    if (!scenario || result.status === "final") {
      data = { headline: "", big: "", sub: `Saldo ${fmtSaldo(result.saldo)} · ${result.insufficient} von 4 unter 4.0 · Schnitt ${result.mean.toFixed(2)}`, tone: result.passed ? "pass" : "fail", ...stats(result) };
    } else if (scenario.kind !== "min" || (scenario.floor && scenario.floor.slots === 0)) {
      const r = scenario.result ?? result;
      const label = scenario.kind === "best" ? "Wenn es sehr gut läuft" : "Realistisch";
      data = { headline: label, big: "", sub: `${label}: Schnitt ${r.mean.toFixed(2)} · Ziel «${goalLabel(goal)}» ${scenario.reached ? "erreicht" : "nicht erreicht"}`, tone: r.passed ? "pass" : "fail", ...stats(r) };
    } else if (scenario.floor?.grade == null) {
      data = { headline: "Das brauche ich noch", big: "—", sub: "Nicht mehr erreichbar.", tone: "fail", ...stats(result) };
    } else {
      const f = scenario.floor;
      data = { headline: goal.kind === "mean" ? `Für einen Schnitt von ${goal.mean.toFixed(1)} brauche ich` : "Ich brauche noch", big: fmt(f.grade), sub: `in ${f.slots === 1 ? "der offenen Prüfung" : `jeder der ${f.slots} offenen Prüfungen`} — dann ist das Ziel erreicht.`, tone: "forecast", ...stats(result) };
    }
    await document.fonts?.load?.("800 220px Inter").catch(() => undefined);
    const r = await shareImage(drawShareImage(data));
    setNote(r === "downloaded" ? "Bild gespeichert — schick es in den Klassenchat." : r === "failed" ? "Teilen abgebrochen." : null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setNote("Link kopiert.");
    } catch {
      setNote(url);
    }
  };

  return (
    <section aria-label="Teilen" className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={share}
          disabled={!canShare}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-brand text-[15px] font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v13" />
          </svg>
          Ergebnis teilen
        </button>
        <button
          type="button"
          onClick={copy}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-control border border-line-2 bg-surface text-[15px] font-semibold text-ink transition hover:bg-surface-2"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
          </svg>
          Link kopieren
        </button>
      </div>
      <p className="px-1 text-xs leading-relaxed text-ink-3" aria-live="polite">
        {note ?? "Auf dem Bild stehen nur Saldo und Ergebnis — keine einzelnen Noten."}
      </p>
    </section>
  );
}
