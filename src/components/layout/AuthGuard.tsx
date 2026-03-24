"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { GlobalLoader } from '@/components/ui/GlobalLoader'
import { useInitialLoader } from '@/hooks/useInitialLoader'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const minDelayPassed = useInitialLoader()

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

