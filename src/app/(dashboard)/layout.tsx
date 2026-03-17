import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
        <div className="flex min-h-screen">
          <div className="hidden md:block">
            <Sidebar variant="desktop" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <Topbar />
            <main className="min-w-0 flex-1 min-h-0 overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

