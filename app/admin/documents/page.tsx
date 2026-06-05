"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/auth-context";
import { useContent } from "@/app/lib/use-content";
import type { Document } from "@/app/lib/use-content";

export default function DocumentsPage() {
  const { user } = useAuth();
  const orgId = user?.orgId ?? "";

  const {
    data: documents,
    isLoading,
    remove,
  } = useContent<Document>("documents", orgId);
  const [showUpload, setShowUpload] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage community documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {showUpload && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Upload Document
          </h3>
          <form className="space-y-4">
            <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-green-400">
              <p className="font-medium text-gray-900">
                Drop files here or click to upload
              </p>
              <p className="mt-1 text-sm text-gray-500">
                PDF, DOC, DOCX up to 50MB
              </p>
            </div>

            <div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                Member-only access
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500">No documents yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Upload your first document to get started.
          </p>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="mx-auto mt-6 flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
          >
            <Plus size={18} />
            Upload Document
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {doc.fileSize && `${doc.fileSize} • `}
                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                  {doc.memberOnly && (
                    <span className="inline-block rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Member Only
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <button className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200">
                  View
                </button>
                <button
                  onClick={() => remove(doc.id)}
                  className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
