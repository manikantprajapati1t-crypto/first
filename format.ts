export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Price on request";
  if (price >= 10_000_000) {
    const cr = price / 10_000_000;
    return `₹${trim(cr)} Cr`;
  }
  if (price >= 100_000) {
    const l = price / 100_000;
    return `₹${trim(l)} Lakh`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function trim(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

export function formatArea(value: number | null | undefined, unit: string): string | null {
  if (value == null) return null;
  return `${value.toLocaleString("en-IN")} ${unit}`;
}

/** Normalise to square feet so mixed units can be sorted together. */
export function areaInSqFt(value: number | null | undefined, unit: string): number {
  if (value == null) return 0;
  if (unit === "sq yd") return value * 9;
  if (unit === "sq m") return value * 10.7639;
  return value;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
