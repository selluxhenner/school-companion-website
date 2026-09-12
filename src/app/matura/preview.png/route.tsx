import { ImageResponse } from "next/og";
import { interFonts } from "@/lib/matura/buildFonts";

/**
 * A 738×1600 "screenshot" of the Matura-Rechner for the homepage phone frame, drawn at
 * build time with the same tokens as the page (globals.css). Shows the demo student from
 * the plan: written exams back, orals open, needs 4.5 everywhere.
 */
export const dynamic = "force-static";

const INK = "#2C3E50", INK2 = "#7F8C8D", INK3 = "#95A5A6", LINE = "#E8ECEF", LINE2 = "#D1D8DD";
const BRAND = "#4ECDC4", BRAND_DARK = "#38A89D", ACCENT = "#FF6B6B", WARN = "#FFD93D", YELLOW = "#ECCD52";
const SURFACE2 = "#F8F9FA";

const overline = { fontSize: 20, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" as const, color: INK3 };

function Cell({ v, label, low = false, empty = false }: { v: string; label: string; low?: boolean; empty?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 104, height: 66, borderRadius: 14, border: `2px solid ${low ? ACCENT : LINE}`, background: "#FFFFFF", fontSize: 26, color: empty ? LINE2 : INK }}>
        {v}
      </div>
      <div style={{ fontSize: 19, fontWeight: 500, color: INK3 }}>{label}</div>
    </div>
  );
}

function Pill({ v, tone }: { v: string; tone: "neg" | "pos" | "zero" }) {
  const bg = tone === "neg" ? "rgba(255,107,107,0.13)" : tone === "pos" ? "rgba(78,205,196,0.15)" : SURFACE2;
  const color = tone === "neg" ? ACCENT : tone === "pos" ? BRAND_DARK : INK3;
  return (
    <div style={{ display: "flex", justifyContent: "center", minWidth: 86, padding: "6px 14px", borderRadius: 10, background: bg, color, fontSize: 22, fontWeight: 500 }}>
      {v}
    </div>
  );
}

function Row({ color, name, mn, saldo, tone, cells }: { color: string; name: string; mn: string; saldo: string; tone: "neg" | "pos" | "zero"; cells: Array<{ v: string; label: string; low?: boolean; empty?: boolean }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "22px 28px", borderTop: `2px solid ${LINE}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 7, height: 50, borderRadius: 4, background: color }} />
        <div style={{ flex: 1, fontSize: 28, fontWeight: 600, color: INK }}>{name}</div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: INK }}><span>{mn}</span><span style={{ color: INK3 }}>*</span></div>
        <Pill v={saldo} tone={tone} />
      </div>
      <div style={{ display: "flex", gap: 18, paddingLeft: 27 }}>
        {cells.map((c) => <Cell key={c.label} {...c} />)}
      </div>
    </div>
  );
}

export async function GET() {
  const fonts = await interFonts([500, 600, 700, 800]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FAFBFC", color: INK, fontFamily: "Inter" }}>
        {/* header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "72px 36px 40px", background: "linear-gradient(180deg, #E8FFFE 0%, #FFFFFF 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: BRAND }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
              </svg>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.4 }}>School Companion</div>
          </div>
          <div style={{ ...overline, marginTop: 24 }}>Kantonsschule Wil · Bestehensnormen</div>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>Matura-Rechner</div>
        </div>

        {/* verdict card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30, margin: "0 30px", padding: 36, borderRadius: 22, background: "#FFFFFF", boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 99, background: WARN }} />
            <div style={overline}>Prognose · 7 Prüfungen noch offen</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: INK2 }}>Das brauchst du noch</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 0.95, color: YELLOW }}>4.5</div>
              <div style={{ fontSize: 24, color: INK2, paddingBottom: 6 }}>in jeder der 7 offenen Prüfungen</div>
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.45, color: INK2, marginTop: 6 }}>
              Schaffst du das überall, ist die Matura bestanden — egal wie der Rest ausfällt.
            </div>
          </div>
          <div style={{ height: 2, background: LINE }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: 27, fontWeight: 600 }}>Saldo</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: ACCENT }}>−1.5</div>
            </div>
            <div style={{ display: "flex", position: "relative", height: 11, borderRadius: 6, background: SURFACE2 }}>
              <div style={{ position: "absolute", left: "43.75%", width: "6.25%", height: 11, borderRadius: 6, background: ACCENT }} />
              <div style={{ position: "absolute", left: "50%", top: -5, width: 3, height: 21, borderRadius: 2, background: LINE2 }} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 500, color: INK2 }}>Minuspunkte zählen doppelt · mindestens 0</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: 27, fontWeight: 600 }}>Noten unter 4.0</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: BRAND_DARK }}>2 / 4</div>
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              {[ACCENT, ACCENT, SURFACE2, SURFACE2].map((c, i) => <div key={i} style={{ flex: 1, height: 11, borderRadius: 6, background: c }} />)}
            </div>
            <div style={{ fontSize: 21, fontWeight: 500, color: INK2 }}>2 weitere sind noch möglich</div>
          </div>
        </div>

        {/* subjects */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "48px 38px 18px" }}>
          <div style={overline}>13 Maturanoten</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK2 }}>Zurücksetzen</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", margin: "0 30px", borderRadius: 22, border: `2px solid ${LINE}`, background: "#FFFFFF", overflow: "hidden" }}>
          <Row color="#EF4444" name="Deutsch" mn="4.0" saldo="±0.0" tone="zero" cells={[{ v: "4.0", label: "Zeugnis 4. Kl." }, { v: "3.0", label: "schriftlich", low: true }, { v: "—", label: "mündlich", empty: true }]} />
          <Row color="#EC4899" name="Französisch" mn="4.0" saldo="±0.0" tone="zero" cells={[{ v: "4.0", label: "Zeugnis 4. Kl." }, { v: "3.5", label: "schriftlich", low: true }, { v: "—", label: "mündlich", empty: true }]} />
          <Row color="#6366F1" name="Mathematik" mn="3.5" saldo="−1.0" tone="neg" cells={[{ v: "4.0", label: "Zeugnis 4. Kl." }, { v: "2.5", label: "schriftlich", low: true }, { v: "—", label: "mündlich", empty: true }]} />
        </div>
      </div>
    ),
    { width: 738, height: 1600, fonts },
  );
}
