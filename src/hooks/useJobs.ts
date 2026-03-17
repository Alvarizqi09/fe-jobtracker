"use client"

import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useJobStore } from '@/store/jobStore'
import type { CreateJobDTO, Job, JobStatus, UpdateJobStatusDTO } from '@/types/job.types'

interface JobsResponse {
  jobs: Job[]
}

interface JobResponse {
  job: Job
}

export function useJobs() {
  const jobs = useJobStore((s) => s.jobs)
  const isLoading = useJobStore((s) => s.isLoading)
  const error = useJobStore((s) => s.error)
  const setJobs = useJobStore((s) => s.setJobs)
  const setLoading = useJobStore((s) => s.setLoading)
  const setError = useJobStore((s) => s.setError)
  const upsertJob = useJobStore((s) => s.upsertJob)
  const removeJob = useJobStore((s) => s.removeJob)

  const fetchJobs = useCallback(
    async (status?: JobStatus): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get<JobsResponse>('/jobs', { params: status ? { status } : undefined })
        setJobs(res.data.jobs)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    },
    [setError, setJobs, setLoading]
  )

  const createJob = useCallback(
    async (dto: CreateJobDTO): Promise<Job> => {
      const res = await api.post<JobResponse>('/jobs', dto)
      upsertJob(res.data.job)
      return res.data.job
    },
    [upsertJob]
  )

  const updateJob = useCallback(
    async (id: string, dto: Partial<CreateJobDTO>): Promise<Job> => {
      const res = await api.put<JobResponse>(`/jobs/${id}`, dto)
      upsertJob(res.data.job)
      return res.data.job
    },
    [upsertJob]
  )

  const updateJobStatus = useCallback(async (id: string, dto: UpdateJobStatusDTO): Promise<Job> => {
    const res = await api.patch<JobResponse>(`/jobs/${id}/status`, dto)
    upsertJob(res.data.job)
    return res.data.job
  }, [upsertJob])

  const deleteJob = useCallback(
    async (id: string): Promise<void> => {
      await api.delete(`/jobs/${id}`)
      removeJob(id)
    },
    [removeJob]
  )

  return {
    jobs,
    isLoading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob,
  }
}

