/**
 * The 1080×1920 result image that goes into a Klassenchat. Deliberately carries no
 * per-subject grades — only the verdict, the Saldo, the count below 4 and the link.
 */
import { SITE_URL, MATURA_PATH } from "@/lib/site";

export interface ShareData {
  headline: string;   // "Bestanden" | "Nicht bestanden" | "Ich brauche noch"
  big: string;        // "4.5" | "" — the number under the headline
  sub: string;        // "in jeder der 5 offenen Prüfungen" | "Saldo +2.5"
  tone: "pass" | "fail" | "forecast";
  saldo: string;      // "+2.5"
  below: string;      // "3 / 4"
}

const BRAND = "#4ECDC4", INK = "#2C3E50", INK2 = "#7F8C8D", INK3 = "#95A5A6";
const TONE = { pass: "#51CF66", fail: "#FF6B6B", forecast: "#FFD93D" };

export function drawShareImage(d: ShareData): HTMLCanvasElement {
  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const font = (w: number, px: number) => `${w} ${px}px Inter, ui-sans-serif, system-ui, sans-serif`;

  ctx.fillStyle = BRAND;
  ctx.fillRect(0, 0, W, H);

  // wordmark
  ctx.fillStyle = "#FFFFFF";
  ctx.font = font(700, 40);
  ctx.textBaseline = "middle";
  ctx.fillText("Matura-Rechner", 80, 150);

  // card
  const cx = 80, cy = 380, cw = W - 160, ch = 1000, r = 40;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.fillStyle = "#FFFFFF"; ctx.fill();
  ctx.restore();

  // status dot + label
  ctx.fillStyle = TONE[d.tone];
  ctx.beginPath(); ctx.arc(cx + 72, cy + 96, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = INK3; ctx.font = font(600, 28);
  ctx.fillText(d.tone === "forecast" ? "PROGNOSE" : "ERGEBNIS", cx + 104, cy + 96);

  // headline + big number
  ctx.fillStyle = INK2; ctx.font = font(500, 34);
  ctx.fillText(d.headline, cx + 64, cy + 200);
  if (d.big) {
    ctx.fillStyle = INK; ctx.font = font(800, 220); ctx.textBaseline = "alphabetic";
    ctx.fillText(d.big, cx + 56, cy + 440);
    ctx.textBaseline = "middle";
  } else {
    ctx.fillStyle = d.tone === "pass" ? "#38A89D" : TONE.fail; ctx.font = font(800, 120); ctx.textBaseline = "alphabetic";
    ctx.fillText(d.tone === "pass" ? "Bestanden" : "Nicht bestanden", cx + 56, cy + 380);
    ctx.textBaseline = "middle";
  }
  ctx.fillStyle = INK2; ctx.font = font(500, 34);
  wrap(ctx, d.sub, cx + 64, cy + 520, cw - 128, 46);

  // divider
  ctx.fillStyle = "#E8ECEF"; ctx.fillRect(cx + 64, cy + 660, cw - 128, 2);

  // two stats
  stat(ctx, cx + 64, cy + 740, "Saldo", d.saldo, d.saldo.startsWith("−") || d.saldo.startsWith("-") ? TONE.fail : "#38A89D");
  stat(ctx, cx + cw / 2 + 16, cy + 740, "Noten unter 4.0", d.below, parseInt(d.below, 10) > 4 ? TONE.fail : "#38A89D");

  // footer
  ctx.fillStyle = "#FFFFFF"; ctx.font = font(800, 56);
  ctx.fillText("Und du? Rechne deine aus.", 80, 1560);
  ctx.font = font(600, 38);
  ctx.fillText(`${SITE_URL.replace(/^https?:\/\//, "")}${MATURA_PATH.replace(/\/$/, "")}`, 80, 1640);
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = font(500, 28);
  ctx.fillText("Kein Login · nichts wird hochgeladen · 30 Sekunden", 80, 1700);

  return c;
}

function stat(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, value: string, color: string) {
  ctx.fillStyle = INK2; ctx.font = `500 30px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(label, x, y);
  ctx.fillStyle = color; ctx.font = `700 76px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(value, x, y + 80);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "", yy = y;
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; }
    else line = t;
  }
  if (line) ctx.fillText(line, x, yy);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Web Share with the image where the platform allows it, otherwise a download. */
export async function shareImage(canvas: HTMLCanvasElement): Promise<"shared" | "downloaded" | "failed"> {
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return "failed";
  const file = new File([blob], "matura-rechner.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData_) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Matura-Rechner" });
      return "shared";
    } catch {
      return "failed"; // user cancelled — nothing to download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "matura-rechner.png";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
type ShareData_ = { files: File[] };
