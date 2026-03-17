import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { UserProfile } from '../types/profile.types'
import { useProfileStore } from '../store/profileStore'
import { toast } from 'react-hot-toast'

export function useProfile() {
  const [loading, setLoading] = useState(false)
  const { profile, setProfile } = useProfileStore()

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/users/profile')
      if (res.data.profile) {
        setProfile(res.data.profile)
      }
    } catch (err: any) {
      console.error('Failed to fetch profile', err)
    } finally {
      setLoading(false)
    }
  }, [setProfile])

  const saveProfile = async (updatedProfile: Partial<UserProfile>) => {
    setLoading(true)
    try {
      const res = await api.put('/users/profile', updatedProfile)
      setProfile(res.data.profile)
      toast.success('Profile saved successfully!')
      return res.data.profile
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    fetchProfile,
    saveProfile
  }
}
