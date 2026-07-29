'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function AdminAuthForm({ mode }: { mode: 'sign-in' | 'setup' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSetup = mode === 'setup'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isSetup) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name || 'Angi Scott',
        })
        if (error) {
          setError(error.message ?? 'Could not create account.')
          setLoading(false)
          return
        }
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) {
          setError(error.message ?? 'Invalid email or password.')
          setLoading(false)
          return
        }
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {isSetup && (
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Angi Scott"
            className="border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSetup ? 'At least 8 characters' : '••••••••'}
          className="border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={loading} className="mt-2">
        {loading
          ? 'Please wait…'
          : isSetup
            ? 'Create my account'
            : 'Sign in'}
      </Button>
    </form>
  )
}
