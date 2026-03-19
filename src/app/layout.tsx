import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { RootProviders } from '@/components/providers/RootProviders'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'JobDeck',
  description: 'Track every opportunity. Land your dream role.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} antialiased font-dm`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
