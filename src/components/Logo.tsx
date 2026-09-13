import Image from "next/image";
import { APP_NAME } from "@/lib/site";

/** The app icon (public/icon.png, exported from the app's own mark) next to the wordmark. */
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/icon.png" alt="" width={40} height={40} className="h-10 w-10 rounded-xl" priority />
      <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
    </div>
  );
}
