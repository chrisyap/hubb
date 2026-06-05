"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";
import { Mail, Lock, LogIn, Globe } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    loginWithGoogle,
    loginWithEmail,
    signUp,
    sendMagicLink,
  } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-4xl font-serif">Hubb</CardTitle>
          <CardDescription>Community Management Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign-In */}
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Globe size={18} className="mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or {mode === "signup" ? "sign up" : "sign in"} with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          {mode !== "magic" && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {mode === "login" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <LogIn size={18} className="mr-2" />
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
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                  id="magic-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {magicSent ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center">
                  Check your email for the sign-in link!
                </p>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  Send Magic Link
                </Button>
              )}
            </form>
          )}

          {/* Mode switcher */}
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                <button
                  onClick={() => setMode("signup")}
                  className="hover:text-foreground transition"
                >
                  No account? <span className="underline">Create one</span>
                </button>
                <button
                  onClick={() => setMode("magic")}
                  className="hover:text-foreground transition"
                >
                  Or sign in with a <span className="underline">magic link</span>
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="hover:text-foreground transition"
              >
                Already have an account? <span className="underline">Sign in</span>
              </button>
            )}
            {mode === "magic" && (
              <button
                onClick={() => setMode("login")}
                className="hover:text-foreground transition"
              >
                Back to <span className="underline">password sign-in</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
