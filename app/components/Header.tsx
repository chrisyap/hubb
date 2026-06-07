"use client";

import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex h-16 items-center justify-between border-b border-slate-200 bg-slate-50 px-8",
        "dark:border-slate-700 dark:bg-slate-900",
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={cn(
            "rounded-lg p-2 text-slate-600 transition hover:bg-slate-100",
            "dark:text-slate-300 dark:hover:bg-slate-700",
          )}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-serif font-bold text-slate-900 dark:text-slate-100">
            {user?.orgName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Org Admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className={cn(
            "rounded-xs p-2 text-slate-600 transition hover:bg-slate-100",
            "dark:text-slate-300 dark:hover:bg-slate-800",
          )}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={cn(
              "rounded-xs px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
              "dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            {user?.email}
          </button>

          {showMenu && (
            <div
              className={cn(
                "absolute right-0 z-50 mt-2 border border-slate-200 bg-white shadow-lg",
                "dark:border-slate-700 dark:bg-slate-800",
              )}
            >
              <Button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
