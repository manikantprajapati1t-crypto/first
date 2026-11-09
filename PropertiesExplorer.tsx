"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Property } from "@/db/schema";
import { PropertyCard } from "./PropertyCard";
import { areaInSqFt } from "@/lib/format";

const BANDS = [
  { id: "b1", label: "Under ₹50 Lakh", min: 0, max: 5_000_000 },
  { id: "b2", label: "₹50 Lakh – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { id: "b3", label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { id: "b4", label: "₹2 Cr – ₹5 Cr", min: 20_000_000, max: 50_000_000 },
  { id: "b5", label: "₹5 Cr & above", min: 50_000_000, max: Infinity },
];

type Initial = { q?: string; type?: string; location?: string; purpose?: string };

export function PropertiesExplorer({ properties, initial }: { properties: Property[]; initial: Initial }) {
  const [q, setQ] = useState(initial.q ?? "");
  const [type, setType] = useState(initial.type ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [purpose, setPurpose] = useState(initial.purpose ?? "");
  const [band, setBand] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const locations = useMemo(() => [...new Set(properties.map((p) => p.location))].sort(), [properties]);
  const types = useMemo(() => [...new Set(properties.map((p) => p.propertyType))].sort(), [properties]);
  const bands = useMemo(
    () => BANDS.filter((b) => properties.some((p) => p.price != null && p.price >= b.min && p.price < b.max)),
    [properties],
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const bandDef = BANDS.find((b) => b.id === band);
    const list = properties.filter((p) => {
      if (term) {
        const hay = `${p.title} ${p.location} ${p.propertyType} ${p.description} ${p.amenities.join(" ")}`.toLowerCase();
        if (!term.split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      if (loc && !p.location.toLowerCase().includes(loc)) return false;
      if (type && p.propertyType !== type) return false;
      if (purpose && p.purpose !== purpose) return false;
      if (bandDef && !(p.price != null && p.price >= bandDef.min && p.price < bandDef.max)) return false;
      return true;
    });
    const priceKey = (p: Property, empty: number) => (p.price == null ? empty : p.price);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => priceKey(a, Infinity) - priceKey(b, Infinity));
      case "price-desc":
        return [...list].sort((a, b) => priceKey(b, -1) - priceKey(a, -1));
      case "area-desc":
        return [...list].sort((a, b) => areaInSqFt(b.areaValue, b.areaUnit) - areaInSqFt(a.areaValue, a.areaUnit));
      default:
        return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
  }, [properties, q, location, type, purpose, band, sort]);

  const active = Boolean(q || location || type || purpose || band);
  function reset() {
    setQ("");
    setLocation("");
    setType("");
    setPurpose("");
    setBand("");
  }

  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-2xl border border-sand bg-white p-10 text-center">
        <h2 className="font-display text-4xl">Our current listings are shared on request</h2>
        <p className="mt-4 leading-relaxed text-stone">
          We are updating our online catalogue. In the meantime, tell us what you are looking for — plot, builder floor or flat, to buy or rent — and we will share matching options directly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">Tell us your requirement</Link>
          <a href="tel:+919891707020" className="btn btn-outline">Call 98917 07020</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative z-10 -mt-12 border border-sand bg-white p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] md:p-7">
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            <label htmlFor="f-q" className="field-label">Search</label>
            <Search size={18} className="pointer-events-none absolute bottom-3.5 left-4 text-stone" aria-hidden />
            <input
              id="f-q"
              type="search"
              className="field !pl-11"
              placeholder="Search by title, location or feature"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline !min-h-12 lg:hidden"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={16} aria-hidden /> Filters
          </button>
        </div>

        <div id="filter-panel" className={`${showFilters ? "grid" : "hidden"} mt-5 gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-5`}>
          <div>
            <label htmlFor="f-purpose" className="field-label">Buy / Rent</label>
            <select id="f-purpose" className="field" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="">Any</option>
              <option value="Sale">For sale</option>
              <option value="Rent">For rent</option>
            </select>
          </div>
          <div>
            <label htmlFor="f-type" className="field-label">Property type</label>
            <select id="f-type" className="field" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-loc" className="field-label">Location</label>
            <select id="f-loc" className="field" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All locations</option>
              {(location && !locations.includes(location) ? [location, ...locations] : locations).map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-price" className="field-label">Price</label>
            <select id="f-price" className="field" value={band} onChange={(e) => setBand(e.target.value)} disabled={bands.length === 0}>
              <option value="">{bands.length ? "Any price" : "No priced listings"}</option>
              {bands.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-sort" className="field-label">Sort by</label>
            <select id="f-sort" className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="area-desc">Largest area</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4" aria-live="polite">
        <p className="text-sm text-stone">
          Showing <strong className="text-ink">{results.length}</strong> of {properties.length} {properties.length === 1 ? "property" : "properties"}
        </p>
        {active && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-crimson">
            <RotateCcw size={14} aria-hidden /> Reset filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <PropertyCard key={p.id} p={p} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-sand bg-white p-10 text-center">
          <h2 className="font-display text-3xl">No properties match these filters</h2>
          <p className="mt-3 text-stone">Try widening your search — or tell us what you need and we will look for it.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={reset} className="btn btn-outline">Reset filters</button>
            <Link href="/contact" className="btn btn-primary">Share your requirement</Link>
          </div>
        </div>
      )}
    </div>
  );
}
