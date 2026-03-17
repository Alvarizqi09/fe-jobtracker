"use client"

import axios, { type AxiosInstance } from 'axios'
import { auth } from './firebase'

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const user = auth?.currentUser ?? null
  if (user) {
    const token = await user.getIdToken()
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

