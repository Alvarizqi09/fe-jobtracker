"use client"

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/components/providers/AuthProvider'

export function RootProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
            }}
          />
          <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  )
}

