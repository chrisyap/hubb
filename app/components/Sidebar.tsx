"use client";

import {
  Calendar,
  FileText,
  FileUp,
  Grid,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/news", label: "News & Announcements", icon: FileText },
  { href: "/admin/programs", label: "Programs", icon: Grid },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/documents", label: "Documents", icon: FileUp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-64 overflow-hidden border-r border-slate-200 bg-slate-50",
        "dark:border-slate-700 dark:bg-slate-900",
        isOpen ? "" : "-ml-64",
      )}
    >
      <div className="p-6">
        <h2 className="mb-8 font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
          Hubb
        </h2>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 py-1 text-sm transition",
                  "border-transparent hover:border-l-2 hover:pl-3",
                  isActive ? "border-l-2 border-green-700 pl-3" : "",
                )}
              >
                <Icon
                  size={20}
                  className="text-slate-700 dark:text-slate-300"
                />
                <span
                  className={cn(
                    "text-sm text-slate-900 dark:text-slate-300",
                    "dark:text-slate-300",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
