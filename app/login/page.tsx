"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../auth-context"
import { Mail, Lock, LogIn, Globe, Moon, Sun } from "lucide-react"
import { useTheme } from "../providers"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login")
  const [error, setError] = useState("")
  const [magicSent, setMagicSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    loginWithGoogle,
    loginWithEmail,
    signUp,
    sendMagicLink,
  } = useAuth()
  const { isDark, toggleDark } = useTheme()

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoading(true)
    try {
      await loginWithGoogle()
      router.push("/admin/dashboard")
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          {/* Theme Toggle */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={toggleDark}
              className="rounded-lg p-2 transition hover:bg-gray-100 text-gray-400"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Hubb</h1>
            <p className="text-sm text-gray-600">
              Community Management Platform
            </p>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            <Globe size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">
                Or {mode === "signup" ? "sign up" : "sign in"} with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          {mode !== "magic" && (
            <form onSubmit={handleEmailSubmit}>
              {mode === "signup" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              )}
              <div style={{ marginBottom: "1rem" }}>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {(mode === "login" || mode === "signup") && (
                <div style={{ marginBottom: "1rem" }}>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === "signup" ? "At least 6 characters" : "••••••••"
                      }
                      required
                      minLength={mode === "signup" ? 6 : 1}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p
                  style={{ marginBottom: "1rem" }}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
              >
                <LogIn size={18} />
                {isLoading
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>
          )}

          {/* Magic Link Form */}
          {mode === "magic" && (
            <form onSubmit={handleMagicLink}>
              <div style={{ marginBottom: "1rem" }}>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              {error && (
                <p
                  style={{ marginBottom: "1rem" }}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </p>
              )}
              {magicSent ? (
                <p className="text-center text-sm text-emerald-600">
                  Check your email for the sign-in link!
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
                >
                  Send Magic Link
                </button>
              )}
            </form>
          )}

          {/* Mode switcher */}
          <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-gray-600">
            {mode === "login" && (
              <>
                <button
                  onClick={() => setMode("signup")}
                  className="w-full transition hover:text-gray-900"
                >
                  No account?{" "}
                  <span className="font-medium text-green-700 underline">
                    Create one
                  </span>
                </button>
                <button
                  onClick={() => setMode("magic")}
                  className="w-full transition hover:text-gray-900"
                >
                  Or sign in with a{" "}
                  <span className="font-medium text-green-700 underline">
                    magic link
                  </span>
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="w-full transition hover:text-gray-900"
              >
                Already have an account?{" "}
                <span className="font-medium text-green-700 underline">
                  Sign in
                </span>
              </button>
            )}
            {mode === "magic" && (
              <button
                onClick={() => setMode("login")}
                className="w-full transition hover:text-gray-900"
              >
                Back to{" "}
                <span className="font-medium text-green-700 underline">
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
