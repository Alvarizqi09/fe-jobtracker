"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const nav = [
  { href: '/board', label: 'Board', icon: '📋' },
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/timeline', label: 'Timeline', icon: '📅' },
  { href: '/contacts', label: 'Contacts', icon: '👥' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
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
          const active = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition',
                item.href === '/board' && 'board-tab',
                item.href === '/analytics' && 'analytics-tab',
                item.href === '/contacts' && 'contacts-tab',
                active
                  ? 'bg-(--bg-hover) text-(--text-primary) border border-(--border-bright) shadow-[0_0_0_1px_var(--accent-glow)]'
                  : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Keyboard shortcut hint */}
      <div className="px-3 mt-4">
        <div className="rounded-lg border border-[rgba(60,90,140,0.3)] bg-(--bg-primary) px-3 py-2.5 text-xs text-(--text-muted) flex items-center gap-2">
          <span>🔍</span>
          <span>Quick Search</span>
          <kbd className="ml-auto font-jetbrains text-[10px] bg-(--bg-hover) border border-[rgba(60,90,140,0.5)] rounded px-1.5 py-0.5">
            Ctrl+K
          </kbd>
        </div>
      </div>
    </aside>
  )
}
