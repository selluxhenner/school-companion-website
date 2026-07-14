import { APP_NAME, APP_ONE_LINER, APP_DESCRIPTION } from "@/lib/site";
import StoreBadges from "./StoreBadges";
import PhoneFrame from "./PhoneFrame";
import Logo from "./Logo";

export default function Hero() {
  return (
    <header className="overflow-hidden bg-gradient-to-b from-brand-soft to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:pb-24">
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
        <div className="mx-auto w-full max-w-[300px] sm:max-w-[330px]">
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
