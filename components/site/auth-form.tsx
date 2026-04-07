"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type AuthMode = "login" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    // Client-side validation
    const parsed = signUpSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setError(
        "Authentication is not configured. Check environment variables.",
      );
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("Auth client unavailable.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: authError } = await client.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        setMessage(
          "Account created! Check your email to confirm, then sign in.",
        );
      } else {
        const { error: authError } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        const nextPath = searchParams.get("next");
        const safeNextPath =
          nextPath && nextPath.startsWith("/") ? nextPath : "/app/upload";

        router.push(safeNextPath);
        router.refresh();
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface-lowest p-8 shadow-ambient">
      {/* Mode Toggle */}
      <div className="mb-6 flex bg-surface-low p-1">
        {(["signup", "login"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ease-out ${
              mode === m
                ? "bg-foreground text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "signup" ? "Create Account" : "Sign In"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="label-sm text-muted-foreground">
            EMAIL ADDRESS
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-surface-low text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="label-sm text-muted-foreground">
            PASSWORD
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder={
              mode === "signup" ? "Min. 8 characters" : "Your password"
            }
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 bg-surface-low text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-foreground"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full"
          size="lg"
          disabled={loading}
        >
          {loading
            ? mode === "signup"
              ? "Creating Account..."
              : "Signing In..."
            : mode === "signup"
              ? "Create Account"
              : "Sign In"}
        </Button>

        {message && (
          <div className="bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
