"use client"

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithCustomToken } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '@/lib/firebase'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setError('Authentication failed: Missing token.')
      setTimeout(() => router.push('/login'), 3000)
      return
    }

    if (!auth) {
      setError('Firebase is not initialized.')
      return
    }

    signInWithCustomToken(auth, token)
      .then(() => {
        toast.success('Successfully logged in!')
        router.push('/board')
      })
      .catch((err) => {
        console.error('Failed to sign in with custom token', err)
        setError('Authentication failed: Invalid or expired token.')
        setTimeout(() => router.push('/login'), 3000)
      })
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6">
        <div className="text-center p-6 max-w-sm w-full rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-red-500">
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs mt-2 text-red-400 opacity-80">Redirecting back to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--accent-cyan) border-r-transparent align-[-0.125em] text-(--accent-cyan) motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-4 text-sm text-(--text-secondary) animate-pulse">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--accent-cyan) border-r-transparent align-[-0.125em] text-(--accent-cyan) motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" />
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
