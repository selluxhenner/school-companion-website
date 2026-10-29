/** One grade field, shared by the Matura and Promotion calculators. Accepts "4,5" and "4.5". */
export default function GradeInput({ value, parsed, step, label, onChange, placeholder }: {
  value: string;
  parsed: number | null;
  step: 0.1 | 0.5;
  label: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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
