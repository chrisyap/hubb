"use client";

import { Plus } from "lucide-react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { PageTitle } from "@/app/components/ui/pageTitle";
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
        <PageTitle
          title="News & Announcements"
          description="Keep your community informed"
        />
        <Button>
          <Plus size={18} />
          New Post
        </Button>
      </div>

      {!news || news.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-gray-500">
            No news posts yet. Create your first post!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {news.map((post) => (
            <Card key={post.id}>
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
                <Button variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => remove(post.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
