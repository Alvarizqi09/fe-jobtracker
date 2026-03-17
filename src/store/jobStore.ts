"use client"

import { create } from 'zustand'
import type { Job, JobStatus, UpdateJobStatusDTO } from '@/types/job.types'

interface JobState {
  jobs: Job[]
  isLoading: boolean
  error: string | null
  setJobs: (jobs: Job[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  upsertJob: (job: Job) => void
  removeJob: (id: string) => void
  optimisticMove: (jobId: string, dto: UpdateJobStatusDTO) => { previousJobs: Job[] }
  revert: (previousJobs: Job[]) => void
  getByStatus: (status: JobStatus) => Job[]
}

function sortForBoard(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => {
    if (a.status !== b.status) return a.status.localeCompare(b.status)
    if (a.order !== b.order) return a.order - b.order
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  setJobs: (jobs) => set({ jobs: sortForBoard(jobs) }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  upsertJob: (job) =>
    set((state) => {
      const existingIdx = state.jobs.findIndex((j) => j._id === job._id)
      const next = [...state.jobs]
      if (existingIdx >= 0) next[existingIdx] = job
      else next.push(job)
      return { jobs: sortForBoard(next) }
    }),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((j) => j._id !== id) })),
  optimisticMove: (jobId, dto) => {
    const previousJobs = get().jobs
    const job = previousJobs.find((j) => j._id === jobId)
    if (!job) return { previousJobs }

    const next = previousJobs.map((j) =>
      j._id === jobId ? { ...j, status: dto.status, order: dto.order } : j
    )

    set({ jobs: sortForBoard(next) })
    return { previousJobs }
  },
  revert: (previousJobs) => set({ jobs: previousJobs }),
  getByStatus: (status) => get().jobs.filter((j) => j.status === status).sort((a, b) => a.order - b.order),
}))

