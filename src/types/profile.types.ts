export interface WorkExperience {
  id: string                    // client-side uuid
  company: string
  role: string
  startDate: string             // YYYY-MM
  endDate?: string              // YYYY-MM
  isCurrent: boolean
  description: string           // text
  technologies?: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationYear: number
  gpa?: string
}

export interface UserProfile {
  headline: string
  summary: string
  phone?: string
  location: string
  linkedin?: string
  portfolio?: string
  github?: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: string[]
  achievements: string[]
  languages: string[]
}

export interface ProfileCompleteness {
  percentage: number
  missing: string[]
}
