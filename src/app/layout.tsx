import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { RootProviders } from '@/components/providers/RootProviders'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  metadataBase: new URL('https://huntrrr.vercel.app'),
  title: 'Huntrrr | Smart Job Application Tracker',
  description:
    'Track. Hunt. Land. — Kelola lamaran kerjamu dengan Kanban board, AI Cover Letter Generator, dan Analytics Dashboard. Your job hunt, weaponized.',
  keywords: [
    'Job Application Tracker',
    'Kanban Board',
    'AI Cover Letter',
    'Job Hunt',
    'Career Tracker',
    'Google Gemini',
    'Huntrrr',
  ],
  authors: [{ name: 'Alvarizqi' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Huntrrr | Smart Job Application Tracker',
    description:
      'Track. Hunt. Land. — Kelola lamaran kerjamu dengan Kanban board, AI Cover Letter Generator, dan Analytics Dashboard.',
    url: 'https://huntrrr.vercel.app',
    siteName: 'Huntrrr',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huntrrr | Smart Job Application Tracker',
    description:
      'Track. Hunt. Land. — Kelola lamaran kerjamu dengan Kanban board, AI Cover Letter Generator, dan Analytics Dashboard.',
  },
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
