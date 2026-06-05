"use client"

import { useState } from "react"
import { Plus, Eye, Trash2 } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { useContent, type Document } from "@/app/lib/use-content"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

export default function DocumentsPage() {
  const { user } = useAuth()
  const orgId = user?.orgId ?? ""

  const { data: documents, isLoading, remove } = useContent<Document>("documents", orgId)
  const [showUpload, setShowUpload] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-500 dark:border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>
    )
  }

  const uploadButton = (
    <Button
      onClick={() => setShowUpload(!showUpload)}
      className="bg-green-700 hover:bg-green-800 text-white"
    >
      <Plus size={18} />
      Upload Document
    </Button>
  )

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload and manage community documents
          </p>
        </div>
        {uploadButton}
      </div>

      {showUpload && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upload Document
          </h3>
          <form className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition cursor-pointer">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                PDF, DOC, DOCX up to 50MB
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600" />
                Member-only access
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                Upload
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No documents yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Upload your first document to get started.
          </p>
          <div className="mt-6">{uploadButton}</div>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {doc.fileSize && `${doc.fileSize} • `}
                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {doc.memberOnly && (
                    <Badge variant="secondary">Member Only</Badge>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => remove(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
