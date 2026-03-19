"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Layout, Home, BarChart, Calendar, Users, Settings, Search, Coffee } from 'lucide-react'

const nav = [
  { href: '/board', label: 'Board', icon: Layout },
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
  { href: '/timeline', label: 'Timeline', icon: Calendar },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ variant }: { variant?: 'desktop' | 'mobile' }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-full bg-(--bg-secondary) border-r border-border flex flex-col',
        variant === 'mobile' ? 'w-full' : 'w-64'
      )}
    >
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="p-5 shrink-0">
          <div className="font-syne text-xl tracking-tight text-(--text-primary)">
            Job<span className="text-(--accent-cyan)">Deck</span>
          </div>
          <div className="mt-1 text-xs text-(--text-secondary)">Mission Control for applications</div>
        </div>
        <Separator className="bg-border shrink-0" />
        <nav className="p-3 space-y-1 shrink-0">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/')
            const Icon = item.icon
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
                <Icon className="h-5 w-5 opacity-80" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Keyboard shortcut hint */}
        <div className="px-3 mt-4 shrink-0 pb-4">
          <div className="rounded-lg border border-[rgba(60,90,140,0.3)] bg-(--bg-primary) px-3 py-2.5 text-xs text-(--text-muted) flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Quick Search</span>
            <kbd className="ml-auto font-jetbrains text-[10px] bg-(--bg-hover) border border-[rgba(60,90,140,0.5)] rounded px-1.5 py-0.5">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <a 
          href="https://saweria.co/alvaa09"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)] hover:bg-[rgba(245,158,11,0.1)] transition-colors group shadow-sm"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[rgba(245,158,11,0.15)] group-hover:bg-[rgba(245,158,11,0.25)] transition-colors">
            <Coffee className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-(--text-primary) group-hover:text-[#F59E0B] transition-colors">Support gwehhh</div>
            <div className="text-xs text-(--text-secondary) mt-0.5 group-hover:text-(--text-primary) transition-colors">via Saweria</div>
          </div>
        </a>
      </div>
    </aside>
  )
}
