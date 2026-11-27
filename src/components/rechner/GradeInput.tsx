import { TOUCH, focusNextGrade } from "./touch";

/** One grade field, shared by the Matura and Promotion calculators. Accepts "4,5" and "4.5". */
export default function GradeInput({ value, parsed, step, label, onChange, placeholder, kind = "grade" }: {
  value: string;
  parsed: number | null;
  step: 0.1 | 0.5;
  label: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** What the field holds, so a page can find its empty ones (see focusFirstEmptyGrade). */
  kind?: string;
}) {
  const invalid = value.trim() !== "" && parsed === null;
  const low = parsed !== null && parsed < 4;
  return (
    <input
      type="text"
      inputMode="decimal"
      enterKeyHint="next"
      autoComplete="off"
      data-grade={kind}
      aria-label={label}
      aria-invalid={invalid || undefined}
      placeholder={placeholder ?? (step === 0.5 ? "4.5" : "4.3")}
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
      // Tapping a filled field marks the old grade, so the next key replaces it.
      onFocus={(ev) => ev.currentTarget.select()}
      onKeyDown={(ev) => {
        if (ev.key !== "Enter" || ev.nativeEvent.isComposing) return;
        ev.preventDefault();
        focusNextGrade(ev.currentTarget);
      }}
      className={`tnum h-9 w-14 shrink-0 rounded-thumb border bg-surface text-center text-sm text-ink placeholder:text-line-2 focus:outline-none focus:ring-2 focus:ring-brand/40 ${TOUCH} ${
        invalid || low ? "border-accent" : "border-line"
      }`}
    />
  );
}
