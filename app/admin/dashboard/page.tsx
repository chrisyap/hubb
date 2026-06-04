"use client"

export default function Dashboard() {
  const stats = [
    { label: "Active Members", value: "248", change: "↑ 12 this month" },
    { label: "Upcoming Events", value: "3", change: "Next: Jun 15" },
    { label: "Funds Raised", value: "$4.2k", change: "↑ 18% vs last year" },
    { label: "Documents", value: "24", change: "6 pending review" },
  ]

  const recentActivity = [
    { text: "Sarah Johnson joined as member", time: "2 hours ago" },
    { text: "New event created: Book Fair", time: "5 hours ago" },
    { text: "Q3 budget approved", time: "1 day ago" },
    { text: "12 new signups this week", time: "2 days ago" },
  ]

  const upcomingEvents = [
    { name: "Book Fair", date: "Jun 15 • 48 RSVPs", badge: "Active" },
    { name: "AGM Meeting", date: "Jun 22 • 12 RSVPs", badge: "Scheduled" },
    { name: "School Canteen", date: "Jun 18 • 156 RSVPs", badge: "Full" },
  ]

  const todos = [
    "Approve 6 pending docs",
    "Review applications",
    "Send meeting reminder",
  ]

  return (
    <div className="p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className="text-sm text-green-600 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Member Growth</h3>
          <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Interactive member growth chart
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Event Attendance</h3>
          <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Attendance data
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className={`flex gap-3 ${i < recentActivity.length - 1 ? "pb-4 border-b border-gray-100" : ""}`}
              >
                <div className="w-2 h-2 rounded-full bg-green-700 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className={i < upcomingEvents.length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                <p className="text-sm font-semibold text-gray-900">{event.name}</p>
                <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  {event.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* To-Do List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-6">To-Do List</h3>
        <div className="space-y-3">
          {todos.map((todo, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-900">{todo}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Create Event
          </button>
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Announcement
          </button>
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Upload Doc
          </button>
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Member
          </button>
        </div>
      </div>
    </div>
  )
}
