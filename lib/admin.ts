import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { sql } from 'drizzle-orm'
import { headers } from 'next/headers'

// Has an admin account been created yet?
export async function adminExists(): Promise<boolean> {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
    return (row?.count ?? 0) > 0
  } catch {
    return false
  }
}

// Current logged-in session user, or null.
export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user ?? null
  } catch {
    return null
  }
}
