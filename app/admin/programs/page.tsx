"use client"

import { Plus } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { useContent, type Program } from "@/app/lib/use-content"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

export default function ProgramsPage() {
  const { user } = useAuth()
  const orgId = user?.orgId ?? ""

  const { data: programs, isLoading } = useContent<Program>("programs", orgId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-500 dark:border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    )
  }

  const newProgramButton = (
    <Button className="bg-green-700 hover:bg-green-800 text-white">
      <Plus size={18} />
      New Program
    </Button>
  )

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Programs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage community programs and activities
          </p>
        </div>
        {newProgramButton}
      </div>

      {!programs || programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No programs yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Create your first program to get started.
          </p>
          <div className="mt-6">{newProgramButton}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((program) => (
            <Card key={program.id} className="p-6">
              <div className="flex items-start gap-4 mb-3">
                <span className="text-4xl">{program.icon ?? "📋"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {program.name}
                    </h3>
                    <Badge variant={program.published ? "success" : "warning"}>
                      {program.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  {program.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(program.createdAt).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
