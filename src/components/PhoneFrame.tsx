import Image from "next/image";

/**
 * Simple CSS phone mockup: dark bezel, rounded corners, drop shadow.
 * Screenshots are 738×1600 raw device captures.
 */
export default function PhoneFrame({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2.1rem] bg-slate-900 p-2 shadow-xl shadow-slate-900/25 ring-1 ring-slate-900/10 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={738}
        height={1600}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="w-full rounded-[1.7rem]"
      />
    </div>
  );
}
