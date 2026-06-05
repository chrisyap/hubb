"use client";

import { Plus } from "lucide-react";

import { useAuth } from "@/app/auth-context";
import { useContent } from "@/app/lib/use-content";
import type { NewsItem } from "@/app/lib/use-content";

export default function NewsPage() {
  const { user } = useAuth();
  const orgId = user?.orgId ?? "";

  const { data: news, isLoading, remove } = useContent<NewsItem>("news", orgId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            News & Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your community informed
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800">
          <Plus size={18} />
          New Post
        </button>
      </div>

      {!news || news.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            No news posts yet. Create your first post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                  )}
                </div>
                <span
                  className={`inline-block rounded px-3 py-1 text-xs font-medium whitespace-nowrap ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                <div className="flex gap-4 text-gray-600">
                  <span>
                    📅 {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  {post.author && <span>by {post.author}</span>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200">
                  Edit
                </button>
                <button
                  onClick={() => remove(post.id)}
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
