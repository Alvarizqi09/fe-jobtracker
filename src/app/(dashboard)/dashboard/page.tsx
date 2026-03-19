"use client"

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/hooks/useJobs'
import { useJobStore } from '@/store/jobStore'
import type { Job } from '@/types/job.types'
import { AddJobModal } from '@/components/board/AddJobModal'
import { Pin, MessageSquare, Target, XCircle } from 'lucide-react'

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const numberRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!numberRef.current) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (!numberRef.current) return
        numberRef.current.textContent = Math.round(obj.val).toString()
      },
    })
  }, [value])

  return (
    <Card className="border-border bg-(--bg-card) p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-(--text-secondary)">{label}</div>
        <div className="h-9 w-9 rounded-xl border border-border bg-(--bg-secondary) flex items-center justify-center">
          <span>{icon}</span>
        </div>
      </div>
      <div ref={numberRef} className="mt-3 font-syne text-3xl text-(--text-primary)">
        0
      </div>
    </Card>
  )
}

function RecentJobs({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="border-border bg-(--bg-card) p-4">
      <div className="font-syne text-lg text-(--text-primary)">Recent</div>
      <div className="mt-3 space-y-3">
        {jobs.length === 0 ? (
          <div className="text-sm text-(--text-secondary)">No jobs yet.</div>
        ) : (
          jobs.map((j) => (
            <div key={j._id} className="rounded-xl border border-border bg-(--bg-secondary) p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-(--text-primary)">{j.company}</div>
                  <div className="truncate text-xs text-(--text-secondary)">{j.position}</div>
                </div>
                <div className="text-xs text-(--text-secondary) capitalize">{j.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { fetchJobs, createJob } = useJobs()
  const jobs = useJobStore((s) => s.jobs)
  const [addOpen, setAddOpen] = useState(false)

  useLayoutEffect(() => {
    fetchJobs().catch(() => {
      // handled in hook state
    })
  }, [fetchJobs])

  const stats = useMemo(() => {
    const total = jobs.length
    const interviews = jobs.filter((j) => j.status === 'interview').length
    const offers = jobs.filter((j) => j.status === 'offer').length
    const rejected = jobs.filter((j) => j.status === 'rejected').length
    const rejectionRate = total === 0 ? 0 : Math.round((rejected / total) * 100)
    return { total, interviews, offers, rejectionRate }
  }, [jobs])

  const recent = useMemo(() => [...jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5), [jobs])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="font-syne text-2xl text-(--text-primary) tracking-tight">Dashboard</div>
          <div className="text-sm text-(--text-secondary)">A quick read on your pipeline.</div>
        </div>
        <Button
          className="bg-(--accent-cyan) text-black hover:opacity-90"
          onClick={() => {
            setAddOpen(true)
          }}
        >
          Add New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats.total} icon={<Pin className="h-5 w-5" />} />
        <StatCard label="Active Interviews" value={stats.interviews} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard label="Offers Received" value={stats.offers} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Rejection Rate (%)" value={stats.rejectionRate} icon={<XCircle className="h-5 w-5" />} />
      </div>

      <RecentJobs jobs={recent} />

      <AddJobModal
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="create"
        initialStatus="wishlist"
        job={null}
        onCreate={async (dto) => {
          await createJob(dto)
        }}
        onUpdate={async () => {
          // not used in create mode
        }}
      />
    </div>
  )
}

