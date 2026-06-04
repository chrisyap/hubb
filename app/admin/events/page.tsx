"use client"

import { Plus } from "lucide-react"

const mockEvents = [
  {
    id: 1,
    title: "Community BBQ",
    date: "Jun 15, 2026",
    time: "2:00 PM",
    location: "Central Park",
    registered: 45,
    capacity: 100,
    status: "published",
  },
  {
    id: 2,
    title: "Workshop: Digital Skills",
    date: "Jun 22, 2026",
    time: "10:00 AM",
    location: "Community Center",
    registered: 28,
    capacity: 50,
    status: "published",
  },
  {
    id: 3,
    title: "Summer Camp Registration",
    date: "Jul 1, 2026",
    time: "9:00 AM",
    location: "School Hall",
    registered: 0,
    capacity: 200,
    status: "draft",
  },
]

export default function EventsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage community events</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus size={18} />
          New Event
        </button>
      </div>

      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📅 {event.date} at {event.time}</p>
                  <p>📍 {event.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">{event.registered}</div>
                <div className="text-sm text-gray-500">of {event.capacity}</div>
                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                      event.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
