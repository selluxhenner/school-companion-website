"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { evaluate, parseGrade, type GradeEntry, type Grades, type Result, type Row } from "@/lib/matura/engine";
import {
  openSlots,
  plan,
  slotKey,
  uniformFloor,
  withWishes,
  type Effort,
  type FloorResult,
  type PlanResult,
  type Slot,
  type Wishes,
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
const effortFor = (delta: number): Effort => (delta <= 0.05 ? "hold" : delta <= 0.55 ? "some" : delta <= 1.05 ? "more" : "much");

// Same hues the app gives these subjects (constants/colors.ts, resolveSubjectColor).
const SUBJECT_COLOR: Record<string, string> = {
  de: "#EF4444", l2: "#EC4899", l3: "#F97316", ma: "#6366F1", bio: "#22C55E", ch: "#10B981",
  ph: "#3B82F6", ge: "#F59E0B", geo: "#84CC16", art: "#FF6B6B", spf: "#8B5CF6", ef: "#5D78C1", ma_arbeit: "#4ECDC4",
};

const partLabel = (slot: Slot) => (slot.part === "written" ? "schriftlich" : slot.early ? "mündlich · Vormatura" : "mündlich");

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] shrink-0 text-ink-3 transition-transform group-open:rotate-180 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ---------------------------------------------------------------------------
// root
// ---------------------------------------------------------------------------

export default function MaturaRechner({ rules }: { rules?: ReactNode }) {
  const [choices, setChoices] = useState<Choices>(DEFAULT_CHOICES);
  const [grades, setGrades] = useState<Grades>({});
  const [wishes, setWishes] = useState<Wishes>({});
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage after mount so the static HTML and the first client render agree.
  useEffect(() => {
    const saved = load();
    if (saved) {
      setChoices(saved.choices);
      setGrades(saved.grades);
      setWishes(saved.wishes);
    }
    setHydrated(true);
  }, []);

  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => save({ choices, grades, wishes }), 300);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [choices, grades, wishes, hydrated]);

  const subjects = useMemo(() => resolveSubjects(choices), [choices]);
  const result = useMemo(() => evaluate(subjects, grades), [subjects, grades]);
  const slots = useMemo(() => openSlots(subjects, grades), [subjects, grades]);
  // Wished exams count as scored; floor and plan answer for what is still open after them.
  const effective = useMemo(() => withWishes(grades, wishes, slots), [grades, wishes, slots]);
  const wishedResult = useMemo(() => (effective === grades ? null : evaluate(subjects, effective)), [subjects, effective, grades]);
  const floor = useMemo(() => uniformFloor(subjects, effective), [subjects, effective]);
  const planned = useMemo(() => plan(subjects, effective), [subjects, effective]);

  const setGrade = (id: string, part: keyof GradeEntry, value: string) =>
    setGrades((g) => ({ ...g, [id]: { ...(g[id] ?? { en: "", written: "", oral: "" }), [part]: value } }));
  const setWish = (key: string, value: string) => setWishes((w) => ({ ...w, [key]: value }));

  const reset = () => {
    if (!window.confirm("Alle Noten löschen?")) return;
    clear();
    setGrades({});
    setWishes({});
    setChoices(DEFAULT_CHOICES);
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
      {/* On a phone the verdict comes first; on a laptop it sits beside the grades and stays put. */}
      <aside className="order-first flex flex-col gap-7 lg:order-last lg:sticky lg:top-6">
        <VerdictCard result={result} wished={wishedResult} floor={floor} planned={planned} />
        {slots.length > 0 && planned.ready && (
          <PlanList slots={slots} wishes={wishes} onWish={setWish} planned={planned} floor={floor} grades={grades} />
        )}
        <ShareBar result={wishedResult ?? result} floor={floor} />
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

function VerdictCard({ result, wished, floor, planned }: { result: Result; wished: Result | null; floor: FloorResult; planned: PlanResult }) {
  const { status } = result;

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

      {status === "forecast" && <Answer floor={floor} planned={planned} wished={wished} passedOnForecast={result.passed} />}

      {status === "final" && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-2">Ergebnis</span>
          <span className={`text-[34px] font-bold leading-none tracking-[-0.8px] ${result.passed ? "text-brand-dark" : "text-accent"}`}>
            {result.passed ? "Bestanden" : "Nicht bestanden"}
          </span>
          <span className="mt-1 text-sm text-ink-2">
            Saldo {fmtSaldo(result.saldo)} · {result.insufficient} {result.insufficient === 1 ? "Note" : "Noten"} unter 4.0 · Durchschnitt{" "}
            <span className="tnum">{result.mean.toFixed(2)}</span>
          </span>
        </div>
      )}

      {status !== "empty" && (
        <>
          <div className="h-px bg-line" />
          <Criteria result={result} />
        </>
      )}
    </section>
  );
}

function Answer({ floor, planned, wished, passedOnForecast }: { floor: FloorResult; planned: PlanResult; wished: Result | null; passedOnForecast: boolean }) {
  // Every open exam carries a wish → nothing left to ask for; report where the wishes land.
  if (floor.slots === 0 && wished) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-ink-2">Mit deinen Wunschnoten</span>
        <span className={`text-[34px] font-bold leading-none tracking-[-0.8px] ${wished.passed ? "text-brand-dark" : "text-accent"}`}>
          {wished.passed ? "Bestanden" : "Nicht bestanden"}
        </span>
        <span className="mt-1 text-sm text-ink-2">
          Saldo {fmtSaldo(wished.saldo)} · {wished.insufficient} unter 4.0
        </span>
      </div>
    );
  }

  if (floor.grade === null) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-ink-2">Das brauchst du noch</span>
        <span className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-accent">Nicht erreichbar</span>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          {wished
            ? "Mit diesen Wunschnoten reicht auch eine 6.0 in den übrigen Prüfungen nicht mehr. Setz eine Wunschnote höher."
            : "Auch eine 6.0 in allen offenen Prüfungen reicht für den Saldo nicht mehr. Sprich mit deiner Klassenlehrperson."}
        </p>
      </div>
    );
  }

  const tone = floor.grade <= 4 ? "text-brand-dark" : floor.grade <= 5 ? "text-yellow" : "text-accent";
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-2">{wished ? "Das brauchst du in den übrigen Prüfungen" : "Das brauchst du noch"}</span>
      <div className="flex items-baseline gap-2.5">
        <span className={`tnum text-[44px] font-bold leading-none tracking-[-1px] ${tone}`}>{fmt(floor.grade)}</span>
        <span className="text-sm text-ink-2">
          in {floor.slots === 1 ? "der offenen Prüfung" : `jeder der ${floor.slots} offenen Prüfungen`}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">
        {floor.slots === 1
          ? "Schaffst du das, ist die Matura bestanden."
          : "Schaffst du das überall, ist die Matura bestanden — egal wie der Rest ausfällt."}
        {planned.delta !== null && planned.effort && (
          <>
            {" "}
            Nach deinen Stärken verteilt heisst das:{" "}
            <span className={`inline-block rounded-tag px-1.5 py-0.5 text-xs font-medium ${EFFORT[planned.effort].cls}`}>
              {EFFORT[planned.effort].label}
            </span>
          </>
        )}
        {!passedOnForecast && floor.grade > 4 && !wished && (
          <span className="block pt-1 text-accent">Mit deinen Erfahrungsnoten allein wäre es nicht bestanden.</span>
        )}
      </p>
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
// plan — every open exam: type a Wunschnote, or read the minimum the rest must bring
// ---------------------------------------------------------------------------

function PlanList({ slots, wishes, onWish, planned, floor, grades }: {
  slots: Slot[];
  wishes: Wishes;
  onWish: (key: string, value: string) => void;
  planned: PlanResult;
  floor: FloorResult;
  grades: Grades;
}) {
  const targetOf = new Map(planned.targets.map((t) => [slotKey(t.slot), t]));
  const anyWish = slots.some((s) => parseGrade(wishes[slotKey(s)]) !== null);
  const unreachable = planned.delta === null && floor.slots > 0;

  return (
    <section aria-labelledby="plan-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 id="plan-heading" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
          Dein Plan · Wunsch und Minimum
        </h2>
        {planned.delta !== null && (
          <span className="tnum text-xs font-medium text-ink-2">
            Erfahrungsnote {planned.delta >= 0 ? "+" : "−"}{Math.abs(planned.delta).toFixed(1)}
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
          <span className="flex-1">Prüfung</span>
          <span className="w-14 text-center">Wunsch</span>
          <span className="w-12 text-right">Min.</span>
        </div>
        {slots.map((slot) => {
          const key = slotKey(slot);
          const wish = wishes[key] ?? "";
          const wishN = parseGrade(wish);
          const target = targetOf.get(key);
          const en = parseGrade(grades[slot.subject.id]?.en);
          const effort = target && en !== null ? EFFORT[effortFor(target.grade - en)] : null;
          return (
            <div key={key} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0">
              <span className="h-7 w-1 shrink-0 rounded-sm" style={{ background: SUBJECT_COLOR[slot.subject.id] }} aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[15px] font-semibold">{slot.subject.name}</span>
                <span className="truncate text-xs text-ink-2">
                  {partLabel(slot)} · bisher <span className="tnum">{fmt(en)}</span>
                  {effort && wishN === null && <span className={`ml-1.5 rounded-tag px-1.5 py-px text-[11px] font-medium ${effort.cls}`}>{effort.label}</span>}
                </span>
              </div>
              <GradeInput
                value={wish}
                parsed={wishN}
                step={slot.step}
                label={`${slot.subject.name} ${partLabel(slot)} — Wunschnote`}
                onChange={(v) => onWish(key, v)}
                placeholder="—"
              />
              <span className={`tnum w-12 text-right text-lg font-semibold ${wishN !== null ? "text-ink-3" : unreachable ? "text-accent" : ""}`}>
                {wishN !== null ? "✓" : unreachable ? "—" : target ? fmt(target.grade) : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="px-1 text-xs leading-relaxed text-ink-3">
        {anyWish
          ? "Wunschnoten gelten als erreicht. Min. ist, was die übrigen Prüfungen dann mindestens bringen müssen — nach deinen Stärken verteilt. Leer lassen, um die Prüfung wieder offen zu rechnen."
          : "Trag ein, was du dir in einer Prüfung zutraust. Min. zeigt, was die anderen dann noch bringen müssen — jede um denselben Betrag über deiner Erfahrungsnote, ein starkes Fach trägt ein schwaches."}
        {planned.delta !== null && planned.delta < 0 && (
          <> Du hast Spielraum: im Schnitt {Math.abs(planned.delta).toFixed(1)} unter deiner Erfahrungsnote reicht noch.</>
        )}
        {floor.grade !== null && floor.slots > 0 && (
          <> Oder überall gleich: <span className="tnum font-medium text-ink-2">{fmt(floor.grade)}</span>.</>
        )}
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
      {hasOral && (
        <div className="flex gap-2.5 pl-4 sm:pl-0">
          <Cell label={enLabel}>
            <GradeInput value={e.en} parsed={row.en} step={0.5} label={`${def.name} — ${enLabel}`} onChange={(v) => onChange("en", v)} />
          </Cell>
          {hasWritten && (
            <Cell label="schriftlich">
              <GradeInput value={e.written} parsed={row.written} step={0.1} label={`${def.name} — schriftlich`} onChange={(v) => onChange("written", v)} />
            </Cell>
          )}
          <Cell label={def.exam === "oralEarly" ? "Vormatura" : "mündlich"}>
            <GradeInput value={e.oral} parsed={row.oral} step={0.5} label={`${def.name} — mündlich`} onChange={(v) => onChange("oral", v)} />
          </Cell>
        </div>
      )}
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

function ShareBar({ result, floor }: { result: Result; floor: FloorResult }) {
  const [note, setNote] = useState<string | null>(null);
  const canShare = result.status === "forecast" || result.status === "final";
  const url = `${SITE_URL}${MATURA_PATH}`;

  const share = async () => {
    const data: ShareData =
      result.status === "final" || floor.slots === 0
        ? { headline: "", big: "", sub: `Saldo ${fmtSaldo(result.saldo)} · ${result.insufficient} von 4 unter 4.0`, tone: result.passed ? "pass" : "fail", saldo: fmtSaldo(result.saldo), below: `${result.insufficient} / 4` }
        : floor.grade === null
          ? { headline: "Das brauche ich noch", big: "—", sub: "Nicht mehr erreichbar.", tone: "fail", saldo: fmtSaldo(result.saldo), below: `${result.insufficient} / 4` }
          : { headline: "Ich brauche noch", big: fmt(floor.grade), sub: `in ${floor.slots === 1 ? "der offenen Prüfung" : `jeder der ${floor.slots} offenen Prüfungen`} — dann ist die Matura bestanden.`, tone: "forecast", saldo: fmtSaldo(result.saldo), below: `${result.insufficient} / 4` };
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
