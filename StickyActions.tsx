"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

/** Mobile bottom action bar + desktop floating WhatsApp button. */
export function StickyActions() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const wa = whatsappLink("Hello Golf Course Property, I would like to know more about your properties.");
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-ink text-white lg:hidden" role="group" aria-label="Quick contact">
        <a href={`tel:${SITE.phones[0].tel}`} className="flex h-16 flex-col items-center justify-center gap-1 text-[0.65rem] font-semibold uppercase tracking-widest">
          <Phone size={18} aria-hidden /> Call
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex h-16 flex-col items-center justify-center gap-1 bg-[#1f8f4e] text-[0.65rem] font-semibold uppercase tracking-widest">
          <MessageCircle size={18} aria-hidden /> WhatsApp
        </a>
        <Link href="/contact" className="flex h-16 flex-col items-center justify-center gap-1 bg-crimson text-[0.65rem] font-semibold uppercase tracking-widest">
          Enquire
        </Link>
      </div>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-xl transition-transform hover:scale-110 lg:grid"
      >
        <MessageCircle size={26} aria-hidden />
      </a>
    </>
  );
}
