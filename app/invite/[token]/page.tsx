"use client";

import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

import { useAuth } from "../../auth-context";

interface InvitationData {
  id: string;
  email: string;
  role: string;
  orgId: string;
  orgName: string;
  invitedByName: string;
  expiresAt: string;
  status: string;
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { user, isLoading, signUp, loginWithEmail, refreshUser } = useAuth();

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch invitation details
  useEffect(() => {
    if (!token) return;

    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Invalid or expired invitation");
          return;
        }
        const data = await res.json();
        setInvitation(data);
        setEmail(data.email || "");
      } catch {
        setError("Failed to load invitation");
      } finally {
        setFetching(false);
      }
    }

    fetchInvitation();
  }, [token]);

  // If user is already logged in, try to accept automatically
  useEffect(() => {
    if (!isLoading && user && invitation && !submitting) {
      acceptInvitation(user.uid, user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, invitation]);

  const acceptInvitation = async (uid: string, userEmail: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          uid,
          email: userEmail,
          name: user?.name || name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to accept invitation");
        setSubmitting(false);
        return;
      }

      await refreshUser();
      router.push("/admin/dashboard");
    } catch {
      setError("Failed to accept invitation");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        // Sign up via Firebase
        await signUp(email, password, name);
        // The useAuth().signUp already posts to /api/users to create the profile
        // We need to also / overwrite with the admin role via accept endpoint
        // After signup, the user will be logged in, and the effect above will trigger accept
        // But we need the uid from the new user, so let's get it differently
        // Actually, let's handle this differently: sign up first, then accept
        // The signUp in auth context creates the user with role "member"
        // We'll need to manually call accept afterwards

        // Wait for auth state to update
        setTimeout(async () => {
          try {
            const profileRes = await fetch(
              `/api/users/${(await import("firebase/auth")).getAuth().currentUser?.uid}`,
            );
            // But we can't get auth easily here...
            // Let's do it simpler: just call accept after a brief delay
            const {
              getAuth,
            } = await import("firebase/auth");
            const {
              initializeApp,
              getApps,
            } = await import("firebase/app");
            const app = getApps().length
              ? getApps()[0]
              : initializeApp({
                  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                });
            const auth = getAuth(app);
            const currentUser = auth.currentUser;
            if (currentUser) {
              await acceptInvitation(currentUser.uid, currentUser.email || email);
            }
          } catch {
            setError("Failed to complete signup. Please try logging in.");
            setSubmitting(false);
          }
        }, 1000);
      } else {
        // Login first
        await loginWithEmail(email, password);
        // The useEffect above will trigger accept
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please sign in instead.",
        );
        setMode("login");
      } else {
        setError(e?.message || "Authentication failed");
      }
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={48}
            className="animate-spin text-green-600"
          />
          <p className="text-sm text-gray-500">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-950">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Invalid Invitation
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
          <p className="text-sm text-gray-500">
            Please contact the admin who sent you this invitation for a new one.
          </p>
        </div>
      </div>
    );
  }

  if (submitting && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={48}
            className="animate-spin text-green-600"
          />
          <p className="text-sm text-gray-500">Accepting invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div
          className={cn(
            "rounded-xl border border-gray-200 bg-white p-8",
            "dark:border-gray-800 dark:bg-gray-950",
          )}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              You&apos;re Invited!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{invitation?.invitedByName}</span>{" "}
              has invited you to join{" "}
              <span className="font-medium">{invitation?.orgName}</span> as an{" "}
              <span className="font-semibold text-green-700">admin</span>.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-xs border border-red-200 bg-red-100 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={invitation?.email || "your@email.com"}
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "signup" ? "At least 6 characters" : "Your password"
                }
                required
                minLength={mode === "signup" ? 6 : 1}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2"
            >
              {mode === "signup" ? (
                <>
                  <UserPlus size={18} />
                  Create Account & Accept
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In & Accept
                </>
              )}
            </Button>
          </form>

          {/* Mode toggle */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === "signup" ? (
              <button
                onClick={() => setMode("login")}
                className="transition hover:text-gray-900 dark:hover:text-gray-300"
              >
                Already have an account?{" "}
                <span className="font-medium text-green-700 underline dark:text-green-400">
                  Sign in
                </span>
              </button>
            ) : (
              <button
                onClick={() => setMode("signup")}
                className="transition hover:text-gray-900 dark:hover:text-gray-300"
              >
                No account?{" "}
                <span className="font-medium text-green-700 underline dark:text-green-400">
                  Create one
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
