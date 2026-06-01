'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/admin/ui/Button'
import Input from '@/components/admin/ui/Input'
import Image from 'next/image'

const ADMIN_EMAIL = 'heyyabiola@gmail.com'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })

    if (authError) {
      setError('Incorrect password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/ruff-logo.svg"
            alt="The Ruff Agency"
            width={120}
            height={68}
            className="h-14 w-auto"
          />
        </div>

        <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-xl font-semibold text-[#1e1e23]">Admin</h1>
          <p className="mb-6 text-sm text-[#6b7280]">Enter your password to continue.</p>

          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />

            {error && (
              <div className="rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#9ca3af]">
          The Ruff Agency &copy; 2026. Admin access only.
        </p>
      </div>
    </div>
  )
}
