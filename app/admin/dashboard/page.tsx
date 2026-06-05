"use client";

import {
  Calendar,
  FileText,
  Loader2,
  LoaderCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useContent } from "@/app/lib/use-content";
import type { Event, Member } from "@/app/lib/use-content";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useContent<Event>(
    "events",
    user?.orgId,
  );
  const { data: members, isLoading: membersLoading } = useContent<Member>(
    "members",
    user?.orgId,
  );

  const loading = eventsLoading || membersLoading;

  const publishedEvents =
    events?.filter((e) => e.published === true || e.published === undefined) ||
    [];
  const upcomingEvents = publishedEvents
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 3);
  const activeMembers = members?.filter((m) => m.status === "active") || [];
  const pendingMembers = members?.filter((m) => m.status === "pending") || [];

  const stats = [
    {
      label: "Active Members",
      value: activeMembers.length.toString(),
      change: `${pendingMembers.length} pending`,
      icon: Users,
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.length.toString(),
      change:
        "Next: " +
        (upcomingEvents[0]?.date
          ? new Date(upcomingEvents[0].date).toLocaleDateString()
          : "None"),
      icon: Calendar,
    },
    {
      label: "Total Events",
      value: publishedEvents.length.toString(),
      change: `${events?.filter((e) => !e.published).length || 0} drafts`,
      icon: TrendingUp,
    },
    {
      label: "Total Members",
      value: (members?.length || 0).toString(),
      change: `${activeMembers.length} active`,
      icon: FileText,
    },
  ];

  const recentActivity = (events || [])
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)
    .map((e) => ({
      text: `${e.title}${e.published !== false ? "" : " (draft)"}`,
      time: new Date(e.createdAt).toLocaleDateString(),
      type: "event",
    }));

  const todos = [
    pendingMembers.length > 0
      ? `Approve ${pendingMembers.length} pending member${pendingMembers.length !== 1 ? "s" : ""}`
      : null,
    events && events.filter((e) => !e.published).length > 0
      ? `Publish ${events.filter((e) => !e.published).length} draft event${events.filter((e) => !e.published).length !== 1 ? "s" : ""}`
      : null,
    "Review upcoming schedule",
  ].filter(Boolean) as string[];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s your
          community at a glance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
            >
              <p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {stat.label}
              </p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-green-600">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h3 className="mb-6 text-base font-semibold text-gray-900">
            Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No activity yet. Create your first event to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className={
                    i < recentActivity.length - 1
                      ? "border-border border-b pb-4"
                      : ""
                  }
                >
                  <div className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-700" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.text}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-base font-semibold text-gray-900">
            Upcoming Events
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className={
                    i < upcomingEvents.length - 1
                      ? "border-b border-gray-100 pb-4"
                      : ""
                  }
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                    {event.attendees !== undefined
                      ? ` · ${event.attendees} RSVPs`
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* To-do list */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-base font-semibold text-gray-900">
          To-Do List
        </h3>
        {todos.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nothing to do — you&apos;re all caught up!
          </p>
        ) : (
          <div className="space-y-3">
            {todos.map((todo, i) => (
              <label key={i} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-900">{todo}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-base font-semibold text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => (window.location.href = "/admin/events")}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            + Create Event
          </button>
          <button
            onClick={() => (window.location.href = "/admin/news")}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            + Announcement
          </button>
          <button
            onClick={() => (window.location.href = "/admin/documents")}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            + Upload Doc
          </button>
          <button
            onClick={() => (window.location.href = "/admin/members")}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            + Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
