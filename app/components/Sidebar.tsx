'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Calendar, FileText, Grid, Users,
  FileUp, Settings, Menu, X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
}

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/news', label: 'News & Announcements', icon: FileText },
  { href: '/admin/programs', label: 'Programs', icon: Grid },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/documents', label: 'Documents', icon: FileUp },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-slate-900 border-r border-slate-800 transition-all overflow-hidden`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold text-white mb-8">Hubb</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
