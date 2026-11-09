"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MessageCircle, Phone, Trash2 } from "lucide-react";
import type { Inquiry, Property } from "@/db/schema";
import { PROPERTY_TYPES, PURPOSES, STATUSES } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (data.ok) router.refresh();
    else setErr(data.error || "Login failed.");
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md border border-sand bg-white p-8">
      <h1 className="font-display text-3xl">Staff login</h1>
      <p className="mt-2 text-sm text-stone">Manage property listings and view customer enquiries.</p>
      <label htmlFor="adm-pw" className="field-label mt-6">Password</label>
      <input id="adm-pw" type="password" className="field" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
      {err && <p className="field-error" role="alert">{err}</p>}
      <button className="btn btn-dark mt-6 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

const blank = {
  title: "", location: "", propertyType: PROPERTY_TYPES[0] as string, purpose: "Sale", status: "Available", price: "",
  areaValue: "", areaUnit: "sq yd", bedrooms: "", bathrooms: "", description: "", amenities: "", featured: false,
};

export function AdminDashboard({ properties, inquiries }: { properties: Property[]; inquiries: Inquiry[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "listings" | "add">("leads");
  const [form, setForm] = useState(blank);
  const [images, setImages] = useState<string[]>([]);
  const [floorPlan, setFloorPlan] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof blank, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function upload(files: FileList | null, single: boolean) {
    if (!files?.length) return;
    setBusy(true);
    setMsg(null);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (data.ok) urls.push(data.url);
      else setMsg({ ok: false, text: `${file.name}: ${data.error || "upload failed"}` });
    }
    if (single) setFloorPlan(urls[0] ?? "");
    else setImages((prev) => [...prev, ...urls]);
    setBusy(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean), images, floorPlanUrl: floorPlan || null }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (data.ok) {
      setMsg({ ok: true, text: "Property published." });
      setForm(blank);
      setImages([]);
      setFloorPlan("");
      setTab("listings");
      router.refresh();
    } else setMsg({ ok: false, text: data.error || "Could not save." });
  }

  async function patch(id: number, body: object) {
    await fetch(`/api/admin/properties/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    router.refresh();
  }
  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    router.refresh();
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const tabBtn = (id: typeof tab, label: string) => (
    <button type="button" onClick={() => setTab(id)} aria-pressed={tab === id} className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${tab === id ? "bg-ink text-white" : "bg-white hover:bg-sand"}`}>
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Dashboard</h1>
        <button type="button" onClick={logout} className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson">Sign out</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-px bg-sand">
        {tabBtn("leads", `Enquiries (${inquiries.length})`)}
        {tabBtn("listings", `Listings (${properties.length})`)}
        {tabBtn("add", "Add property")}
      </div>
      {msg && <p role="status" className={`mt-4 text-sm ${msg.ok ? "text-[#1f8f4e]" : "text-crimson"}`}>{msg.text}</p>}

      {tab === "leads" && (
        <div className="mt-6 space-y-3">
          {inquiries.length === 0 && <p className="border border-sand bg-white p-8 text-stone">No enquiries yet. New submissions from the website appear here.</p>}
          {inquiries.map((q) => (
            <article key={q.id} className="border border-sand bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{q.name}</h2>
                  <p className="text-xs text-stone">{new Date(q.createdAt).toLocaleString("en-IN")} · {q.source === "property" ? "Property enquiry" : "Contact form"}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${q.phone}`} className="btn btn-dark !min-h-10 !px-4"><Phone size={14} aria-hidden /> {q.phone}</a>
                  <a href={`https://wa.me/${q.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !min-h-10 !px-4" aria-label={`WhatsApp ${q.name}`}><MessageCircle size={14} aria-hidden /></a>
                </div>
              </div>
              <dl className="mt-3 grid gap-1 text-sm">
                {q.propertyTitle && <div><dt className="inline text-stone">Property: </dt><dd className="inline font-semibold">{q.propertyTitle}</dd></div>}
                {q.interest && <div><dt className="inline text-stone">Interest: </dt><dd className="inline">{q.interest}</dd></div>}
                {q.email && <div><dt className="inline text-stone">Email: </dt><dd className="inline"><a className="underline" href={`mailto:${q.email}`}>{q.email}</a></dd></div>}
              </dl>
              {q.message && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{q.message}</p>}
            </article>
          ))}
        </div>
      )}

      {tab === "listings" && (
        <div className="mt-6 space-y-3">
          {properties.length === 0 && <p className="border border-sand bg-white p-8 text-stone">No listings yet. Use “Add property” to publish your first one — it appears on the website instantly.</p>}
          {properties.map((p) => (
            <article key={p.id} className="flex flex-col gap-4 border border-sand bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <Link href={`/properties/${p.slug}`} className="text-lg font-semibold hover:text-crimson">{p.title}</Link>
                <p className="text-sm text-stone">{p.location} · {p.propertyType} · For {p.purpose} · {formatPrice(p.price)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="sr-only" htmlFor={`st-${p.id}`}>Status</label>
                <select id={`st-${p.id}`} className="field !min-h-10 !w-auto !py-1" value={p.status} onChange={(e) => patch(p.id, { status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.featured} onChange={(e) => patch(p.id, { featured: e.target.checked })} /> Featured</label>
                <button type="button" onClick={() => remove(p.id, p.title)} className="grid h-10 w-10 place-items-center border border-crimson text-crimson hover:bg-crimson hover:text-white" aria-label={`Delete ${p.title}`}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={save} className="mt-6 grid gap-5 border border-sand bg-white p-6 md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="a-title">Title *</label>
            <input id="a-title" className="field" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="a-loc">Location *</label>
            <input id="a-loc" className="field" required placeholder="e.g. DLF Phase 3" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="a-type">Property type *</label>
            <select id="a-type" className="field" value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>{PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="field-label" htmlFor="a-purpose">Listed for *</label>
            <select id="a-purpose" className="field" value={form.purpose} onChange={(e) => set("purpose", e.target.value)}>{PURPOSES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="field-label" htmlFor="a-status">Status *</label>
            <select id="a-status" className="field" value={form.status} onChange={(e) => set("status", e.target.value)}>{STATUSES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="field-label" htmlFor="a-price">Price in ₹ (leave blank for “Price on request”)</label>
            <input id="a-price" type="number" min="0" className="field" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="a-area">Area</label>
              <input id="a-area" type="number" min="0" step="any" className="field" value={form.areaValue} onChange={(e) => set("areaValue", e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="a-unit">Unit</label>
              <select id="a-unit" className="field" value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value)}><option>sq yd</option><option>sq ft</option><option>sq m</option></select>
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="a-bed">Bedrooms</label>
            <input id="a-bed" type="number" min="0" className="field" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="a-bath">Bathrooms</label>
            <input id="a-bath" type="number" min="0" className="field" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="a-desc">Description</label>
            <textarea id="a-desc" rows={5} className="field" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="a-am">Amenities (comma separated)</label>
            <input id="a-am" className="field" placeholder="Corner plot, Park facing, Gated colony" value={form.amenities} onChange={(e) => set("amenities", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="a-img">Photos (first photo is the cover)</label>
            <input id="a-img" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(e) => { upload(e.target.files, false); e.target.value = ""; }} className="block w-full text-sm" />
            {images.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-3">
                {images.map((u, i) => (
                  <li key={u} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt={`Uploaded photo ${i + 1}`} className="h-20 w-28 object-cover" />
                    <button type="button" onClick={() => setImages((a) => a.filter((x) => x !== u))} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-crimson text-xs text-white" aria-label={`Remove photo ${i + 1}`}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="a-fp">Floor plan (optional)</label>
            <input id="a-fp" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { upload(e.target.files, true); e.target.value = ""; }} className="block w-full text-sm" />
            {floorPlan && <p className="mt-2 text-sm text-[#1f8f4e]">Floor plan uploaded.</p>}
          </div>
          <label className="flex items-center gap-3 text-sm md:col-span-2"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Show as featured on the home page</label>
          <div className="md:col-span-2">
            <button className="btn btn-primary" disabled={busy}>{busy ? "Working…" : "Publish property"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
