"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { evaluate, plan, type Grades, type Plan, type Result, type Row } from "@/lib/promotion/engine";
import {
  MOMENTS,
  RULESETS,
  momentOf,
  subjectsFor,
  type Choices,
  type Moment,
  type RulesetId,
} from "@/lib/promotion/rules";
import { DEFAULT_SAVED, clear, load, save, type Saved } from "@/lib/promotion/storage";
import { SCHWERPUNKTFAECHER } from "@/lib/matura/rules";
import { drawShareImage, shareImage, type ShareData } from "@/lib/matura/share";
import { track } from "@/lib/analytics";
import { MATURA_PATH, PROMOTION_PATH, SITE_URL } from "@/lib/site";
import GradeInput from "@/components/rechner/GradeInput";

// ---------------------------------------------------------------------------
// formatting
// ---------------------------------------------------------------------------

const fmt = (n: number | null) => (n === null ? "—" : n.toFixed(1));
const fmtSaldo = (n: number | null) =>
  n === null ? "—" : n > 0 ? `+${n.toFixed(1)}` : n < 0 ? `−${Math.abs(n).toFixed(1)}` : "±0.0";

const sel = "h-9 w-full rounded-thumb border border-line bg-surface px-2 text-sm text-ink";
const lab = "flex flex-col gap-1 text-xs font-medium text-ink-2";

// ---------------------------------------------------------------------------
// root
// ---------------------------------------------------------------------------

export default function PromotionRechner({ rules }: { rules?: ReactNode }) {
  const [state, setState] = useState<Saved>(DEFAULT_SAVED);
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage after mount so the static HTML and the first client render agree.
  useEffect(() => {
    const saved = load();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => save(state), 300);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [state, hydrated]);

  const { ruleset, grades, choices, provisional } = state;
  const moment = (momentOf(ruleset, state.moment) ?? MOMENTS[ruleset][0]) as Moment;

  const subjects = useMemo(() => subjectsFor(ruleset, moment, choices), [ruleset, moment, choices]);
  const result = useMemo(() => evaluate(subjects, grades, moment), [subjects, grades, moment]);
  const advice = useMemo(() => plan(result), [result]);

  // Once per page load, the first time a grade is typed — the "did anyone use it" number.
  const firstGrade = useRef(false);
  const setGrade = (key: string, value: string) => {
    if (!firstGrade.current && value.trim()) {
      firstGrade.current = true;
      track("promotion_first_grade", { ruleset, moment: moment.id });
    }
    setState((s) => ({ ...s, grades: { ...s.grades, [key]: value } }));
  };

  const setRuleset = (r: RulesetId) =>
    setState((s) => (s.ruleset === r ? s : { ...s, ruleset: r, moment: MOMENTS[r][0].id, provisional: false }));
  const setMoment = (id: string) => setState((s) => ({ ...s, moment: id, provisional: false }));
  const setChoice = <K extends keyof Choices>(k: K, v: Choices[K]) =>
    setState((s) => ({ ...s, choices: { ...s.choices, [k]: v } }));

  const reset = () => {
    if (!window.confirm("Alle Noten löschen?")) return;
    clear();
    setState(DEFAULT_SAVED);
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
      {/* On a phone the verdict comes first; on a laptop it sits beside the grades and stays put. */}
      <aside className="order-first flex flex-col gap-7 lg:order-last lg:sticky lg:top-6">
        <VerdictCard result={result} moment={moment} provisional={provisional} />
        {advice && <PlanCard plan={advice} />}
        <ShareBar result={result} ruleset={ruleset} moment={moment} provisional={provisional} />
      </aside>

      <div className="flex flex-col gap-7">
        <section aria-labelledby="when-heading" className="flex flex-col gap-3">
          <h2 id="when-heading" className="px-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
            Wann und nach welchem Reglement
          </h2>
          <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4">
            <div role="radiogroup" aria-label="Reglement" className="grid grid-cols-2 rounded-control bg-surface-2 p-1">
              {(Object.keys(RULESETS) as RulesetId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={ruleset === id}
                  onClick={() => setRuleset(id)}
                  className={`min-h-9 rounded-thumb px-2 py-1.5 text-[13px] font-semibold leading-tight transition ${ruleset === id ? "bg-surface text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-ink-2 hover:text-ink"}`}
                >
                  {RULESETS[id].label}
                </button>
              ))}
            </div>
            <label className={lab}>Zeitpunkt der Promotion
              <select className={sel} value={moment.id} onChange={(e) => setMoment(e.target.value)}>
                {MOMENTS[ruleset].map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={lab}>Zweite Landessprache
                <select className={sel} value={choices.l2} onChange={(e) => setChoice("l2", e.target.value as Choices["l2"])}>
                  <option>Französisch</option><option>Italienisch</option>
                </select>
              </label>
              {ruleset === "old" && (
                <label className={lab}>Dritte Sprache
                  <select className={sel} value={choices.l3} onChange={(e) => setChoice("l3", e.target.value as Choices["l3"])}>
                    <option>Englisch</option><option>Griechisch</option>
                  </select>
                </label>
              )}
              {ruleset === "old" && moment.year === 1 && (
                <label className={`${lab} sm:col-span-2`}>Schwerpunktfach
                  <select className={sel} value={choices.spf} onChange={(e) => setChoice("spf", e.target.value as Choices["spf"])}>
                    {SCHWERPUNKTFAECHER.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              )}
            </div>
            {moment.provisionalLabel && (
              <label className="flex items-start gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={provisional}
                  onChange={(e) => setState((s) => ({ ...s, provisional: e.target.checked }))}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#4ECDC4]"
                />
                {moment.provisionalLabel}
              </label>
            )}
            <p className="text-xs leading-relaxed text-ink-3">
              Grundlage: {provisional && moment.basisProvisional ? moment.basisProvisional : moment.basis}.{" "}
              {ruleset === "old" ? (
                <>Im 4. Schuljahr gibt es keine Promotion mehr — dort zählt die Matura: <Link href={MATURA_PATH} className="font-medium text-brand-dark hover:underline">zum Matura-Rechner</Link>.</>
              ) : (
                <>Am Ende des 5., 7. und 8. Semesters gibt es keine Promotion; danach zählt die Matura: <Link href={MATURA_PATH} className="font-medium text-brand-dark hover:underline">zum Matura-Rechner</Link>.</>
              )}
            </p>
          </div>
        </section>

        <section aria-labelledby="subjects-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 id="subjects-heading" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
              {subjects.length} Promotionsfächer
            </h2>
            <button type="button" onClick={reset} className="text-[13px] font-medium text-ink-2 hover:text-ink">
              Zurücksetzen
            </button>
          </div>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {result.rows.map((row) => (
              <SubjectRow key={row.def.id} row={row} grades={grades} onChange={setGrade} />
            ))}
          </div>
          <p className="px-1 text-xs leading-relaxed text-ink-3">
            Trag deine Zeugnisnote oder deinen aktuellen Durchschnitt ein. Promotionsnoten sind ganze oder halbe Noten,
            ein Viertel wird aufgerundet (3.75 zählt als 4.0). Die gerundete Note siehst du rechts in der Zeile.
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

function VerdictCard({ result, moment, provisional }: { result: Result; moment: Moment; provisional: boolean }) {
  const { status } = result;
  const c = moment.consequences;

  const dot = status === "pass" ? "bg-success" : status === "fail" ? "bg-accent" : status === "zone" ? "bg-warning" : "bg-line-2";
  const label =
    status === "pass" || status === "fail" || status === "zone"
      ? "Ergebnis · alle Fächer eingetragen"
      : status === "incomplete"
        ? `Noch unvollständig · ${result.missing} ${result.missing === 1 ? "Fach" : "Fächer"} ohne Note`
        : "Trag deine Noten ein";

  const consequence =
    status === "pass" ? c.pass
    : status === "zone" ? c.zone
    : status === "fail" ? (provisional && c.failProvisional ? c.failProvisional : c.fail)
    : null;

  return (
    <section aria-live="polite" className="flex flex-col gap-[18px] rounded-card bg-surface p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">{label}</span>
      </div>

      {status === "empty" && (
        <p className="text-[15px] leading-relaxed text-ink-2">
          Wähl oben den Zeitpunkt und trag deine <strong className="font-semibold text-ink">Noten</strong> ein — am
          schnellsten mit den Zahlen aus dem letzten Zeugnis oder deinem aktuellen Durchschnitt.
        </p>
      )}

      {status === "incomplete" && (
        <p className="text-[15px] leading-relaxed text-ink-2">
          Solange Fächer fehlen, zählt der Saldo nur, was schon dasteht — das Ergebnis sähe besser aus, als es ist.
          Deshalb gibt es noch kein Verdikt.
        </p>
      )}

      {(status === "pass" || status === "fail" || status === "zone") && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-2">Ergebnis</span>
          <span className={`text-[34px] font-bold leading-none tracking-[-0.8px] ${status === "pass" ? "text-brand-dark" : status === "fail" ? "text-accent" : "text-ink"}`}>
            {status === "pass" ? "Promoviert" : status === "fail" ? "Nicht promoviert" : "Knapp"}
          </span>
          <span className="mt-1 text-sm text-ink-2">
            Saldo <span className="tnum">{fmtSaldo(result.saldo)}</span> · {result.below} {result.below === 1 ? "Note" : "Noten"} unter 4.0
          </span>
        </div>
      )}

      {consequence && <p className="text-sm leading-relaxed text-ink">{consequence}</p>}

      {status !== "empty" && (
        <>
          <div className="h-px bg-line" />
          <SaldoMeter saldo={result.saldo} partial={status === "incomplete"} />
        </>
      )}
    </section>
  );
}

/** −6 … +6 with the zero mark; the Saldo has to reach the right half. */
function SaldoMeter({ saldo, partial }: { saldo: number; partial: boolean }) {
  const RANGE = 6;
  const clamped = Math.max(-RANGE, Math.min(RANGE, saldo));
  const pct = ((clamped + RANGE) / (2 * RANGE)) * 100;
  const ok = saldo >= 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-ink-2">{partial ? "Saldo bisher" : "Saldo"}</span>
        <span className={`tnum text-sm font-semibold ${partial ? "text-ink-2" : ok ? "text-brand-dark" : "text-accent"}`}>{fmtSaldo(saldo)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-surface-2" role="img" aria-label={`Saldo ${fmtSaldo(saldo)} auf einer Skala von minus ${RANGE} bis plus ${RANGE}`}>
        <div className="absolute inset-y-0 left-1/2 w-px bg-ink-3" />
        <div
          className={`absolute inset-y-0 rounded-full ${partial ? "bg-line-2" : ok ? "bg-brand" : "bg-accent"}`}
          style={saldo >= 0 ? { left: "50%", width: `${pct - 50}%` } : { left: `${pct}%`, width: `${50 - pct}%` }}
        />
      </div>
      <p className="text-xs text-ink-3">Minuspunkte zählen doppelt · mindestens 0</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// planner
// ---------------------------------------------------------------------------

function PlanCard({ plan: p }: { plan: Plan }) {
  const pts = (n: number) => n.toFixed(1);
  return (
    <section aria-label="Was fehlt noch?" className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
        {p.deficit > 0 ? "Was dir fehlt" : "Deine Reserve"}
      </h2>
      {p.deficit > 0 ? (
        <>
          <p className="text-sm leading-relaxed text-ink-2">
            Dir fehlen <strong className="tnum font-semibold text-ink">{pts(p.deficit)}</strong> Saldo-Punkte. Eine halbe
            Note mehr in einem Fach unter 4 bringt 1.0 — in jedem anderen nur 0.5. Zum Beispiel:
          </p>
          <ul className="flex flex-col gap-2">
            {p.moves.map((m) => (
              <li key={m.name} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="font-medium text-ink">{m.name}</span>{" "}
                  <span className="tnum text-ink-2">{fmt(m.from)} → {fmt(m.to)}</span>
                  <span className="block text-xs text-ink-3">Durchschnitt ab <span className="tnum">{m.fromAverage.toFixed(2)}</span></span>
                </span>
                <span className="tnum shrink-0 rounded-tag bg-brand/15 px-2 py-[3px] text-xs font-medium text-brand-dark">{fmtSaldo(m.gain)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-ink-3">
            Das ist ein möglicher Weg, kein Minimum pro Fach: Jedes einzelne Minimum würde annehmen, dass alle anderen
            Noten genau so bleiben, wie sie sind.
          </p>
        </>
      ) : p.reserve === 0 ? (
        <p className="text-sm leading-relaxed text-ink-2">
          Du stehst genau auf der Grenze: Saldo <strong className="tnum font-semibold text-ink">±0.0</strong> genügt. Schon
          eine 4.0, die auf 3.5 fällt, kostet 1.0 und bringt dich darunter.
        </p>
      ) : p.dropsAvailable >= 1 ? (
        <p className="text-sm leading-relaxed text-ink-2">
          Du hast <strong className="tnum font-semibold text-ink">{fmtSaldo(p.reserve)}</strong> Reserve. Das reicht
          für {p.dropsAvailable === 1 ? "eine Note, die" : `${p.dropsAvailable} Noten, die`} von 4.0 auf 3.5
          fällt{p.dropsAvailable === 1 ? "" : "en"} (je −1.0), und du bleibst promoviert.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-ink-2">
          Du hast <strong className="tnum font-semibold text-ink">{fmtSaldo(p.reserve)}</strong> Reserve — das reicht für
          halbe Noten über 4, aber nicht für eine 4.0, die auf 3.5 fällt (−1.0).
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// subject row
// ---------------------------------------------------------------------------

function SubjectRow({ row, grades, onChange }: { row: Row; grades: Grades; onChange: (key: string, v: string) => void }) {
  const { def } = row;
  const saldoCls =
    row.saldo === null ? "bg-surface-2 text-ink-3" : row.saldo < 0 ? "bg-accent/15 text-accent" : row.saldo > 0 ? "bg-brand/15 text-brand-dark" : "bg-surface-2 text-ink-3";
  const pair = def.inputs.length > 1;

  return (
    <div className="flex flex-col gap-2.5 border-t border-line px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="h-7 w-1 shrink-0 rounded-sm bg-brand" aria-hidden="true" />
        <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug">{def.name}</span>
        <span className="tnum w-9 text-right text-[15px] font-semibold sm:order-last" title="Promotionsnote">{fmt(row.note)}</span>
        <span className={`tnum min-w-[46px] rounded-tag px-2 py-[3px] text-center text-xs font-medium sm:order-last ${saldoCls}`}>{fmtSaldo(row.saldo)}</span>
      </div>
      <div className="flex gap-2.5 pl-4 sm:pl-0">
        {def.inputs.map((input, i) => (
          <div key={input.key} className="flex flex-col items-center gap-1">
            <GradeInput
              value={grades[input.key] ?? ""}
              parsed={row.parsed[i]}
              step={0.5}
              label={`${def.name}${pair ? ` — ${input.label}` : ""} — Note oder Durchschnitt`}
              onChange={(v) => onChange(input.key, v)}
              placeholder="4.25"
            />
            {pair && <span className="max-w-[72px] truncate text-[11px] font-medium text-ink-3">{input.label === "Bildnerisches Gestalten" ? "BG" : input.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// share
// ---------------------------------------------------------------------------

function ShareBar({ result, ruleset, moment, provisional }: { result: Result; ruleset: RulesetId; moment: Moment; provisional: boolean }) {
  const [note, setNote] = useState<string | null>(null);
  const canShare = result.status === "pass" || result.status === "fail" || result.status === "zone";
  const url = `${SITE_URL}${PROMOTION_PATH}`;

  const share = async () => {
    const base = { title: "Promotion-Rechner", path: PROMOTION_PATH, saldo: fmtSaldo(result.saldo), below: String(result.below), belowBad: false };
    let data: ShareData;
    if (result.status === "zone") {
      data = { ...base, headline: "Probezeit", big: "Knapp", sub: `Saldo ${fmtSaldo(result.saldo)} — die Promotionskonferenz entscheidet.`, tone: "forecast" };
    } else {
      const pass = result.status === "pass";
      data = { ...base, headline: "", big: "", verdict: pass ? "Promoviert" : "Nicht promoviert", sub: `Saldo ${fmtSaldo(result.saldo)} · ${result.below} ${result.below === 1 ? "Note" : "Noten"} unter 4.0`, tone: pass ? "pass" : "fail" };
    }
    await document.fonts?.load?.("800 220px Inter").catch(() => undefined);
    const r = await shareImage(drawShareImage(data), "Promotion-Rechner", "promotion-rechner.png");
    if (r !== "failed") track("promotion_share", { ruleset, moment: moment.id, provisional: String(provisional) });
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
