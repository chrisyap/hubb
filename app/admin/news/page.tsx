"use client"

import { useContent, type NewsItem } from "@/app/lib/use-content"
import { useAuth } from "@/app/auth-context"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function NewsPage() {
  const { user } = useAuth()
  const orgId = user?.orgId ?? ""

  const { data: news, isLoading, remove } = useContent<NewsItem>("news", orgId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading news...</p>
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              News & Announcements
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Keep your community informed
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No news posts yet. Create your first post!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            News & Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Keep your community informed
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="space-y-4">
        {news.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription>{post.excerpt}</CardDescription>
                  )}
                </div>
                <Badge variant={post.published ? "success" : "warning"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>
                  📅 {new Date(post.createdAt).toLocaleDateString()}
                </span>
                {post.author && <span>by {post.author}</span>}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm">
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove(post.id)}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
