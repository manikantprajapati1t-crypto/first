"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-ink/95 py-3 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md" : "bg-gradient-to-b from-black/60 to-transparent py-5"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4">
        <Link href="/" aria-label={`${SITE.name} — home`} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className="link-underline pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-white/90 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${SITE.phones[0].tel}`}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white/90 hover:text-champagne"
          >
            <Phone size={16} aria-hidden /> {SITE.phones[0].display}
          </a>
          <Link href="/contact" className="btn btn-primary !min-h-11 !px-5">
            Enquire
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-ink transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-8">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(n.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              className={`border-b border-white/10 py-5 font-display text-3xl text-white transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } ${isActive(n.href) ? "text-champagne" : ""}`}
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            {SITE.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="btn btn-ghost-light">
                <Phone size={16} aria-hidden /> Call {p.display}
              </a>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary">
              Schedule a consultation
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
