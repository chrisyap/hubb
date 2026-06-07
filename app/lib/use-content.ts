"use client";

import useSWR, { mutate as globalMutate } from "swr";

// ---- Types ----

export interface Event {
  id: string;
  orgId: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
  capacity?: number;
  attendees?: number;
  tag?: string;
  published: boolean;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  orgId: string;
  title: string;
  body?: string;
  excerpt?: string;
  author?: string;
  published: boolean;
  tags?: string[];
  createdAt: string;
}

export interface Program {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

export interface Member {
  id: string;
  orgId: string;
  uid?: string;
  name: string;
  email: string;
  role: "admin" | "member";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
}

export interface Document {
  id: string;
  orgId: string;
  title: string;
  fileUrl?: string;
  fileSize?: string;
  category?: string;
  memberOnly: boolean;
  createdAt: string;
}

export interface CommitteeMember {
  id: string;
  orgId: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  orgId: string;
  name: string;
  logo?: string;
  url?: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  createdAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: "admin";
  orgId: string;
  orgName: string;
  invitedBy: string;
  invitedByName: string;
  status: "pending" | "accepted";
  token: string;
  createdAt: string;
  expiresAt: string;
}

type ContentTypes =
  | Event
  | NewsItem
  | Program
  | Member
  | Document
  | CommitteeMember
  | Sponsor
  | Invitation;

interface ApiResponse<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  create: (item: Partial<T>) => Promise<string>;
  update: (id: string, item: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  mutate: () => void;
}

const API_BASE = "/api/content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fetcher(url: string): Promise<any> {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  });
}

export function useContent<T = ContentTypes>(
  collection: string,
  orgId?: string,
): ApiResponse<T> {
  const params = new URLSearchParams({ collection });
  if (orgId) params.set("orgId", orgId);

  const key = `${API_BASE}?${params.toString()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isValidating, error, mutate } = useSWR<any[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
      fallbackData: [],
    },
  );

  const create = async (item: Partial<T>): Promise<string> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, ...item }),
    });
    if (!res.ok) throw new Error("Create failed");
    const result = await res.json();
    mutate();
    return result.id;
  };

  const update = async (id: string, item: Partial<T>): Promise<void> => {
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id, ...item }),
    });
    if (!res.ok) throw new Error("Update failed");
    mutate();
  };

  const remove = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}?collection=${collection}&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");
    mutate();
  };

  return {
    data,
    isLoading,
    isValidating,
    error: error as Error | undefined,
    create,
    update,
    remove,
    mutate,
  };
}
