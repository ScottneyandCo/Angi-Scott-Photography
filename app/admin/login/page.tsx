import Image from 'next/image'
import { redirect } from 'next/navigation'
import { adminExists, getSessionUser } from '@/lib/admin'
import { AdminAuthForm } from '@/components/admin/admin-auth-form'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const sessionUser = await getSessionUser()
  if (sessionUser) redirect('/admin')

  const exists = await adminExists()
  const mode = exists ? 'sign-in' : 'setup'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Mi Sueño by Angi Scott"
            width={90}
            height={90}
            className="mb-6"
          />
          <h1 className="font-serif text-3xl font-light text-foreground">
            {mode === 'setup' ? 'Welcome, Angi' : 'Studio Login'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mode === 'setup'
              ? 'Create your account to start managing your photos and website content. This one-time setup secures your private dashboard.'
              : 'Sign in to manage your gallery and website content.'}
          </p>
        </div>

        <div className="border border-border bg-card/40 p-8">
          <AdminAuthForm mode={mode} />
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {mode === 'setup'
            ? 'Keep your email and password somewhere safe.'
            : 'This area is private to the studio.'}
        </p>
      </div>
    </main>
  )
}
