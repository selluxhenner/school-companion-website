import type { Metadata } from "next";
import Link from "next/link";
import PromotionRechner from "@/components/promotion/PromotionRechner";
import PromotionRules from "@/components/promotion/PromotionRules";
import Faq from "@/components/Faq";
import DownloadCta from "@/components/DownloadCta";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, MATURA_PATH, PROMOTION_DESCRIPTION, PROMOTION_FAQS, PROMOTION_PATH, PROMOTION_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${PROMOTION_TITLE} | ${APP_NAME}` },
  description: PROMOTION_DESCRIPTION,
  alternates: { canonical: PROMOTION_PATH },
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: APP_NAME,
    title: PROMOTION_TITLE,
    description: PROMOTION_DESCRIPTION,
    url: PROMOTION_PATH,
    images: [{ url: `${PROMOTION_PATH}og.png`, width: 1200, height: 630, alt: "Werde ich promoviert? Kostenloser Promotion-Rechner" }],
  },
  twitter: { card: "summary_large_image", title: PROMOTION_TITLE, description: PROMOTION_DESCRIPTION, images: [`${PROMOTION_PATH}og.png`] },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Promotion-Rechner",
  alternateName: "Promotion Notenrechner Gymnasium",
  description: PROMOTION_DESCRIPTION,
  url: `${SITE_URL}${PROMOTION_PATH}`,
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
  mainEntity: PROMOTION_FAQS.map((faq) => ({
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
    { "@type": "ListItem", position: 2, name: "Promotion-Rechner", item: `${SITE_URL}${PROMOTION_PATH}` },
  ],
};

export default function PromotionPage() {
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
            Gymnasium · Kanton St.Gallen · Promotionsreglement
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Promotion-Rechner</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-2">
            Wirst du promoviert? Trag deine Noten ein und sieh sofort, wie dein Saldo aussieht und was dir noch fehlt.
            Nichts wird hochgeladen — alles bleibt auf deinem Gerät.
          </p>
          <p className="mt-3 text-sm text-ink-2">
            Geht es um die Matura statt um die Promotion?{" "}
            <Link href={MATURA_PATH} className="font-semibold text-brand-dark hover:underline">
              Zum Matura-Rechner
            </Link>
            .
          </p>
        </div>
      </header>

      <main className="bg-ground">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <PromotionRechner rules={<PromotionRules />} />
        </div>

        <DownloadCta
          title="Behalte deinen Saldo das ganze Jahr im Blick."
          text="In der App kommen die Noten direkt aus deinen Prüfungen, der Durchschnitt aktualisiert sich nach jeder Note, und du siehst früh, wenn es eng wird. Kostenlos, kein Abo."
          source="promotion"
        />

        <Faq items={PROMOTION_FAQS} />
      </main>
      <Footer />
    </>
  );
}
