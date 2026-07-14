import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Screenshots from "@/components/Screenshots";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import DownloadCta from "@/components/DownloadCta";
import Footer from "@/components/Footer";
import {
  APP_NAME,
  APP_ONE_LINER,
  APP_DESCRIPTION,
  APP_STORE_URL,
  PLAY_STORE_URL,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  // Home gets the full branded title (no template suffix).
  title: { absolute: `${APP_NAME} — ${APP_ONE_LINER}` },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  operatingSystem: "iOS, Android",
  applicationCategory: "EducationApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
  installUrl: [APP_STORE_URL, PLAY_STORE_URL],
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  // TODO: enable once the store listings have reviews — fill in real values.
  // aggregateRating: {
  //   "@type": "AggregateRating",
  //   ratingValue: "4.8",
  //   ratingCount: "120",
  // },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <main>
        <Screenshots />
        <Features />
        <HowItWorks />
        <DownloadCta />
      </main>
      <Footer />
    </>
  );
}
