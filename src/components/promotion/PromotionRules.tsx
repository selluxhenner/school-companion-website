/**
 * "So wird gerechnet" — the rule, the rounding and the consequences, each with its article
 * in the Promotionsreglement des Gymnasiums (Kanton St.Gallen, 3.2.101).
 */
export default function PromotionRules() {
  const rows: Array<[string, string, string]> = [
    ["Promotionsnote", "Ganze oder halbe Note. Ein Viertel wird aufgerundet: 3.75 → 4.0, 4.25 → 4.5", "Art. 14 MSV"],
    ["Saldo", "Σ (Note − 4), Abweichungen unter 4 zählen doppelt", "Art. 2"],
    ["Promoviert", "Saldo ≥ 0. Es gibt keine Höchstzahl ungenügender Noten", "Art. 2"],
    ["Probezeit", "Bis Saldo −1.0 kann die Konferenz provisorisch ins 2. Semester promovieren", "Art. 8bis Abs. 2 / Art. 6 Abs. 2"],
    ["Zweiter Fehlversuch", "Wer schon einmal nicht promoviert wurde und erneut nicht genügt, wird ausgeschlossen", "Art. 5 / Art. 11"],
  ];

  return (
    <section aria-labelledby="rules-heading" className="flex flex-col gap-3">
      <h2 id="rules-heading" className="px-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
        So wird gerechnet
      </h2>
      <details className="group rounded-card border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[15px] font-medium">
          Die Promotionsregeln des Kantons St.Gallen in fünf Zeilen
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-ink-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <div className="flex flex-col gap-4 border-t border-line px-4 py-4 text-sm leading-relaxed text-ink-2">
          <dl className="flex flex-col gap-2">
            {rows.map(([k, v, art]) => (
              <div key={k} className="grid grid-cols-[112px_1fr] gap-x-3 gap-y-0.5 sm:grid-cols-[132px_1fr_auto]">
                <dt className="font-medium text-ink">{k}</dt>
                <dd>{v}</dd>
                <dd className="col-start-2 text-xs text-ink-3 sm:col-start-3 sm:text-right">{art}</dd>
              </div>
            ))}
          </dl>
          <p>
            Es gibt zwei Fassungen. Das <strong className="font-semibold text-ink">bisherige Reglement</strong> (24. Juni
            1998) gilt für alle, die bis August 2025 eingetreten sind. Das{" "}
            <strong className="font-semibold text-ink">neue Reglement</strong> (17. Juni 2026, «Gymnasium der Zukunft») gilt
            für alle, die ab dem 1. August 2026 in die 1. Klasse eintreten. Die Saldo-Regel ist dieselbe; Fächer,
            Zeitpunkte und Folgen unterscheiden sich.
          </p>
          <p>
            Welche Fächer zählen, steht im Anhang 1. Im bisherigen Reglement hängt im 1. Schuljahr von deinem
            Schwerpunktfach ab, ob Musik, Bildnerisches Gestalten oder der gerundete Durchschnitt beider zählt. Religion
            oder Philosophie bekommt im 2. Schuljahr nur eine Jahresnote und zählt deshalb erst am Ende des Jahres.
          </p>
          <p>
            Nicht berücksichtigt: der Ermessensspielraum der Promotionskonferenz (Art. 6bis / Art. 13), Absenzen
            (Art. 5 neues Reglement), die Sportklassen und die IB-Klassen. Beim bisherigen Reglement heisst es in der
            Probezeit «höchstens minus 1.0 Notenpunkte» — der Rechner liest das wie im neuen Reglement («nicht tiefer als
            minus 1.0»).
          </p>
          <p className="text-xs text-ink-3">
            Quelle: Promotionsreglement des Gymnasiums vom 24. Juni 1998 (Neudruck Juli 2026) und vom 17. Juni 2026
            (Handbuch Mittelschulen 3.2.101), Mittelschulverordnung Art. 14 (sGS 215.11). Angaben ohne Gewähr — es zählt
            der Entscheid der Schule.
          </p>
        </div>
      </details>
    </section>
  );
}
