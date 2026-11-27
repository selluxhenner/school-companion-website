import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { APP_NAME, MATURA_PATH, PROMOTION_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false },
};

const linkClass = "font-medium text-brand-dark underline";

/** Exported as /404.html, which nginx serves for every unknown address. */
export default function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" aria-label={`Zurück zur ${APP_NAME} Startseite`}>
          <Logo />
        </Link>

        <main className="mt-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Diese Seite gibt es nicht</h1>
          <p className="mt-4 leading-relaxed text-slate-700">
            Der Link ist falsch geschrieben oder die Seite wurde verschoben. Von hier geht es weiter:
          </p>
          <ul className="mt-4 space-y-3 leading-relaxed text-slate-700">
            <li>
              <Link href="/" className={linkClass}>
                Startseite von {APP_NAME}
              </Link>
            </li>
            <li>
              <Link href={MATURA_PATH} className={linkClass}>
                Matura-Rechner
              </Link>
            </li>
            <li>
              <Link href={PROMOTION_PATH} className={linkClass}>
                Promotion-Rechner
              </Link>
            </li>
            <li>
              <Link href="/support/" className={linkClass}>
                Hilfe
              </Link>
            </li>
          </ul>
        </main>
      </div>
      <Footer />
    </>
  );
}
