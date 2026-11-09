import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { AREAS, FULL_ADDRESS, MAPS_LINK, NAV, SERVICES, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white/75">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo />
          <p className="font-display mt-6 text-2xl text-champagne">{SITE.hindiName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Plots, floors &amp; flats — buy, sell or rent. A Sector 43 real estate consultancy on Golf Course Road, Gurugram.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-white">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-white">Services &amp; Areas</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link href="/services" className="link-underline hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-white/55">{AREAS.map((a) => a.name).join(" · ")}</p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-white">Visit &amp; Call</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-champagne" aria-hidden />
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {FULL_ADDRESS}
              </a>
            </li>
            {SITE.phones.map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-champagne" aria-hidden />
                <a href={`tel:${p.tel}`} className="hover:text-white">
                  {p.display}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-champagne" aria-hidden />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</p>
          <p>
            Property details are indicative and subject to confirmation. <Link href="/admin" className="hover:text-white">Staff login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
