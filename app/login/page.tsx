"use client";

import { Globe, Lock, LogIn, Mail, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

import { useAuth } from "../auth-context";
import { useTheme } from "../providers";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  // Show unauthorized error from redirect
  if (urlError === "unauthorized" && !error) {
    setError("You don't have permission to access this page.");
  }
  const [magicSent, setMagicSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, signUp, sendMagicLink } = useAuth();
  const { isDark, toggleDark } = useTheme();

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === "auth/popup-closed-by-user") {
        setError("");
      } else {
        setError(e?.message || "Google sign-in failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
        router.push("/admin/dashboard");
      } else if (mode === "signup") {
        await signUp(email, password, name);
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (e?.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (e?.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError(e?.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendMagicLink(email);
      setMagicSent(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-gray-50 px-4",
        "dark:bg-gray-900",
      )}
    >
      <div className="w-full max-w-md">
        <div
          className={cn(
            "relative rounded-xl border border-gray-200 bg-white p-8",
            "dark:border-gray-800 dark:bg-gray-950",
            "shadow-[0_0_20px_rgba(var(--color-primary),1)]",
          )}
        >
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleDark}
              className={cn(
                "rounded-lg p-2 text-gray-400 transition hover:bg-gray-100",
                "dark:hover:bg-gray-800",
              )}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Hubb
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Community Management Platform
            </p>
          </div>

          {/* Google Sign-In */}
          <button
            className={cn(
              "mb-8 flex h-10 w-full items-center justify-center rounded-sm bg-[#F2F2F2]",
              isLoading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:opacity-90",
            )}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Image
              src="/svg/neutral/web_neutral_sq_SI.svg"
              alt="Continue with Google"
              height={40}
              width={179}
            />
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or {mode === "signup" ? "sign up" : "sign in"} with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          {mode !== "magic" && (
            <form onSubmit={handleEmailSubmit}>
              {mode === "signup" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}
              <div style={{ marginBottom: "1rem" }}>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={cn("pl-10", "dark:placeholder-gray-500")}
                  />
                </div>
              </div>

              {(mode === "login" || mode === "signup") && (
                <div style={{ marginBottom: "1rem" }}>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === "signup" ? "At least 6 characters" : "••••••••"
                      }
                      required
                      minLength={mode === "signup" ? 6 : 1}
                      className={cn("pl-10", "dark:placeholder-gray-500")}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p
                  style={{ marginBottom: "1rem" }}
                  className="rounded-xs border border-red-200 bg-red-100 px-3 py-2 text-sm font-medium text-red-600"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2"
              >
                <LogIn size={18} />
                {isLoading
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </form>
          )}

          {/* Magic Link Form */}
          {mode === "magic" && (
            <form onSubmit={handleMagicLink}>
              <div style={{ marginBottom: "1rem" }}>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={cn("pl-10", "dark:placeholder-gray-500")}
                  />
                </div>
              </div>
              {error && (
                <p
                  style={{ marginBottom: "1rem" }}
                  className={cn(
                    "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600",
                    "dark:bg-red-900 dark:text-red-300",
                  )}
                >
                  {error}
                </p>
              )}
              {magicSent ? (
                <p className="text-center text-sm text-emerald-600">
                  Check your email for the sign-in link!
                </p>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-full">
                  Send Magic Link
                </Button>
              )}
            </form>
          )}

          {/* Mode switcher */}
          <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === "login" && (
              <>
                <button
                  onClick={() => setMode("signup")}
                  className="w-full transition hover:text-gray-900 dark:hover:text-gray-300"
                >
                  No account?{" "}
                  <span className="font-medium text-green-700 underline dark:text-green-400">
                    Create one
                  </span>
                </button>
                <button
                  onClick={() => setMode("magic")}
                  className="w-full transition hover:text-gray-900 dark:hover:text-gray-300"
                >
                  Or sign in with a{" "}
                  <span className="font-medium text-green-700 underline dark:text-green-400">
                    magic link
                  </span>
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="w-full transition hover:text-gray-900 dark:hover:text-gray-300"
              >
                Already have an account?{" "}
                <span className="font-medium text-green-700 underline dark:text-green-400">
                  Sign in
                </span>
              </button>
            )}
            {mode === "magic" && (
              <button
                onClick={() => setMode("login")}
                className="w-full transition hover:text-gray-900 dark:hover:text-gray-300"
              >
                Back to{" "}
                <span className="font-medium text-green-700 underline dark:text-green-400">
                  password sign-in
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
