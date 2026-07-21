import { APP_NAME, APP_ONE_LINER, APP_DESCRIPTION } from "@/lib/site";
import StoreBadges from "./StoreBadges";
import PhoneFrame from "./PhoneFrame";
import Logo from "./Logo";

export default function Hero() {
  return (
    <header className="overflow-hidden bg-gradient-to-b from-brand-soft to-white">
      <div className="mx-auto grid min-h-svh max-w-6xl content-center items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:gap-8">
        <div>
          <Logo />
          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {APP_ONE_LINER}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {APP_DESCRIPTION}
          </p>
          <StoreBadges className="mt-8" />
          <p className="mt-3 text-sm text-slate-500">
            Kostenlos für iOS und Android · Gemacht für Schweizer Schüler 🇨🇭
          </p>
        </div>
        {/* Width cap ties phone height to the viewport so the hero stays 100vh. */}
        <div className="mx-auto w-full max-w-[min(300px,40svh)] sm:max-w-[min(330px,40svh)]">
          <PhoneFrame
            src="/screenshots/overview.jpeg"
            alt={`${APP_NAME} Übersicht mit aktueller Lektion, nächster Lektion und Wochenplan`}
            priority
          />
        </div>
      </div>
    </header>
  );
}
