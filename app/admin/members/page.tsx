"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/auth-context";
import { useContent } from "@/app/lib/use-content";
import type { Member } from "@/app/lib/use-content";

type FilterValue = "all" | "active" | "pending";

export default function MembersPage() {
  const { user } = useAuth();
  const orgId = user?.orgId ?? "";

  const { data: members, isLoading } = useContent<Member>("members", orgId);
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered =
    members?.filter((m) => {
      if (filter === "all") return true;
      return m.status === filter;
    }) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage community members and signups
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-700">
            {members?.length ?? 0}
          </p>
          <p className="text-sm text-gray-500">Total members</p>
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        {(["all", "active", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500">
            {filter === "all"
              ? "No members yet"
              : filter === "pending"
                ? "No pending members"
                : "No active members"}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Members will appear here once they join.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : member.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
