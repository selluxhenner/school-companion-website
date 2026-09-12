import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Screenshots from "@/components/Screenshots";
import Features from "@/components/Features";
import MaturaTeaser from "@/components/MaturaTeaser";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";
import DownloadCta from "@/components/DownloadCta";
import Footer from "@/components/Footer";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_STORE_URL,
  PLAY_STORE_URL,
  SEO_TITLE,
  SITE_URL,
  FAQS,
  FEATURES,
  SCREENSHOTS,
} from "@/lib/site";

export const metadata: Metadata = {
  // Home gets the full keyword-bearing title (no template suffix).
  title: { absolute: SEO_TITLE },
  alternates: { canonical: "/" },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  operatingSystem: "iOS, Android",
  applicationCategory: "EducationApplication",
  inLanguage: "de-CH",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
  },
  featureList: FEATURES.map((f) => f.title),
  screenshot: SCREENSHOTS.map((s) => `${SITE_URL}${s.src}`),
  downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
  installUrl: [APP_STORE_URL, PLAY_STORE_URL],
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  author: {
    "@type": "Organization",
    name: APP_NAME,
    url: SITE_URL,
  },
  // TODO: enable once the store listings have reviews — fill in real values.
  // aggregateRating: {
  //   "@type": "AggregateRating",
  //   ratingValue: "4.8",
  //   ratingCount: "120",
  // },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: SITE_URL,
  inLanguage: "de-CH",
};

export default function Home() {
  return (
    <>
      {[appJsonLd, faqJsonLd, websiteJsonLd].map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      <Hero />
      <main>
        <Screenshots />
        <Features />
        <MaturaTeaser />
        <HowItWorks />
        <Faq />
        <DownloadCta />
      </main>
      <Footer />
    </>
  );
}
