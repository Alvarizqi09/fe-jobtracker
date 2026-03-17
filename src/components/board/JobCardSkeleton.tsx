"use client"

import { Skeleton } from '@/components/ui/skeleton'

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-(--bg-card) p-4">
      <Skeleton className="h-5 w-2/3 bg-(--bg-hover)" />
      <Skeleton className="mt-2 h-4 w-1/2 bg-(--bg-hover)" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-16 bg-(--bg-hover)" />
        <Skeleton className="h-5 w-20 bg-(--bg-hover)" />
      </div>
    </div>
  )
}

