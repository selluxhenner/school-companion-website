import { ImageResponse } from "next/og";
import { APP_NAME, MATURA_PATH, SITE_URL } from "@/lib/site";
import { interFonts } from "@/lib/matura/buildFonts";

/**
 * The link preview WhatsApp shows when someone pastes /matura/ into a chat.
 * A route handler rather than the opengraph-image convention so the static export
 * writes a real `/matura/og.png` — nginx then serves it as image/png without config.
 */
const size = { width: 1200, height: 630 };
export const dynamic = "force-static";

export async function GET() {
  const fonts = await interFonts([500, 800]);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(180deg, #E8FFFE 0%, #FFFFFF 100%)",
          color: "#2C3E50",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#4ECDC4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>{APP_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Bestehst du die Matura?</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#7F8C8D" }}>
            Kostenloser Matura-Rechner · Kanti Wil · nichts wird hochgeladen
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, fontWeight: 500, color: "#38A89D" }}>
          <span>
            {host}
            {MATURA_PATH.replace(/\/$/, "")}
          </span>
          <span style={{ color: "#95A5A6" }}>Kein Login · 30 Sekunden</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
