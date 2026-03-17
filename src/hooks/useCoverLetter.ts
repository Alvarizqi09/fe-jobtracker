import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { CoverLetter, GenerateCoverLetterDTO } from '../types/cover-letter.types'
import { toast } from 'react-hot-toast'

export function useCoverLetter() {
  const [loading, setLoading] = useState(false)
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])

  const generateLetter = async (data: GenerateCoverLetterDTO) => {
    setLoading(true)
    try {
      const res = await api.post('/cover-letter/generate', data)
      toast.success('Cover letter generated!')
      return res.data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate cover letter')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchLetters = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/cover-letter')
      setCoverLetters(res.data)
    } catch (err: any) {
      console.error('Failed to fetch cover letters', err)
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLetterById = async (id: string) => {
    try {
      const res = await api.get(`/cover-letter/${id}`)
      return res.data
    } catch (err: any) {
      toast.error('Failed to load cover letter')
      throw err
    }
  }

  const updateLetter = async (id: string, content: string) => {
    try {
      const res = await api.put(`/cover-letter/${id}`, { content })
      return res.data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to auto-save')
      throw err
    }
  }

  const deleteLetter = async (id: string) => {
    try {
      await api.delete(`/cover-letter/${id}`)
      setCoverLetters(prev => prev.filter(l => l._id !== id))
      toast.success('Deleted successfully')
    } catch (err: any) {
      toast.error('Failed to delete')
      throw err
    }
  }

  return {
    loading,
    coverLetters,
    generateLetter,
    fetchLetters,
    fetchLetterById,
    updateLetter,
    deleteLetter,
  }
}
