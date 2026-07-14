import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, APP_ONE_LINER, APP_DESCRIPTION, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_ONE_LINER}`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
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
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
