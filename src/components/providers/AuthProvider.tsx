"use client"

import { useEffect, useRef } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '@/lib/firebase'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { AppUser, BackendUser } from '@/types/user.types'

interface SyncResponse {
  user: BackendUser
}

function toAppUser(u: User): AppUser {
  const base: AppUser = { uid: u.uid, email: u.email ?? '' }
  if (u.displayName) base.displayName = u.displayName
  if (u.photoURL) base.photoURL = u.photoURL
  return base
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const setToken = useAuthStore((s) => s.setToken)
  const reset = useAuthStore((s) => s.reset)
  const refreshTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      reset()
      return
    }
    setLoading(true)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          if (refreshTimer.current) window.clearInterval(refreshTimer.current)
          refreshTimer.current = null
          reset()
          return
        }

        const appUser = toAppUser(firebaseUser)
        setUser(appUser)

        const token = await firebaseUser.getIdToken()
        setToken(token)

        // upsert user in backend
        await api.post<SyncResponse>('/users/sync')

        // refresh token roughly every 55 minutes
        if (refreshTimer.current) window.clearInterval(refreshTimer.current)
        refreshTimer.current = window.setInterval(async () => {
          const current = auth?.currentUser ?? null
          if (!current) return
          const t = await current.getIdToken(true)
          setToken(t)
        }, 55 * 60 * 1000)
      } catch (err) {
        toast.error('Auth sync failed. Please refresh.')
        // Keep Firebase user but mark app as not loading to avoid deadlock
      } finally {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
      if (refreshTimer.current) window.clearInterval(refreshTimer.current)
    }
  }, [reset, setLoading, setToken, setUser])

  return children
}

