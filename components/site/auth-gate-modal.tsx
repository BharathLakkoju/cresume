"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client";

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type AuthMode = "login" | "signup";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export function AuthGateModal({ isOpen, onClose, reason }: AuthGateModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function switchMode(m: AuthMode) {
    setMode(m);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setError("Authentication is not configured.");
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
        const { error: authError } = await client.auth.signUp({ email, password });
        if (authError) throw authError;
        setMessage("Account created! Check your email to confirm, then sign in.");
      } else {
        const { error: authError } = await client.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        onClose();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="label-sm text-gray-500">UNLOCK UNLIMITED ACCESS</p>
                <p className="font-display text-lg font-bold">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {reason ??
                "You've used your 2 free evaluations. Sign up for unlimited ATS checks and saved history — completely free."}
            </p>

            {/* Mode toggle */}
            <div className="mt-5 flex rounded-xl bg-gray-100 p-1">
              {(["signup", "login"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                    mode === m
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {m === "signup" ? "Sign Up" : "Sign In"}
                </button>
              ))}
            </div>

            {message ? (
              <div className="mt-5 rounded-xl bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">{message}</p>
                <p className="mt-1 text-sm text-green-600">
                  After confirming, switch to &quot;Sign In&quot; above to continue.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gate-email" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </Label>
                  <Input
                    id="gate-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gate-password" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Password
                  </Label>
                  <Input
                    id="gate-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading
                    ? mode === "signup" ? "Creating Account..." : "Signing In..."
                    : mode === "signup" ? "Create Account" : "Sign In"}
                </Button>

                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
