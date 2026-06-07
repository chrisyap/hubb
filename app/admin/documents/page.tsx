"use client";

import { LoaderCircle, Plus, Square, SquareCheck, SquareX } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { PageTitle } from "@/app/components/ui/pageTitle";
import { useContent } from "@/app/lib/use-content";
import { cn } from "@/lib/utils";

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
        <PageTitle
          title="Documents"
          description="Upload and manage community documents"
        />
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Plus size={18} />
          Upload Document
        </Button>
      </div>

      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div
                className={cn(
                  "cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-green-700 dark:border-gray-600",
                  "dark:border-gray-600 dark:hover:border-green-400",
                )}
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Drop files here or click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX up to 50MB
                </p>
              </div>

              <div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" className="hidden h-4 w-4" />
                  <SquareX
                    size={20}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  Member-only access
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Upload</Button>
                <Button type="button" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No documents yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Upload your first document to get started.
          </p>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="mx-auto mt-6"
          >
            <Plus size={18} />
            Upload Document
          </Button>
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
