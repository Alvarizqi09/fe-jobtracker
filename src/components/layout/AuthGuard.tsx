"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { GlobalLoader } from '@/components/ui/GlobalLoader'

let hasInitialDelayPassed = false

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [minDelayPassed, setMinDelayPassed] = useState(hasInitialDelayPassed)

  useEffect(() => {
    if (hasInitialDelayPassed) return
    const timer = setTimeout(() => {
      hasInitialDelayPassed = true
      setMinDelayPassed(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && minDelayPassed && !user && pathname !== '/login') {
      router.replace('/login')
    }
  }, [isLoading, minDelayPassed, pathname, router, user])

  if (isLoading || !minDelayPassed) {
    return <GlobalLoader />
  }

  if (!user) return null
  return children
}

