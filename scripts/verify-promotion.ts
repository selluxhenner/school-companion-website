/**
 * The Promotion rules against hand-worked cases from the Promotionsreglement des
 * Gymnasiums (3.2.101): Saldo, rounding, the Probezeit zone, which subjects count and the
 * planner's arithmetic. Run: npm run verify
 */
import { evaluate, plan, roundHalf, type Grades } from "../src/lib/promotion/engine";
import { DEFAULT_CHOICES, momentOf, subjectsFor, type RulesetId } from "../src/lib/promotion/rules";

let failed = 0;
const ok = (cond: boolean, msg: string) => {
  console.log(`  ${cond ? "ok  " : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

const setup = (ruleset: RulesetId, id: string, choices = DEFAULT_CHOICES) => {
  const moment = momentOf(ruleset, id)!;
  return { moment, subjects: subjectsFor(ruleset, moment, choices) };
};

/** Every input of every subject set to the same value, `over` overrides by input key. */
const fill = (ruleset: RulesetId, id: string, value: string, over: Grades = {}, choices = DEFAULT_CHOICES) => {
  const { moment, subjects } = setup(ruleset, id, choices);
  const grades: Grades = {};
  for (const s of subjects) for (const i of s.inputs) grades[i.key] = value;
  return evaluate(subjects, { ...grades, ...over }, moment);
};

console.log("\nRounding: quarters round up (Art. 14 MSV, VG SG B 2012/89)");
ok(roundHalf(3.75) === 4.0, "3.75 → 4.0");
ok(roundHalf(4.25) === 4.5, "4.25 → 4.5");
ok(roundHalf(3.74) === 3.5, "3.74 → 3.5");
ok(roundHalf(4.2) === 4.0, "4.2 → 4.0");

console.log("\nSubject lists (Anhang 1)");
ok(setup("old", "y1s1").subjects.length === 10, "old 1st year: 10 subjects");
ok(setup("old", "y2s1").subjects.length === 12, "old mid 2nd year: 12 — no Religion oder Philosophie yet");
ok(setup("old", "y2s2").subjects.length === 13, "old end of 2nd year: 13");
ok(setup("old", "y3").subjects.length === 13, "old 3rd year: 13");
ok(setup("gdz", "s1").subjects.length === 12, "GdZ 1st year: 12");
ok(setup("gdz", "s3").subjects.length === 16, "GdZ 2nd year: 16");
ok(setup("gdz", "s6").subjects.length === 14, "GdZ 3rd year: 14");
ok(!setup("gdz", "s1").subjects.some((s) => s.id === "l3"), "GdZ has no third-language choice");

console.log("\nOld 1st year: the Musik / Bildnerisches Gestalten slot depends on the Schwerpunktfach");
const art = (spf: string) => setup("old", "y1s1", { ...DEFAULT_CHOICES, spf: spf as never }).subjects.find((s) => s.id === "art")!;
ok(art("Musik").inputs.length === 1 && art("Musik").name === "Bildnerisches Gestalten", "SPF Musik → Bildnerisches Gestalten only");
ok(art("Bildnerisches Gestalten").inputs.length === 1 && art("Bildnerisches Gestalten").name === "Musik", "SPF BG → Musik only");
ok(art("Latein").inputs.length === 2, "any other SPF → rounded mean of both");
ok(fill("old", "y1s1", "4", { "art.m": "5", "art.b": "4" }, DEFAULT_CHOICES).rows.find((r) => r.def.id === "art")!.note === 4.5, "Musik 5 + BG 4 → 4.5");

console.log("\nSaldo, Art. 2");
const pass = fill("old", "y3", "4");
ok(pass.saldo === 0 && pass.status === "pass", "all 4.0 → Saldo 0 passes");
const one35 = fill("old", "y3", "4", { ma: "3.5" });
ok(one35.saldo === -1 && one35.status === "fail", "one 3.5 → −1.0, fails outside the Probezeit");
const offset = fill("old", "y3", "4", { ma: "3.5", de: "5" });
ok(offset.saldo === 0 && offset.status === "pass", "3.5 and a 5.0 offset: −1.0 + 1.0 = 0 passes");
const halfUp = fill("old", "y3", "4", { ma: "3.5", de: "4.5" });
ok(halfUp.saldo === -0.5 && halfUp.status === "fail", "3.5 against a 4.5: −0.5 fails");
const many = fill("old", "y3", "4", { ma: "3.5", de: "3.5", l2: "3.5", l3: "3.5", bio: "3.5", ch: "3.5", ph: "5", ge: "5", geo: "5", ewr: "5", "art.one": "5", spf: "5", rel: "5" });
ok(many.below === 6 && many.saldo === 1 && many.status === "pass", "six grades below 4 (−6.0) against seven 5.0s (+7.0): Saldo +1.0 passes — no cap on insufficient grades");

console.log("\nProbezeit: −1.0 ≤ Saldo < 0 leaves the Konferenz a way out (old Art. 8bis Abs. 2, GdZ Art. 6 Abs. 2)");
ok(fill("old", "y1s1", "4", { ma: "3.5" }).status === "zone", "old: −1.0 → zone");
ok(fill("gdz", "s1", "4", { ma: "3.5" }).status === "zone", "GdZ: −1.0 → zone");
ok(fill("old", "y1s1", "4", { ma: "3.5", de: "3.5" }).status === "fail", "old: −2.0 → fail");
ok(fill("old", "y1s2", "4", { ma: "3.5" }).status === "fail", "outside the Probezeit −1.0 is just a fail");
ok(fill("old", "y1s1", "4", { ma: "4.5" }).status === "pass", "old Probezeit +0.5 → pass");

console.log("\nNo verdict on a half-filled sheet");
const { moment, subjects } = setup("old", "y3");
ok(evaluate(subjects, {}, moment).status === "empty", "nothing typed → empty");
ok(evaluate(subjects, { de: "5" }, moment).status === "incomplete", "one grade → incomplete, not pass");
ok(evaluate(subjects, { de: "5", ma: "4,5" }, moment).rows.find((r) => r.def.id === "ma")!.note === 4.5, "comma decimal accepted");

console.log("\nPlanner");
const failing = fill("old", "y3", "4", { ma: "3.0", ch: "3.5" }); // −2 + −1 = −3
ok(failing.saldo === -3, "fixture Saldo −3.0");
const p = plan(failing)!;
ok(p.deficit === 3, "deficit 3.0");
const gained = p.moves.reduce((a, m) => a + m.gain, 0);
ok(gained >= p.deficit - 1e-9, "the suggested moves close the deficit");
ok(p.moves.every((m) => Math.abs(m.fromAverage - (m.to - 0.25)) < 1e-9), "average hint = grade − 0.25");
ok(p.moves.length === 2 && p.moves.some((m) => m.name === "Chemie" && m.from === 3.5 && m.to === 4.0), "closest-to-4 first: Chemie 3.5 → 4.0 (+1.0)");
ok(p.moves.some((m) => m.name === "Mathematik" && m.from === 3.0 && m.to === 4.0 && m.gain === 2), "…then Mathematik 3.0 → 4.0 (+2.0)");
const reserve = plan(fill("old", "y3", "4", { de: "5.5" }))!; // +1.5
ok(reserve.reserve === 1.5 && reserve.dropsAvailable === 1, "reserve +1.5 absorbs one 4.0 → 3.5");
ok(plan(evaluate(subjects, {}, moment)) === null, "no plan without a complete sheet");

console.log(failed ? `\n${failed} FAILED\n` : "\nall ok\n");
process.exit(failed ? 1 : 0);
