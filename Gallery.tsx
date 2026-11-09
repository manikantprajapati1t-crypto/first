"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const n = images.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, go]);

  if (n === 0) {
    return (
      <div className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-charcoal to-graphite text-center text-champagne">
        <div>
          <Building2 size={56} strokeWidth={1.1} className="mx-auto" aria-hidden />
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/70">Photographs available on request</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-sand sm:aspect-[16/9]">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${title} — photo ${index + 1} of ${n}`}
          fill
          priority={index === 0}
          sizes="(min-width:1024px) 66vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute right-4 top-4 flex items-center gap-2 bg-ink/80 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur hover:bg-ink"
        >
          <Expand size={14} aria-hidden /> Enlarge
        </button>
        {n > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-white/90 hover:bg-white">
              <ChevronLeft aria-hidden />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-white/90 hover:bg-white">
              <ChevronRight aria-hidden />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-16 w-24 overflow-hidden border-2 sm:h-20 sm:w-28 ${i === index ? "border-crimson" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="112px" quality={60} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label={`${title} photo gallery`} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4">
          <button type="button" aria-label="Close gallery" onClick={() => setLightbox(false)} className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center text-white">
            <X size={28} />
          </button>
          <div className="relative h-full w-full max-w-6xl">
            <Image src={images[index]} alt={`${title} — photo ${index + 1}`} fill sizes="100vw" quality={85} className="object-contain" />
          </div>
          {n > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/10 text-white hover:bg-white/25">
                <ChevronLeft />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/10 text-white hover:bg-white/25">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
