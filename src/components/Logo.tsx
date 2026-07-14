import { APP_NAME } from "@/lib/site";

/**
 * TODO: LOGO — once your logo file is in /public (e.g. /logo.svg), replace
 * the inline SVG mark below with:
 *   <Image src="/logo.svg" alt="" width={40} height={40} />
 * (import Image from "next/image")
 */
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
    </div>
  );
}
