'use client'

import { useState, useRef, useEffect } from 'react'
import { FileUp, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/store/profileStore'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

const PARSING_STEPS = [
  { label: 'Uploading CV...', icon: FileText, progress: 15 },
  { label: 'Reading document...', icon: FileText, progress: 30 },
  { label: 'Extracting personal info...', icon: Sparkles, progress: 45 },
  { label: 'Analyzing work experience...', icon: Sparkles, progress: 60 },
  { label: 'Parsing education & skills...', icon: Sparkles, progress: 75 },
  { label: 'Finalizing profile data...', icon: Sparkles, progress: 90 },
]

function FullscreenOverlay({
  fileName,
  onComplete,
  result,
}: {
  fileName: string
  onComplete: 'success' | 'error' | null
  result: string | null
}) {
  const [stepIndex, setStepIndex] = useState(0)

  // Cycle through parsing steps automatically
  useEffect(() => {
    if (onComplete) return // Stop cycling when done

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < PARSING_STEPS.length - 1) return prev + 1
        return prev
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [onComplete])

  const currentStep = PARSING_STEPS[stepIndex]
  const progress = onComplete === 'success' ? 100 : onComplete === 'error' ? currentStep.progress : currentStep.progress
  const StepIcon = currentStep.icon

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
          {/* Animated icon */}
          <div className="flex justify-center mb-6">
            <AnimatePresence mode="wait">
              {onComplete === 'success' ? (
                <motion.div
                  key="success-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
              ) : onComplete === 'error' ? (
                <motion.div
                  key="error-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center"
                >
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="parsing-icon"
                  className="w-20 h-20 rounded-full bg-violet-500/15 flex items-center justify-center relative"
                >
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-500/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <StepIcon className="w-9 h-9 text-violet-500" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={onComplete || stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-semibold text-center mb-2 text-white"
            >
              {onComplete === 'success'
                ? 'CV Parsed Successfully!'
                : onComplete === 'error'
                  ? 'Parsing Failed'
                  : currentStep.label}
            </motion.h2>
          </AnimatePresence>

          {/* Subtitle */}
          <p className="text-sm text-zinc-400 text-center mb-6">
            {onComplete === 'success'
              ? 'Your profile has been auto-filled. You can review and edit the data.'
              : onComplete === 'error'
                ? result || 'Something went wrong. Please try again.'
                : fileName}
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-zinc-700 overflow-hidden mb-3">
            <motion.div
              className={`h-full rounded-full ${
                onComplete === 'success'
                  ? 'bg-emerald-500'
                  : onComplete === 'error'
                    ? 'bg-red-500'
                    : 'bg-gradient-to-r from-violet-500 to-indigo-500'
              }`}
              initial={{ width: '5%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>
              {onComplete === 'success'
                ? 'Complete'
                : onComplete === 'error'
                  ? 'Failed'
                  : 'AI is analyzing your CV...'}
            </span>
            <span className="font-mono">{progress}%</span>
          </div>

          {/* Shimmer effect on card while loading */}
          {!onComplete && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export function CvUploadButton() {
  const [state, setState] = useState<UploadState>('idle')
  const [fileName, setFileName] = useState<string>('')
  const [overlayResult, setOverlayResult] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setProfile } = useProfileStore()

  const handleClick = () => {
    if (state === 'uploading') return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so same file can be re-selected
    e.target.value = ''

    // Client-side validation
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Maximum size is 4MB.')
      return
    }

    setFileName(file.name)
    setState('uploading')
    setOverlayResult(null)
    setShowOverlay(true)

    try {
      const formData = new FormData()
      formData.append('cv', file)

      const res = await api.post('/users/profile/parse-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s — AI parsing can take time
      })

      if (res.data.profile) {
        setProfile(res.data.profile)
        setState('success')
        setOverlayResult(null)

        // Close overlay after 2s on success
        setTimeout(() => {
          setShowOverlay(false)
          setState('idle')
        }, 2000)
      }
    } catch (err: unknown) {
      setState('error')
      let message = 'Failed to parse CV. Please try again.'
      if (err instanceof Error && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        message = axiosErr.response?.data?.message || message
      }
      setOverlayResult(message)

      // Close overlay after 3s on error
      setTimeout(() => {
        setShowOverlay(false)
        setState('idle')
      }, 3000)
    }
  }

  const overlayState =
    state === 'success' ? 'success' : state === 'error' ? 'error' : null

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload CV PDF"
      />
      <Button
        onClick={handleClick}
        disabled={state === 'uploading'}
        className="relative overflow-hidden transition-all duration-300 font-medium cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-md hover:shadow-lg hover:shadow-violet-500/25"
        size="sm"
      >
        <FileUp className="h-4 w-4 mr-1" />
        Complete by CV
      </Button>

      {/* Fullscreen loading overlay */}
      <AnimatePresence>
        {showOverlay && (
          <FullscreenOverlay
            fileName={fileName}
            onComplete={overlayState}
            result={overlayResult}
          />
        )}
      </AnimatePresence>
    </>
  )
}
