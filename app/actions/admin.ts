'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { photos, siteContent, inquiries } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { put, del } from '@vercel/blob'

// Single-admin gate: any valid session may manage site content.
async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/gallery')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin')
}

export async function uploadPhoto(formData: FormData) {
  const userId = await requireUserId()
  const file = formData.get('file') as File | null
  const category = (formData.get('category') as string) || 'lifestyle'
  const title = (formData.get('title') as string) || null

  if (!file || file.size === 0) {
    return { error: 'Please choose an image to upload.' }
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Only image files are allowed.' }
  }

  try {
    const blob = await put(`gallery/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    await db.insert(photos).values({
      userId,
      url: blob.url,
      title,
      category,
    })

    revalidatePublic()
    return { success: true }
  } catch (e) {
    console.log('[v0] uploadPhoto error:', (e as Error).message)
    return { error: 'Upload failed. Please try again.' }
  }
}

export async function deletePhoto(id: number) {
  await requireUserId()
  try {
    const [row] = await db.select().from(photos).where(eq(photos.id, id))
    if (row) {
      // Best-effort blob cleanup; ignore failures.
      try {
        await del(row.url)
      } catch (e) {
        console.log('[v0] blob del error:', (e as Error).message)
      }
      await db.delete(photos).where(eq(photos.id, id))
    }
    revalidatePublic()
    return { success: true }
  } catch (e) {
    console.log('[v0] deletePhoto error:', (e as Error).message)
    return { error: 'Could not delete photo.' }
  }
}

export async function toggleFeatured(id: number, featured: boolean) {
  await requireUserId()
  try {
    await db.update(photos).set({ featured }).where(eq(photos.id, id))
    revalidatePublic()
    return { success: true }
  } catch (e) {
    console.log('[v0] toggleFeatured error:', (e as Error).message)
    return { error: 'Could not update photo.' }
  }
}

export async function updatePhotoMeta(
  id: number,
  data: { title?: string; category?: string },
) {
  await requireUserId()
  try {
    await db.update(photos).set(data).where(eq(photos.id, id))
    revalidatePublic()
    return { success: true }
  } catch (e) {
    console.log('[v0] updatePhotoMeta error:', (e as Error).message)
    return { error: 'Could not update photo.' }
  }
}

// --- Inquiries (contact form submissions) ----------------------------------

export async function getInquiries() {
  await requireUserId()
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt))
}

export async function markInquiryRead(id: number, read: boolean) {
  await requireUserId()
  try {
    await db.update(inquiries).set({ read }).where(eq(inquiries.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.log('[v0] markInquiryRead error:', (e as Error).message)
    return { error: 'Could not update inquiry.' }
  }
}

export async function deleteInquiry(id: number) {
  await requireUserId()
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.log('[v0] deleteInquiry error:', (e as Error).message)
    return { error: 'Could not delete inquiry.' }
  }
}

export async function saveContent(formData: FormData) {
  const userId = await requireUserId()
  try {
    const entries = Array.from(formData.entries()).filter(
      ([k]) => k !== '$ACTION_ID',
    ) as [string, string][]

    for (const [key, value] of entries) {
      const existing = await db
        .select()
        .from(siteContent)
        .where(and(eq(siteContent.userId, userId), eq(siteContent.key, key)))

      if (existing.length > 0) {
        await db
          .update(siteContent)
          .set({ value, updatedAt: new Date() })
          .where(and(eq(siteContent.userId, userId), eq(siteContent.key, key)))
      } else {
        await db.insert(siteContent).values({ userId, key, value })
      }
    }

    revalidatePublic()
    return { success: true }
  } catch (e) {
    console.log('[v0] saveContent error:', (e as Error).message)
    return { error: 'Could not save changes.' }
  }
}
