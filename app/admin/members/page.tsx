"use client"

import { useState } from "react"

const mockMembers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", joined: "Jan 15, 2025", status: "active" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", joined: "Aug 22, 2024", status: "active" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", joined: "May 10, 2026", status: "pending" },
  { id: 4, name: "James Brown", email: "james@example.com", joined: "Mar 5, 2024", status: "active" },
  { id: 5, name: "Lisa Garcia", email: "lisa@example.com", joined: "Nov 20, 2025", status: "active" },
]

export default function MembersPage() {
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all")

  const filtered = mockMembers.filter((m) => {
    if (filter === "all") return true
    return m.status === filter
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage community members and signups</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-700">{mockMembers.length}</p>
          <p className="text-sm text-gray-500">Total members</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {(["all", "active", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === f
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Joined</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-gray-600">{member.email}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{member.joined}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                      member.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
