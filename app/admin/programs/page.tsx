"use client";

import { LoaderCircle, Plus } from "lucide-react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import { PageTitle } from "@/app/components/ui/pageTitle";
import { useContent } from "@/app/lib/use-content";

import type { Program } from "@/app/lib/use-content";
export default function ProgramsPage() {
  const { user } = useAuth();
  const orgId = user?.orgId ?? "";

  const { data: programs, isLoading } = useContent<Program>("programs", orgId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <PageTitle
          title="Programs"
          description="Manage community programs and activities"
        />
        <Button>
          <Plus size={18} />
          New Program
        </Button>
      </div>

      {!programs || programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-gray-500">No programs yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first program to get started.
          </p>
          <Button className="mx-auto mt-6">
            <Plus size={18} />
            New Program
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
            >
              <div className="mb-3 flex items-start gap-4">
                <span className="text-4xl">{program.icon ?? "📋"}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="truncate text-lg font-semibold text-gray-900">
                      {program.name}
                    </h3>
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs font-medium ${
                        program.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {program.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {program.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {program.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">
                  {new Date(program.createdAt).toLocaleDateString()}
                </span>
                <Button variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
