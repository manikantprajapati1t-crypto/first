import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { properties, type Property } from "@/db/schema";

export type { Property };

export async function getAllProperties(): Promise<Property[]> {
  try {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  } catch (e) {
    console.error("getAllProperties failed", e);
    return [];
  }
}

export async function getProperty(slug: string): Promise<Property | null> {
  try {
    const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch (e) {
    console.error("getProperty failed", e);
    return null;
  }
}
