"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { useContent, type Member } from "@/app/lib/use-content"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

type FilterValue = "all" | "active" | "pending"

export default function MembersPage() {
  const { user } = useAuth()
  const orgId = user?.orgId ?? ""

  const { data: members, isLoading } = useContent<Member>("members", orgId)
  const [filter, setFilter] = useState<FilterValue>("all")

  const filtered =
    members?.filter((m) => {
      if (filter === "all") return true
      return m.status === filter
    }) ?? []

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success" as const
      case "pending":
        return "warning" as const
      case "inactive":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-500 dark:border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Members</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage community members and signups
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-700 dark:text-green-500">
            {members?.length ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total members</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {(["all", "active", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === f
                ? "bg-green-700 text-white dark:bg-green-600"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            {filter === "all"
              ? "No members yet"
              : filter === "pending"
                ? "No pending members"
                : "No active members"}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Members will appear here once they join.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Joined
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusBadgeVariant(member.status)}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
