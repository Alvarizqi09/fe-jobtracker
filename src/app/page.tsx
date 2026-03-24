"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { GlobalLoader } from '@/components/ui/GlobalLoader'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    router.replace(user ? '/board' : '/login')
  }, [isLoading, router, user])

  return <GlobalLoader />
}
