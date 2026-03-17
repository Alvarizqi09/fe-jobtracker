"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const nav = [
  { href: '/board', label: 'Board' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function Sidebar({ variant }: { variant?: 'desktop' | 'mobile' }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-full bg-(--bg-secondary) border-r border-border',
        variant === 'mobile' ? 'w-full' : 'w-64'
      )}
    >
      <div className="p-5">
        <div className="font-syne text-xl tracking-tight text-(--text-primary)">
          Job<span className="text-(--accent-cyan)">Deck</span>
        </div>
        <div className="mt-1 text-xs text-(--text-secondary)">Mission Control for applications</div>
      </div>
      <Separator className="bg-border" />
      <nav className="p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm transition',
                active
                  ? 'bg-(--bg-hover) text-(--text-primary) border border-(--border-bright) shadow-[0_0_0_1px_var(--accent-glow)]'
                  : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

