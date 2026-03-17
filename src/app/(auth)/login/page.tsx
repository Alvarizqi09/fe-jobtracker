"use client"

import { useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signInWithGoogle } from '@/lib/firebase'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.51 32.657 29.122 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.35 4.342-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.1 0-9.475-3.318-11.285-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.87 2.46-2.546 4.492-4.694 5.57l.003-.002 6.19 5.238C36.369 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!bgRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.login-card',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      )
      gsap.to('.grid-glow', { opacity: 0.22, duration: 1.2, ease: 'power2.out' })
    }, bgRef)
    return () => ctx.revert()
  }, [])

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true)
    try {
      await signInWithGoogle()
      router.push('/board')
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={bgRef} className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="grid-glow absolute -inset-40 opacity-0"
          style={{
            background:
              'radial-gradient(800px circle at 30% 20%, rgba(0,212,255,0.18), transparent 45%), radial-gradient(900px circle at 80% 35%, rgba(79,142,247,0.14), transparent 55%)',
            filter: 'blur(0px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(30,45,64,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,45,64,0.35) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(60% 60% at 50% 40%, black 45%, transparent 70%)',
          }}
        />
      </div>

      <Card className="login-card relative w-full max-w-md border-border bg-[rgba(17,24,39,0.55)] backdrop-blur-xl shadow-[0_0_0_1px_rgba(45,64,96,0.35),0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="p-6">
          <div className="font-syne text-3xl tracking-tight text-(--text-primary)">
            Job<span className="text-(--accent-cyan)">Deck</span>
          </div>
          <div className="mt-2 text-sm text-(--text-secondary)">
            Track every opportunity. Land your dream role.
          </div>

          <Button
            className="mt-6 w-full bg-(--accent-cyan) text-black hover:opacity-90"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="mr-2 inline-flex items-center">
              <GoogleIcon />
            </span>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </Button>

          <div className="mt-5 text-xs text-(--text-secondary)">
            By continuing, you agree to store your job tracking data in your private workspace.
          </div>
        </div>
      </Card>
    </div>
  )
}

