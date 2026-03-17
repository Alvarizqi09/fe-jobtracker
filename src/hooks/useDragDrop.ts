"use client"

import { useCallback, useMemo, useState } from 'react'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { Job, JobStatus } from '@/types/job.types'
import { useJobStore } from '@/store/jobStore'

export interface DragState {
  activeJob: Job | null
  overColumnId: JobStatus | null
}

export function useDragDrop() {
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [overColumnId, setOverColumnId] = useState<JobStatus | null>(null)
  const jobs = useJobStore((s) => s.jobs)

  const findJob = useCallback(
    (id: string): Job | null => {
      const j = jobs.find((job) => job._id === id)
      return j ?? null
    },
    [jobs]
  )

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      setActiveJob(findJob(id))
    },
    [findJob]
  )

  const onDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id
    if (!overId) {
      setOverColumnId(null)
      return
    }
    const raw = String(overId)
    // Column droppable ids will be like "col:wishlist"
    if (raw.startsWith('col:')) {
      setOverColumnId(raw.replace('col:', '') as JobStatus)
    } else {
      // If hovering over a card, keep column highlight based on that card's status.
      const job = findJob(raw)
      setOverColumnId(job?.status ?? null)
    }
  }, [findJob])

  const onDragEnd = useCallback((_event: DragEndEvent) => {
    setActiveJob(null)
    setOverColumnId(null)
  }, [])

  const state: DragState = useMemo(() => ({ activeJob, overColumnId }), [activeJob, overColumnId])
  return { state, handlers: { onDragStart, onDragOver, onDragEnd } }
}

