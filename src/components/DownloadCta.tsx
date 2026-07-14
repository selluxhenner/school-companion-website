import { APP_NAME } from "@/lib/site";
import StoreBadges from "./StoreBadges";

export default function DownloadCta() {
  return (
    <section aria-labelledby="download-heading" className="bg-brand">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center sm:py-20">
        <h2 id="download-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Hol dir {APP_NAME}
        </h2>
        <p className="mt-3 text-lg text-white/90">
          Kostenlos für iOS und Android – kein Abo, keine versteckten Kosten.
        </p>
        <StoreBadges className="mt-8 justify-center" />
      </div>
    </section>
  );
}
