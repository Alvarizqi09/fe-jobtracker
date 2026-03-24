"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { GlobalLoader } from '@/components/ui/GlobalLoader'
import { useInitialLoader } from '@/hooks/useInitialLoader'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const minDelayPassed = useInitialLoader()

  useEffect(() => {
    if (isLoading || !minDelayPassed) return
    router.replace(user ? '/board' : '/login')
  }, [isLoading, minDelayPassed, router, user])

  return <GlobalLoader />
}
