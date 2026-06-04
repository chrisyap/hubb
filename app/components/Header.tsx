"use client";

import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../auth-context";
import { useTheme } from "../providers";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-16 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-8 bg-white dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-serif font-bold text-gray-900">{user?.org}</h1>
          <p className="text-xs text-gray-600">Org Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title={isDark ? "Light mode" : "Dark mode"}
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
                  logout();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg flex items-center gap-2 text-red-600"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
