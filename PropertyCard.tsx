import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, BedDouble, Building2, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "@/db/schema";
import { formatArea, formatPrice } from "@/lib/format";

export function PropertyCard({ p, priority = false }: { p: Property; priority?: boolean }) {
  const area = formatArea(p.areaValue, p.areaUnit);
  const cover = p.images[0];
  const unavailable = p.status === "Sold" || p.status === "Rented";
  return (
    <article className="tilt group flex h-full flex-col overflow-hidden bg-white shadow-[0_8px_30px_-18px_rgba(0,0,0,0.25)]">
      <Link href={`/properties/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sand" aria-label={`View details: ${p.title}`}>
        {cover ? (
          <Image
            src={cover}
            alt={`${p.title} — ${p.propertyType} in ${p.location}`}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            quality={75}
            priority={priority}
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-charcoal to-graphite text-champagne">
            <Building2 size={48} strokeWidth={1.2} aria-hidden />
          </div>
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="bg-ink/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            {p.propertyType}
          </span>
          <span className="bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink">For {p.purpose}</span>
        </div>
        {p.status !== "Available" && (
          <span className={`absolute bottom-4 left-4 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white ${unavailable ? "bg-crimson" : "bg-champagne !text-ink"}`}>
            {p.status}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
          <MapPin size={14} aria-hidden className="text-crimson" /> {p.location}
        </p>
        <h3 className="font-display mt-3 text-[1.7rem] leading-tight">
          <Link href={`/properties/${p.slug}`} className="hover:text-crimson">
            {p.title}
          </Link>
        </h3>
        <p className="mt-3 text-lg font-semibold text-ink">{formatPrice(p.price)}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-sand pt-5 text-sm text-stone">
          {area && (
            <li className="flex items-center gap-1.5">
              <Maximize2 size={15} aria-hidden /> {area}
            </li>
          )}
          {p.bedrooms != null && (
            <li className="flex items-center gap-1.5">
              <BedDouble size={16} aria-hidden /> {p.bedrooms} Bed
            </li>
          )}
          {p.bathrooms != null && (
            <li className="flex items-center gap-1.5">
              <Bath size={15} aria-hidden /> {p.bathrooms} Bath
            </li>
          )}
        </ul>
        <Link
          href={`/properties/${p.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-ink hover:text-crimson"
        >
          View details <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
