/**
 * Inter for build-time images (next/og). Fetched from Google Fonts while `next build`
 * runs; an old Safari UA makes Google serve WOFF, which satori can read (WOFF2 it
 * cannot). Offline the images fall back to satori's default face.
 */
export type BuildFont = { name: string; weight: 400 | 500 | 600 | 700 | 800; style: "normal"; data: ArrayBuffer };

export async function interFonts(weights: Array<400 | 500 | 600 | 700 | 800>): Promise<BuildFont[] | undefined> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weights.join(";")}&display=swap`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.10" },
    }).then((r) => r.text());
    const faces = [...css.matchAll(/font-weight: (\d+);[^}]*?src: url\(([^)]+)\)/g)];
    const fonts = await Promise.all(
      faces.map(async (m) => ({
        name: "Inter",
        weight: Number(m[1]) as BuildFont["weight"],
        style: "normal" as const,
        data: await fetch(m[2]).then((r) => r.arrayBuffer()),
      })),
    );
    return fonts.length ? fonts : undefined;
  } catch {
    return undefined;
  }
}
