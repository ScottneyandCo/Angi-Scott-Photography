import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/admin'
import { getPhotos, getContent } from '@/lib/data'
import { getInquiries } from '@/app/actions/admin'
import { AdminShell } from '@/components/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/admin/login')

  const [photos, content, inquiries] = await Promise.all([
    getPhotos(),
    getContent(),
    getInquiries(),
  ])

  return (
    <AdminShell
      photos={photos}
      content={content}
      inquiries={inquiries}
      name={sessionUser.name || 'Angi'}
    />
  )
}
