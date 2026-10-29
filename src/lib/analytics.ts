/**
 * Umami custom events (self-hosted at umami.serviweb.ch, cookieless).
 *
 * Never pass grades or anything a student typed: `data` carries ruleset and moment ids
 * only. Blocked or not yet loaded → a silent no-op, so the calculators never depend on it.
 */
export type AnalyticsEvent =
  | "matura_first_grade"
  | "matura_share"
  | "matura_store_click"
  | "promotion_first_grade"
  | "promotion_share"
  | "promotion_store_click";

type Umami = { track: (event: string, data?: Record<string, string>) => void };

export function track(event: AnalyticsEvent, data?: Record<string, string>): void {
  try {
    (window as Window & { umami?: Umami }).umami?.track(event, data);
  } catch {
    // analytics must never break the page
  }
}
