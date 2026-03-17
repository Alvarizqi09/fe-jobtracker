"use client"

import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const token = useAuthStore((s) => s.token)
  return { user, isLoading, token }
}

