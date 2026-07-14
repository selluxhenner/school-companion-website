import Image from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

/**
 * Official store badges. Per branding guidelines they keep their original
 * proportions (App Store 120×40, Google Play 646×250 incl. built-in padding)
 * and are never recolored. Both render at a matching visual height.
 */
export default function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      <a href={APP_STORE_URL} aria-label="School Companion im App Store laden">
        <Image
          src="/badges/app-store-badge.svg"
          alt="Laden im App Store"
          width={162}
          height={54}
          className="h-[54px] w-auto"
        />
      </a>
      <a href={PLAY_STORE_URL} aria-label="School Companion bei Google Play laden">
        {/* Google's badge PNG ships with ~15% internal clear space, so it
            renders slightly taller to visually match the Apple badge. */}
        <Image
          src="/badges/google-play-badge.png"
          alt="Jetzt bei Google Play"
          width={186}
          height={72}
          className="h-[72px] w-auto"
        />
      </a>
    </div>
  );
}
