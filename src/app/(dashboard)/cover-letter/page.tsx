'use client'

import { useEffect, useState } from 'react'
import { useCoverLetter } from '@/hooks/useCoverLetter'
import { CoverLetterCard } from '@/components/cover-letter/CoverLetterCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, FileText } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CoverLetterHistoryPage() {
  const { fetchLetters, coverLetters, deleteLetter, loading } = useCoverLetter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLetters()
  }, [fetchLetters])

  const filtered = coverLetters.filter(l => 
    (l.companyName && l.companyName.toLowerCase().includes(search.toLowerCase())) || 
    (l.jobTitle && l.jobTitle.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cover Letters</h1>
          <p className="text-muted-foreground">
            Manage and review your AI-generated cover letters.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/cover-letter/new'} className="shrink-0 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
          <Plus className="mr-2 h-4 w-4 relative z-10" /> 
          <span className="relative z-10">New Cover Letter</span>
        </Button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by company or job title..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {!loading && coverLetters.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed bg-card/30">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No cover letters yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't generated any cover letters yet. Click the button below to craft your first personalized pitch.
          </p>
          <Button onClick={() => window.location.href = '/cover-letter/new'} variant="secondary">
            Generate Cover Letter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((letter, i) => (
              <motion.div
                key={letter._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <CoverLetterCard letter={letter} onDelete={deleteLetter} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
