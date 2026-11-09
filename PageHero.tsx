import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  image = "/images/skyline-sunset.jpg",
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink pb-16 pt-36 text-white lg:pb-24 lg:pt-48">
      <Image src={image} alt="" fill priority sizes="100vw" quality={60} className="-z-10 object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/80" />
      <div className="container-x">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)]">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
