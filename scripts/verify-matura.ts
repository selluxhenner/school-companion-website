/**
 * The Kanti Wil sheet's printed example ("Bestehensnormen für die Matura ab 2014",
 * V 7.12.15) must come out exactly: 13 rows, sum 57.5, mean 4.42, Saldo +2.5,
 * four grades below 4, bestanden. Run: npm run verify
 */
import { evaluate, roundHalf, roundTenth, type Grades } from "../src/lib/matura/engine";
import { openSlots, plan, scenario, slotKey, uniformFloor, withEstimates } from "../src/lib/matura/planner";
import { DEFAULT_CHOICES, resolveSubjects } from "../src/lib/matura/rules";

let failed = 0;
const ok = (cond: boolean, msg: string) => {
  console.log(`  ${cond ? "ok  " : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

console.log("\nRounding parity with the sheet's RUNDEN");
ok(roundTenth(2.95) === 3.0, "PN 2.95 → 3.0");
ok(roundTenth(2.85) === 2.9, "PN 2.85 → 2.9");
ok(roundHalf(3.75) === 4.0, "MN 3.75 → 4.0");
ok(roundHalf(4.25) === 4.5, "MN 4.25 → 4.5 (midpoint up)");
ok(roundHalf(3.2) === 3.0, "MN 3.2 → 3.0");

// The sheet's student: Chemie and Geografie carry the two Vormatura orals (Art. 7 Ziff. 5/6).
const choices = { ...DEFAULT_CHOICES, scienceOral: "ch" as const, humanitiesOral: "geo" as const };
const subjects = resolveSubjects(choices);

const sheet: Grades = {
  de:  { en: "4.0", written: "3.4", oral: "3.0" },
  l2:  { en: "3.5", written: "2.2", oral: "3.0" },
  l3:  { en: "4.0", written: "3.5", oral: "3.5" },
  ma:  { en: "4.0", written: "2.3", oral: "2.5" },
  bio: { en: "5.0", written: "", oral: "" },
  ch:  { en: "4.5", written: "", oral: "5.0" },
  ph:  { en: "5.0", written: "", oral: "" },
  ge:  { en: "4.0", written: "", oral: "" },
  geo: { en: "4.5", written: "", oral: "5.5" },
  art: { en: "5.0", written: "", oral: "" },
  spf: { en: "4.0", written: "3.9", oral: "2.0" },
  ef:  { en: "6.0", written: "", oral: "" },
  ma_arbeit: { en: "5.5", written: "", oral: "" },
};

// EN, PN, MN, Saldo — straight off the sheet
const expected: Record<string, [number, number | null, number, number]> = {
  de: [4.0, 3.2, 3.5, -1.0], l2: [3.5, 2.6, 3.0, -2.0], l3: [4.0, 3.5, 4.0, 0.0], ma: [4.0, 2.4, 3.0, -2.0],
  bio: [5.0, null, 5.0, 1.0], ch: [4.5, 5.0, 5.0, 1.0], ph: [5.0, null, 5.0, 1.0], ge: [4.0, null, 4.0, 0.0],
  geo: [4.5, 5.5, 5.0, 1.0], art: [5.0, null, 5.0, 1.0], spf: [4.0, 3.0, 3.5, -1.0], ef: [6.0, null, 6.0, 2.0],
  ma_arbeit: [5.5, null, 5.5, 1.5],
};

console.log("\nWorked example");
const r = evaluate(subjects, sheet);
const near = (a: number | null, b: number | null) => (a === null || b === null ? a === b : Math.abs(a - b) < 1e-9);
for (const row of r.rows) {
  const e = expected[row.def.id];
  const good = near(row.en, e[0]) && near(row.pn, e[1]) && near(row.mn, e[2]) && near(row.saldo, e[3]);
  ok(good, `${row.def.name.padEnd(26)} EN ${row.en} PN ${row.pn ?? "—"} MN ${row.mn} Saldo ${row.saldo}`);
}
ok(r.status === "final", `status final (${r.status})`);
ok(r.sum === 57.5, `sum ${r.sum} = 57.5`);
ok(r.mean === 4.42, `mean ${r.mean} = 4.42`);
ok(r.saldo === 2.5, `Saldo ${r.saldo} = +2.5`);
ok(r.insufficient === 4, `${r.insufficient} below 4.0 = 4`);
ok(r.passed, "bestanden");

console.log("\nOne more shortfall fails on the count rule, not the Saldo");
const five: Grades = { ...sheet, ge: { en: "3.5", written: "", oral: "" } };
const r5 = evaluate(subjects, five);
ok(r5.insufficient === 5 && !r5.countOk && r5.saldoOk && !r5.passed, `5 below 4.0, Saldo ${r5.saldo} ≥ 0, not passed`);

console.log("\nPlanner — the same student before the June exams");
const before: Grades = Object.fromEntries(
  Object.entries(sheet).map(([id, e]) => [id, subjects.find((s) => s.id === id)?.exam === "writtenOral" ? { ...e, written: "", oral: "" } : e]),
);
const f = uniformFloor(subjects, before);
ok(f.ready && f.slots === 10, `10 open exam parts (${f.slots})`);
ok(f.grade !== null && f.grade <= 4.0, `uniform floor ${f.grade} — every exam at that grade passes`);
const p = plan(subjects, before);
ok(p.delta !== null && p.targets.length === 10, `plan delta ${p.delta} over the Erfahrungsnote, ${p.targets.length} targets`);
ok(p.targets.every((t) => t.slot.part !== "oral" || Math.abs(t.grade * 2 - Math.round(t.grade * 2)) < 1e-9), "oral targets are half grades");
ok(p.targets.every((t) => t.slot.part !== "written" || Math.abs(t.grade * 10 - Math.round(t.grade * 10)) < 1e-9), "written targets are tenths");

console.log("\nEstimates: a realistic estimate counts as scored, the floor answers for the rest");
const slotsB = openSlots(subjects, before);
const est = Object.fromEntries(slotsB.filter((s) => s.subject.id !== "de").map((s) => [slotKey(s), { realistic: "4.0", best: "" }]));
const fixed = withEstimates(before, est, slotsB, "realistic");
const fW = uniformFloor(subjects, fixed);
ok(fW.slots === 2, `2 open parts left after estimating 8 (${fW.slots})`);
ok(fW.grade !== null, `floor for Deutsch with 4.0 everywhere else: ${fW.grade}`);
ok(withEstimates(before, {}, slotsB, "realistic") === before, "no estimates → same grades object");

console.log("\nGoal: a mean of 5.0 needs more than passing");
const fPass = uniformFloor(subjects, before, { kind: "pass" });
const f50 = uniformFloor(subjects, before, { kind: "mean", mean: 5.0 });
ok(fPass.grade !== null && f50.grade !== null && f50.grade > fPass.grade, `floor pass ${fPass.grade} < floor for 5.0 ${f50.grade}`);
const f60 = uniformFloor(subjects, before, { kind: "mean", mean: 6.0 });
ok(f60.grade === null, "a 6.0 mean is out of reach for this student");

console.log("\nScenarios");
const sMin = scenario(subjects, before, est, { kind: "pass" }, "min");
ok(sMin.grades.filter((g) => g.source === "estimate").length === 8 && sMin.grades.filter((g) => g.source === "plan").length === 2, "min: 8 estimates + 2 planned");
ok(sMin.result !== null && sMin.reached, `min: goal reached with those grades (Schnitt ${sMin.result?.mean})`);
const sReal = scenario(subjects, before, {}, { kind: "pass" }, "real");
ok(sReal.grades.every((g) => g.source === "default" && g.grade === g.en), "real without estimates = Erfahrungsnote everywhere");
const sBest = scenario(subjects, before, {}, { kind: "pass" }, "best");
ok(sBest.grades.every((g) => g.grade !== null && g.grade >= g.en && g.grade <= 6), "best without estimates = Erfahrungsnote + 0.5, capped at 6");
ok(sBest.result !== null && sReal.result !== null && sBest.result.mean >= sReal.result.mean, `best mean ${sBest.result?.mean} ≥ real mean ${sReal.result?.mean}`);
ok(sBest.grades.every((g) => g.slot.part !== "oral" || Math.abs(g.grade! * 2 - Math.round(g.grade! * 2)) < 1e-9), "best oral defaults are half grades");

console.log("\nA non-exam Erfahrungsnote typed in tenths is rounded to a half (Art. 15 Abs. 2)");
const tenths = evaluate(subjects, { ...sheet, bio: { en: "5.4", written: "", oral: "" }, ph: { en: "2.9", written: "", oral: "" } });
const bioRow = tenths.rows.find((r) => r.def.id === "bio")!, phRow = tenths.rows.find((r) => r.def.id === "ph")!;
ok(bioRow.mn === 5.5 && bioRow.saldo === 1.5, `5.4 → MN ${bioRow.mn}, Saldo ${bioRow.saldo}`);
ok(phRow.mn === 3.0 && phRow.saldo === -2.0, `2.9 → MN ${phRow.mn}, Saldo ${phRow.saldo}`);

console.log("\nEmpty and half-filled sheets give no verdict");
ok(evaluate(subjects, {}).status === "empty", "empty");
ok(evaluate(subjects, { de: { en: "4.0", written: "", oral: "" } }).status === "incomplete", "one subject only → incomplete");

console.log(failed ? `\n${failed} check(s) FAILED\n` : "\nall checks passed\n");
process.exit(failed ? 1 : 0);
