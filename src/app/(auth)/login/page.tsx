"use client"

import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import toast from 'react-hot-toast'
import { Copy, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

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

function checkInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ''
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android',
    'FBAN/FBIOS',
    'FB_IAB/FB4A',
    'Instagram',
    'Line',
  ]
  const regex = new RegExp(`(${rules.join('|')})`, 'ig')
  return Boolean(ua.match(regex))
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isInApp, setIsInApp] = useState(false)
  
  // Email/Password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsInApp(checkInAppBrowser())
  }, [])

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return toast.error('Firebase is not initialized')
    if (!email || !password) return toast.error('Please enter email and password')
    
    setLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push('/board')
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    // Remove trailing slash if present
    const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
    // Try to remove /api if present, since our route goes to /api/auth
    const baseUrl = cleanUrl.endsWith('/api') ? cleanUrl.slice(0, -4) : cleanUrl
    window.location.href = `${baseUrl}/api/auth/google/login`
  }

  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied! Open it in Chrome or Safari.')
    }
  }

  return (
    <div ref={bgRef} className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6 py-12">
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

      <Card className="login-card relative w-full max-w-md border-border bg-[rgba(17,24,39,0.55)] backdrop-blur-xl shadow-[0_0_0_1px_rgba(45,64,96,0.35),0_30px_80px_rgba(0,0,0,0.55)] z-10">
        <div className="p-6">
          <div className="font-syne text-3xl tracking-tight text-(--text-primary)">
            Job<span className="text-(--accent-cyan)">Deck</span>
          </div>
          <div className="mt-2 text-sm text-(--text-secondary)">
            Track every opportunity. Land your dream role.
          </div>

          <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1.5 block">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-(--bg-secondary) p-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-cyan) focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1.5 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-(--bg-secondary) p-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-cyan) focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-(--accent-cyan) text-black hover:opacity-90 mt-2 h-10"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-(--text-secondary) hover:text-(--accent-cyan) transition-colors"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="my-5 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-(--text-muted) uppercase tracking-wider font-semibold">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {isInApp ? (
            <div className="p-4 rounded-xl border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] text-amber-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold block mb-1">In-App Browser Detected</span>
                  Google Login may block Instagram/Facebook browsers. Please tap the <span className="font-bold">... (Options)</span> button top right and select <span className="font-bold">Open in external browser</span>, or log in with Email/Password.
                  <Button 
                    variant="outline" 
                    type="button"
                    className="mt-3 w-full border-[rgba(245,158,11,0.5)] text-amber-500 hover:bg-[rgba(245,158,11,0.1)] hover:text-amber-400 h-9"
                    onClick={copyUrl}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" /> Copy Link
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              type="button"
              className="w-full border-border bg-transparent text-(--text-primary) hover:bg-(--bg-hover) h-10"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span className="mr-2 inline-flex items-center">
                <GoogleIcon />
              </span>
              Continue with Google
            </Button>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)]">
            <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[11px] tracking-wide text-emerald-400/90">Data kamu aman & terenkripsi 🔒</span>
          </div>
        </div>
      </Card>
    </div>
  )
}



