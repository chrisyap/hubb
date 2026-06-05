"use client";

import { useAuth } from "@/app/auth-context";
import { useContent, type Event, type Member } from "@/app/lib/use-content";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useContent<Event>(
    "events",
    user?.orgId
  );
  const { data: members, isLoading: membersLoading } = useContent<Member>(
    "members",
    user?.orgId
  );

  const loading = eventsLoading || membersLoading;

  const publishedEvents =
    events?.filter((e) => e.published === true || e.published === undefined) ||
    [];
  const upcomingEvents = publishedEvents
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 3);
  const activeMembers =
    members?.filter((m) => m.status === "active") || [];
  const pendingMembers =
    members?.filter((m) => m.status === "pending") || [];

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
      change: "Next: " + (upcomingEvents[0]?.date ? new Date(upcomingEvents[0].date).toLocaleDateString() : "None"),
      icon: Calendar,
    },
    {
      label: "Total Events",
      value: publishedEvents.length.toString(),
      change: `${events?.filter(e => !e.published).length || 0} drafts`,
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
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-700 to-emerald-500 text-white px-8 py-12 -mx-8 -mt-6 mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Dashboard</h1>
        <p className="text-emerald-50">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s
          your community at a glance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <Icon className="w-5 h-5 text-muted-foreground/50" />
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity yet. Create your first event to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className={
                      i < recentActivity.length - 1
                        ? "pb-4 border-b border-border"
                        : ""
                    }
                  >
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-emerald-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming events
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={i}
                    className={
                      i < upcomingEvents.length - 1
                        ? "pb-4 border-b border-border"
                        : ""
                    }
                  >
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()}
                      {event.attendees !== undefined
                        ? ` · ${event.attendees} RSVPs`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* To-do list */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>To-do list</CardTitle>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing to do — you&apos;re all caught up!
            </p>
          ) : (
            <div className="space-y-3">
              {todos.map((todo, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">{todo}</span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              onClick={() => (window.location.href = "/admin/events")}
            >
              + Create event
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/news")}
            >
              + New announcement
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/documents")}
            >
              + Upload document
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/members")}
            >
              + Manage members
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
