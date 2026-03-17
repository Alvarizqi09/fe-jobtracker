export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
export type JobPriority = 'low' | 'medium' | 'high'

export interface Job {
  _id: string
  userId: string
  company: string
  position: string
  status: JobStatus
  priority: JobPriority
  salary?: string
  location?: string
  jobUrl?: string
  notes?: string
  appliedDate?: string
  deadline?: string
  tags?: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateJobDTO {
  company: string
  position: string
  status: JobStatus
  priority: JobPriority
  salary?: string
  location?: string
  jobUrl?: string
  notes?: string
  appliedDate?: string
  deadline?: string
  tags?: string[]
}

export interface UpdateJobStatusDTO {
  status: JobStatus
  order: number
}

export interface KanbanColumn {
  id: JobStatus
  title: string
  color: string
  jobs: Job[]
}

