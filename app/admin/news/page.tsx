"use client"

import { Plus } from "lucide-react"

const mockNews = [
  {
    id: 1,
    title: "June Community Update",
    excerpt: "Check out what we accomplished this month...",
    date: "Jun 4, 2026",
    author: "Admin",
    status: "published",
  },
  {
    id: 2,
    title: "New Programs Launching",
    excerpt: "Exciting new programs for summer...",
    date: "May 28, 2026",
    author: "Admin",
    status: "published",
  },
  {
    id: 3,
    title: "July Planning Meeting",
    excerpt: "Save the date for our planning session...",
    date: "Jun 1, 2026",
    author: "Admin",
    status: "draft",
  },
]

export default function NewsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Keep your community informed</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus size={18} />
          New Post
        </button>
      </div>

      <div className="space-y-4">
        {mockNews.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <div className="flex gap-4 text-gray-600">
                <span>📅 {post.date}</span>
                <span>by {post.author}</span>
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                  post.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {post.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
