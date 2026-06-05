"use client"

import { LogOut, Menu, Moon, Sun } from "lucide-react"
import { useState } from "react"

import { useAuth } from "../auth-context"
import { useTheme } from "../providers"

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth()
  const { isDark, toggleDark } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 transition hover:bg-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-serif font-bold text-gray-900">
            {user?.orgName}
          </h1>
          <p className="text-xs text-gray-600">Org Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="rounded-lg p-2 transition hover:bg-gray-100 text-gray-600"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-gray-100 text-gray-700"
          >
            {user?.email}
          </button>

          {showMenu && (
            <div className="absolute right-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-red-600 hover:bg-gray-100"
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
