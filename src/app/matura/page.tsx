import type { Metadata } from "next";
import Link from "next/link";
import MaturaRechner from "@/components/matura/MaturaRechner";
import MaturaRules from "@/components/matura/MaturaRules";
import Faq from "@/components/Faq";
import DownloadCta from "@/components/DownloadCta";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, MATURA_DESCRIPTION, MATURA_FAQS, MATURA_PATH, MATURA_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${MATURA_TITLE} | ${APP_NAME}` },
  description: MATURA_DESCRIPTION,
  alternates: { canonical: MATURA_PATH },
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: APP_NAME,
    title: MATURA_TITLE,
    description: MATURA_DESCRIPTION,
    url: MATURA_PATH,
    images: [{ url: `${MATURA_PATH}og.png`, width: 1200, height: 630, alt: "Bestehst du die Matura? Kostenloser Matura-Rechner" }],
  },
  twitter: { card: "summary_large_image", title: MATURA_TITLE, description: MATURA_DESCRIPTION, images: [`${MATURA_PATH}og.png`] },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Matura-Rechner",
  alternateName: "Matura Notenrechner",
  description: MATURA_DESCRIPTION,
  url: `${SITE_URL}${MATURA_PATH}`,
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: "de-CH",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  author: { "@type": "Organization", name: APP_NAME, url: SITE_URL },
  areaServed: { "@type": "AdministrativeArea", name: "Kanton St.Gallen" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MATURA_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: APP_NAME, item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Matura-Rechner", item: `${SITE_URL}${MATURA_PATH}` },
  ],
};

export default function MaturaPage() {
  return (
    <>
      {[appJsonLd, faqJsonLd, breadcrumbJsonLd].map((jsonLd, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ))}

      <header className="bg-gradient-to-b from-brand-soft to-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 sm:px-6">
          <Link href="/" aria-label={`${APP_NAME} – Startseite`}>
            <Logo />
          </Link>
          <Link href="/#download-heading" className="text-sm font-semibold text-brand-dark hover:underline">
            Zur App
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-3">
            Kantonsschule Wil · Kanton St.Gallen · Bestehensnormen
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Matura-Rechner</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-2">
            Bestehst du die Matura? Trag deine Noten ein und sieh sofort, wo du stehst und was du in den offenen
            Prüfungen noch brauchst. Nichts wird hochgeladen — alles bleibt auf deinem Gerät.
          </p>
        </div>
      </header>

      <main className="bg-ground">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <MaturaRechner rules={<MaturaRules />} />
        </div>

        <DownloadCta
          title="Verfolge das über zwei Jahre statt nur heute."
          text="In der App kommen die Erfahrungsnoten aus deinen Semestern, die Prognose aktualisiert sich nach jeder Prüfung, und du bekommst Bescheid, wenn das Ergebnis kippt. Kostenlos, kein Abo."
        />

        <Faq items={MATURA_FAQS} />
      </main>
      <Footer />
    </>
  );
}
