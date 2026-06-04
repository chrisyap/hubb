"use client"

import { Plus } from "lucide-react"

const mockPrograms = [
  { id: 1, name: "After School Tutoring", description: "Free tutoring for K-12", icon: "📚", status: "published" },
  { id: 2, name: "Sports & Recreation", description: "Kids sports programs", icon: "⚽", status: "published" },
  { id: 3, name: "Community Meals", description: "Weekly community dinners", icon: "🍽️", status: "published" },
  { id: 4, name: "Tech Workshops", description: "Digital skills training", icon: "💻", status: "draft" },
]

export default function ProgramsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage community programs and activities</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus size={18} />
          New Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockPrograms.map((program) => (
          <div key={program.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition">
            <div className="flex items-start gap-4 mb-3">
              <span className="text-4xl">{program.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{program.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                  program.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {program.status === "published" ? "Published" : "Draft"}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded text-sm font-medium transition">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
