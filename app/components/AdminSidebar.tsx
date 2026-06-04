'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, FileText, Grid, Users, FileUp, Settings } from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/news', label: 'Announcements', icon: FileText },
  { href: '/admin/programs', label: 'Programs', icon: Grid },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/documents', label: 'Documents', icon: FileUp },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
      {/* Quick Stats */}
      <div className="mb-8">
        <div className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3 px-2">Quick Stats</div>
        <div className="bg-gray-50 p-3 rounded-lg mb-2 border-l-4 border-primary">
          <div className="text-lg font-bold text-gray-900">248</div>
          <div className="text-sm text-gray-600">Members</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg mb-2 border-l-4 border-primary">
          <div className="text-lg font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-primary">
          <div className="text-lg font-bold text-gray-900">$4.2k</div>
          <div className="text-sm text-gray-600">Funds</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3 px-2">Navigation</div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-green-100 text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Pending */}
      <div>
        <div className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3 px-2">Pending</div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600 px-3 py-2 hover:text-primary cursor-pointer">6 docs to review</div>
          <div className="text-sm text-gray-600 px-3 py-2 hover:text-primary cursor-pointer">3 new signups</div>
          <div className="text-sm text-gray-600 px-3 py-2 hover:text-primary cursor-pointer">1 event approval</div>
        </div>
      </div>
    </div>
  )
}
