import { SITE } from "@/lib/site";

/** Typographic wordmark echoing the red-and-white office signage (no logo file was supplied). */
export function Logo({ light = true }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center bg-crimson font-display text-xl font-semibold leading-none text-white"
      >
        GC
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.35rem] font-semibold tracking-wide ${light ? "text-white" : "text-ink"}`}>
          {SITE.name}
        </span>
        <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${light ? "text-champagne" : "text-stone"}`}>
          Sector 43 · Gurugram
        </span>
      </span>
    </span>
  );
}
