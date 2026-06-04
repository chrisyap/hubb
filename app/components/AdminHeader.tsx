'use client'

import { useAuth } from '../auth-context'
import { useTheme } from '../providers'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const { isDark, toggleDark } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
          >
            {user?.email}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg flex items-center gap-2 text-red-600 text-sm"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
