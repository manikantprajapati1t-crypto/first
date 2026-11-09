/**
 * Single source of truth for verified business information.
 * Source: the client's Google Business Profile screenshots (name, address, phones,
 * services, rating, review count, hours) and the photographs of the office signage.
 * Nothing here is invented — if it is not in the source material, it is not on the site.
 */
export const SITE = {
  name: "Golf Course Property",
  fullName: "Golf Course Property : Property Dealer Sector 43 Gurgaon",
  hindiName: "गोल्फ कोर्स प्रोपर्टीज़",
  tagline: "Plots, Floors & Flats — Buy | Sell | Rent",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phones: [
    { display: "98917 07020", tel: "+919891707020" },
    { display: "92203 74545", tel: "+919220374545" },
  ],
  /** WhatsApp number (primary listed mobile, India country code 91). */
  whatsapp: "919891707020",
  address: {
    street: "Basement, Plot No. 882, Golf Course Road, Sector 43",
    city: "Gurugram",
    region: "Haryana",
    postal: "122009",
    country: "IN",
  },
  rating: 5.0,
  reviewCount: 80,
  hours: "Open 24 hours",
  hoursNote: "As listed on Google. Hours may differ on public holidays.",
} as const;

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}`;
export const MAPS_QUERY = `Golf Course Property, ${FULL_ADDRESS}`;
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&output=embed`;

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Areas named on the office signage ("DLF, Sushant Lok, HUDA Sector") and the business address. */
export const AREAS = [
  { name: "DLF", blurb: "Established DLF phases and their builder-floor neighbourhoods." },
  { name: "Sushant Lok", blurb: "Sought-after residential plots, floors and homes." },
  { name: "HUDA Sectors", blurb: "HUDA-sector plots, floors and flats across Gurugram." },
  { name: "Golf Course Road", blurb: "Our home address — Sector 43, Golf Course Road." },
] as const;

export const PROPERTY_TYPES = ["Plot", "Builder Floor", "Flat", "House / Villa", "Commercial"] as const;
export const PURPOSES = ["Sale", "Rent"] as const;
export const STATUSES = ["Available", "Under Offer", "Sold", "Rented"] as const;

/** Genuine Google reviews, quoted verbatim from the client's review screenshots. */
export const REVIEWS = [
  {
    name: "Rihan Khan",
    text: "Quick response, transparent dealings, and smooth paperwork. Property dealer in sector 43 gurgaon. Would definitely recommend their services.",
  },
  {
    name: "Dimple Love",
    text: "Property dealer in sector 43 gurgaon, golf course property provided outstanding service and I'm very satisfied with the sale of my plot.",
  },
  {
    name: "piyush mathur",
    text: "Property dealer in sector 43 gurgaon, we have always benefited from all the properties he has advised, be it for rent or buy-sell, we are very gratefull to them.",
  },
  {
    name: "Deepak Tyagi",
    text: "Property dealer in sector 43 gurgaon, very good plots purchased less than market price",
  },
  {
    name: "Durga Devi",
    text: "Best property dealer sector 43 Gurgaon, had wonderful experience while buying property through them",
  },
] as const;

export const SERVICES = [
  {
    slug: "plots-land",
    icon: "land",
    title: "Land & Plot Buying and Sales",
    short: "Residential plots and land, bought and sold with clear documentation.",
    body: "Plots are the heart of what we do. Whether you are buying a plot to build your own home or selling one you own, we help you assess the location, understand the paperwork and negotiate towards a fair price.",
    points: ["Residential plot buying", "Plot selling and buyer matching", "Paperwork guidance from start to finish", "Local price awareness"],
  },
  {
    slug: "floors-flats",
    icon: "building",
    title: "Builder Floors & Flats",
    short: "Floors and flats to buy or sell across DLF, Sushant Lok and HUDA sectors.",
    body: "From independent builder floors to apartments, we shortlist options that suit your family, your budget and your preferred neighbourhood — and arrange viewings on your schedule.",
    points: ["Builder floors and flats", "Shortlisting around your budget", "Site visits arranged with you", "Support through closing"],
  },
  {
    slug: "luxury",
    icon: "gem",
    title: "Luxury Property Buying & Sales",
    short: "Premium homes and plots in prime Gurugram locations.",
    body: "Our luxury property service is built around discretion and attention to detail. We understand premium locations, and we handle every enquiry with the care a significant purchase or sale deserves.",
    points: ["Luxury properties", "Premium-location plots", "Discreet, personal handling", "Honest guidance on value"],
  },
  {
    slug: "rentals",
    icon: "key",
    title: "Rental Properties",
    short: "Houses, floors and flats for rent, for owners and tenants alike.",
    body: "Looking to rent a home or let out your property? We connect owners with suitable tenants and tenants with the right home, keeping the process quick and transparent.",
    points: ["Properties for rent", "Tenant matching for owners", "Quick response", "Clear terms"],
  },
  {
    slug: "consultation",
    icon: "compass",
    title: "Property Consultation",
    short: "Straightforward advice from a local real estate consultant.",
    body: "Not sure whether to buy, sell or rent? Speak with us. We will talk through your goals, the market in your area and the options in front of you — no pressure.",
    points: ["Buy, sell or rent advice", "Area and locality guidance", "Walk-in or phone consultation", "Open 24 hours as listed on Google"],
  },
] as const;
