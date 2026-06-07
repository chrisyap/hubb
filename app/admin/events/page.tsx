"use client";

import { Plus } from "lucide-react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import { PageTitle } from "@/app/components/ui/pageTitle";
import { useContent } from "@/app/lib/use-content";

import type { Event } from "@/app/lib/use-content";
export default function EventsPage() {
  const { user } = useAuth();
  const orgId = user?.orgId ?? "";

  const { data: events, isLoading } = useContent<Event>("events", orgId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <PageTitle
          title="Events"
          description="Create and manage community events"
        />
        <Button>
          <Plus size={18} />
          New Event
        </Button>
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500">No events yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first event to get started.
          </p>
          <Button className="mx-auto mt-6">
            <Plus size={18} />
            New Event
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="truncate text-lg font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs font-medium ${
                        event.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      📅 {event.date}
                      {event.time ? ` at ${event.time}` : ""}
                    </p>
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-green-700">
                    {event.attendees ?? 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    of {event.capacity ?? "—"}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <Button variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
