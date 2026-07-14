import { SCREENSHOTS } from "@/lib/site";
import PhoneFrame from "./PhoneFrame";

export default function Screenshots() {
  return (
    <section aria-labelledby="screenshots-heading" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h2 id="screenshots-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Die App in Aktion
      </h2>
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
        {SCREENSHOTS.map((shot) => (
          <li key={shot.src} className="flex flex-col items-center">
            <PhoneFrame src={shot.src} alt={shot.alt} className="w-full max-w-[220px]" />
            <p className="mt-4 max-w-[24ch] text-center text-sm leading-snug text-slate-600">
              {shot.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
