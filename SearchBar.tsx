import { Search } from "lucide-react";
import { AREAS, PROPERTY_TYPES } from "@/lib/site";

/** Hero search — a plain GET form, so it works without JavaScript. Opens /properties with filters applied. */
export function SearchBar() {
  const fieldCls =
    "h-12 w-full appearance-none border-0 bg-transparent px-0 text-[0.95rem] font-medium text-ink focus:outline-none focus:ring-0";
  const wrap = "flex flex-col justify-center border-b border-sand px-5 py-2 lg:border-b-0 lg:border-r";
  const lab = "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-crimson";
  return (
    <form
      action="/properties"
      method="get"
      role="search"
      aria-label="Search properties"
      className="grid w-full max-w-5xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
    >
      <div className={wrap}>
        <label htmlFor="s-purpose" className={lab}>I want to</label>
        <select id="s-purpose" name="purpose" className={fieldCls} defaultValue="">
          <option value="">Buy or rent</option>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </div>
      <div className={wrap}>
        <label htmlFor="s-type" className={lab}>Property type</label>
        <select id="s-type" name="type" className={fieldCls} defaultValue="">
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className={wrap}>
        <label htmlFor="s-loc" className={lab}>Location</label>
        <select id="s-loc" name="location" className={fieldCls} defaultValue="">
          <option value="">All of Gurugram</option>
          {AREAS.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
      </div>
      <div className={wrap}>
        <label htmlFor="s-q" className={lab}>Keyword</label>
        <input id="s-q" name="q" type="search" placeholder="Plot, corner, park-facing…" className={fieldCls} />
      </div>
      <button type="submit" className="btn btn-primary !min-h-14 lg:!px-9">
        <Search size={18} aria-hidden /> Search
      </button>
    </form>
  );
}
