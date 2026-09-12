import Link from "next/link";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 pt-10 text-sm text-slate-500 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/matura/" className="hover:text-ink">
                Matura-Rechner
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className="hover:text-ink">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/terms/" className="hover:text-ink">
                Nutzungsbedingungen
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
                Kontakt
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-4">
        <p className="text-center text-sm text-slate-500 sm:text-left">
          Entwickelt von{" "}
          <a
            href="https://www.serviweb.ch"
            className="font-medium text-brand-dark hover:underline"
          >
            Serviweb – Webdesign &amp; Webagentur aus der Ostschweiz
          </a>
        </p>
      </div>
    </footer>
  );
}
