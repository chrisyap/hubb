"use client"

import { Plus } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { useContent, type Event } from "@/app/lib/use-content"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

export default function EventsPage() {
  const { user } = useAuth()
  const orgId = user?.orgId ?? ""

  const { data: events, isLoading } = useContent<Event>("events", orgId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-500 dark:border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    )
  }

  const newEventButton = (
    <Button className="bg-green-700 hover:bg-green-800 text-white">
      <Plus size={18} />
      New Event
    </Button>
  )

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Events</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage community events
          </p>
        </div>
        {newEventButton}
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No events yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Create your first event to get started.
          </p>
          <div className="mt-6">{newEventButton}</div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {event.title}
                    </h3>
                    <Badge variant={event.published ? "success" : "warning"}>
                      {event.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      📅 {event.date}
                      {event.time ? ` at ${event.time}` : ""}
                    </p>
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-500">
                    {event.attendees ?? 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    of {event.capacity ?? "—"}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
