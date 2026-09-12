/**
 * "So wird gerechnet" — the four formulas and the two pass rules, each with its article
 * in the Maturitätsprüfungsreglement des Gymnasiums (Kanton St.Gallen, 4.103).
 */
export default function MaturaRules() {
  const rows: Array<[string, string, string]> = [
    ["Erfahrungsnote", "Letzte Jahresnote im Fach", "Art. 15 Abs. 1 lit. a"],
    ["Prüfungsnote", "Ø schriftlich und mündlich, auf eine Dezimale", "Art. 15 Abs. 1 lit. b"],
    ["Maturanote", "Ø Prüfungsnote und Erfahrungsnote, auf halbe Noten gerundet", "Art. 15 Abs. 1 lit. c, Abs. 2"],
    ["Ohne Prüfung", "Maturanote = Erfahrungsnote", "Art. 15 Abs. 1 lit. c Ziff. 2"],
    ["Saldo", "Σ (Note − 4), Abweichungen unter 4 zählen doppelt", "Art. 16 lit. a"],
    ["Ungenügende", "Höchstens vier Maturanoten unter 4", "Art. 16 lit. b"],
  ];

  return (
    <section aria-labelledby="rules-heading" className="flex flex-col gap-3">
      <h2 id="rules-heading" className="px-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
        So wird gerechnet
      </h2>
      <details className="group rounded-card border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[15px] font-medium">
          Bestehensnormen des Kantons St.Gallen in sechs Zeilen
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
            Bestanden heisst: Saldo ≥ 0 <strong className="font-semibold text-ink">und</strong> höchstens vier
            Maturanoten unter 4. Beide Regeln stehen unverändert auch in der eidgenössischen
            Maturitätsanerkennungsverordnung 2023 (Art. 26).
          </p>
          <p>
            Geprüft wird schriftlich und mündlich in Deutsch, der zweiten Landessprache, der dritten Sprache,
            Mathematik und im Schwerpunktfach (Art. 6, 7). Dazu kommen zwei rein mündliche Prüfungen zu Beginn der
            4. Klasse — die Vormatura: ein Fach aus Biologie, Chemie, Physik und eines aus Geschichte, Geografie
            (Art. 7 Abs. 3). Schriftliche Noten werden auf Zehntel erteilt, mündliche auf halbe Noten (Art. 14).
            Besteht eine schriftliche Prüfung aus mehreren Teilen, zählt hier die Note, die die Fachgruppe daraus
            bildet.
          </p>
          <p>
            Die Prüfungskonferenz kann in Würdigung der Persönlichkeit eine einzige Note um höchstens einen halben
            Punkt anheben (Art. 18). Der Rechner kennt diesen Ermessensspielraum nicht.
          </p>
          <p className="text-xs text-ink-3">
            Quelle: Maturitätsprüfungsreglement des Gymnasiums vom 24. Juni 1998, Neudruck Oktober 2019 (Handbuch
            Mittelschulen 4.103) · Promotionsreglement des Gymnasiums, Anhang 1 (3.2.101). Geprüft am Beispiel der
            Kantonsschule Wil. Angaben ohne Gewähr — es zählt der Entscheid der Schule.
          </p>
        </div>
      </details>
    </section>
  );
}
