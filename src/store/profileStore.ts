import { create } from 'zustand'
import { UserProfile, ProfileCompleteness } from '../types/profile.types'

interface ProfileState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  updateField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void
}

const emptyProfile: UserProfile = {
  headline: '',
  summary: '',
  location: '',
  phone: '',
  linkedin: '',
  portfolio: '',
  github: '',
  workExperience: [],
  education: [],
  skills: [],
  achievements: [],
  languages: [],
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: emptyProfile,
  setProfile: (profile) => set({ profile: profile || emptyProfile }),
  updateField: (field, value) => set((state) => ({
    profile: state.profile ? { ...state.profile, [field]: value } : { ...emptyProfile, [field]: value }
  })),
}))

export const calculateCompleteness = (p: UserProfile | null): ProfileCompleteness => {
  const profile = p || emptyProfile
  let score = 0
  const missing: string[] = []

  if (profile.headline && profile.headline.trim().length > 0) score += 10
  else missing.push("Add a professional headline")

  if (profile.summary && profile.summary.trim().length > 20) score += 10
  else missing.push("Add a professional summary")

  if (profile.location && profile.location.trim().length > 0) score += 5
  else missing.push("Add your location")

  if (profile.workExperience && profile.workExperience.length > 0) score += 25
  else missing.push("Add at least one work experience")

  if (profile.education && profile.education.length > 0) score += 15
  else missing.push("Add your education details")

  if (profile.skills && profile.skills.length >= 5) score += 20
  else missing.push("Add at least 5 skills")

  if (profile.achievements && profile.achievements.length >= 2) score += 10
  else missing.push("Add at least 2 notable achievements")

  if ((profile.linkedin && profile.linkedin.trim().length > 0) || (profile.portfolio && profile.portfolio.trim().length > 0)) score += 5
  else missing.push("Add a LinkedIn or Portfolio link")

  return { percentage: Math.min(100, score), missing }
}
