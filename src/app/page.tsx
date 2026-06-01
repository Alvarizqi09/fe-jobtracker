"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import LandingPage from '@/components/landing/LandingPage'
import '../app/landing.css'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // If user is already logged in, redirect to board
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/board')
    }
  }, [isLoading, user, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="font-syne text-2xl text-[var(--text-primary)] animate-pulse">
          Hunt<span className="text-[var(--accent-cyan)]">rrr</span>
        </div>
      </div>
    )
  }

  // If not logged in, show the landing page
  if (!user) {
    return <LandingPage />
  }

  // Fallback while redirecting
  return null
}
