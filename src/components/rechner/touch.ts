/**
 * Fields and selects on a touch screen: 44px tall so a finger hits them, and 16px type,
 * because iOS Safari zooms into any field with smaller text and does not zoom back out.
 * With a mouse they keep the compact size each control sets itself.
 */
export const TOUCH = "pointer-coarse:h-11 pointer-coarse:text-base";

/** The grade fields of both calculators, in the order they appear on screen. */
const FIELDS = "input[data-grade]";

const onScreen = (el: HTMLElement) => el.offsetParent !== null;

/**
 * Enter, or the key that says "next" on a phone keyboard: on to the following field of the
 * same kind. Like a spreadsheet, that goes down the column (the next subject's Zeugnis
 * note), not across into exam fields that are still empty for most students.
 */
export function focusNextGrade(from: HTMLInputElement): void {
  const kind = from.dataset.grade ?? "";
  const fields = Array.from(document.querySelectorAll<HTMLInputElement>(`${FIELDS}[data-grade="${kind}"]`)).filter(onScreen);
  const next = fields[fields.indexOf(from) + 1];
  if (next) next.focus();
  else from.blur();
}

/** Puts the cursor into the first field of `kind` that is still empty. False when none is. */
export function focusFirstEmptyGrade(kind: string): boolean {
  const field = Array.from(document.querySelectorAll<HTMLInputElement>(`${FIELDS}[data-grade="${kind}"]`)).find(
    (el) => onScreen(el) && el.value.trim() === "",
  );
  field?.focus();
  return Boolean(field);
}
