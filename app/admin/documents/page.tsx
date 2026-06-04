"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const mockDocs = [
  { id: 1, name: "Membership Form.pdf", size: "2.4 MB", uploaded: "May 20, 2026", memberOnly: false },
  { id: 2, name: "Committee Minutes - May.pdf", size: "1.8 MB", uploaded: "Jun 1, 2026", memberOnly: true },
  { id: 3, name: "Annual Report 2025.pdf", size: "5.2 MB", uploaded: "Jan 15, 2026", memberOnly: false },
  { id: 4, name: "Budget Proposal.pdf", size: "3.1 MB", uploaded: "Apr 10, 2026", memberOnly: true },
]

export default function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage community documents</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {showUpload && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
          <form className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition cursor-pointer">
              <p className="font-medium text-gray-900">Drop files here or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX up to 50MB</p>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                Member-only access
              </label>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition">
                Upload
              </button>
              <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {mockDocs.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{doc.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{doc.size} • Uploaded {doc.uploaded}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {doc.memberOnly && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    🔒 Member Only
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition">
                View
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
