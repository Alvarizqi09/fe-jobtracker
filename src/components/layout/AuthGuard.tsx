"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.replace('/login')
    }
  }, [isLoading, pathname, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-10 w-2/3 bg-(--bg-card)" />
          <Skeleton className="h-4 w-full bg-(--bg-card)" />
          <Skeleton className="h-4 w-5/6 bg-(--bg-card)" />
          <Skeleton className="h-32 w-full bg-(--bg-card)" />
        </div>
      </div>
    )
  }

  if (!user) return null
  return children
}

