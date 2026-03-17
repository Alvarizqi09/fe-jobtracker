"use client"

import { create } from 'zustand'
import type { AppUser } from '@/types/user.types'

interface AuthState {
  user: AppUser | null
  isLoading: boolean
  token: string | null
  setUser: (user: AppUser | null) => void
  setLoading: (isLoading: boolean) => void
  setToken: (token: string | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  token: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setToken: (token) => set({ token }),
  reset: () => set({ user: null, isLoading: false, token: null }),
}))

