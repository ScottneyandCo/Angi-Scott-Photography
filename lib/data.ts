import { db } from '@/lib/db'
import { photos, siteContent } from '@/lib/db/schema'
import { asc, desc, eq } from 'drizzle-orm'
import { CONTENT_DEFAULTS, type ContentMap } from '@/lib/content-defaults'
import { categoryLabel } from '@/lib/categories'
import { photos as STATIC_PHOTOS } from '@/lib/photos'

export type Photo = typeof photos.$inferSelect

// Shape the public gallery/home components render.
export type DisplayPhoto = {
  src: string
  alt: string
  category: string // display label
}

function toDisplay(rows: Photo[]): DisplayPhoto[] {
  return rows.map((r) => ({
    src: r.url,
    alt: r.title ?? `${categoryLabel(r.category)} photograph`,
    category: categoryLabel(r.category),
  }))
}

// Public gallery: DB photos if the admin has uploaded any, otherwise the
// curated starter set so the site never looks empty.
export async function getDisplayPhotos(): Promise<DisplayPhoto[]> {
  const rows = await getPhotos()
  if (rows.length > 0) return toDisplay(rows)
  return STATIC_PHOTOS.map((p) => ({
    src: p.src,
    alt: p.alt,
    category: p.category,
  }))
}

// Homepage featured: DB-featured photos, else first 6 DB photos, else starter set.
export async function getFeaturedDisplay(): Promise<DisplayPhoto[]> {
  const featured = await getFeaturedPhotos()
  if (featured.length > 0) return toDisplay(featured).slice(0, 6)
  const all = await getPhotos()
  if (all.length > 0) return toDisplay(all).slice(0, 6)
  return STATIC_PHOTOS.slice(0, 6).map((p) => ({
    src: p.src,
    alt: p.alt,
    category: p.category,
  }))
}

// Public: all gallery photos, ordered by sortOrder then newest.
export async function getPhotos(): Promise<Photo[]> {
  try {
    return await db
      .select()
      .from(photos)
      .orderBy(asc(photos.sortOrder), desc(photos.createdAt))
  } catch (e) {
    console.log('[v0] getPhotos error:', (e as Error).message)
    return []
  }
}

// Public: featured photos for the homepage.
export async function getFeaturedPhotos(): Promise<Photo[]> {
  try {
    const rows = await db
      .select()
      .from(photos)
      .where(eq(photos.featured, true))
      .orderBy(asc(photos.sortOrder), desc(photos.createdAt))
    return rows
  } catch (e) {
    console.log('[v0] getFeaturedPhotos error:', (e as Error).message)
    return []
  }
}

// Public: merged site content (DB overrides on top of defaults).
export async function getContent(): Promise<ContentMap> {
  const merged: ContentMap = { ...CONTENT_DEFAULTS }
  try {
    const rows = await db.select().from(siteContent)
    for (const row of rows) {
      if (row.value && row.value.length > 0) merged[row.key] = row.value
    }
  } catch (e) {
    console.log('[v0] getContent error:', (e as Error).message)
  }
  return merged
}
