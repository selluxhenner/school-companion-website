import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { APP_NAME, APP_ONE_LINER, APP_DESCRIPTION, SITE_URL } from "@/lib/site";

// The app's typeface (constants/theme.ts: Inter 400/500/600/700), self-hosted at build.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_ONE_LINER}`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  category: "education",
  // iOS Safari Smart App Banner pointing at the App Store listing.
  itunes: { appId: "6760979206" },
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_ONE_LINER}`,
    description: APP_DESCRIPTION,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${APP_NAME} app preview` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_ONE_LINER}`,
    description: APP_DESCRIPTION,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-CH" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
