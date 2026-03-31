import type { Metadata } from "next";
import { AuthForm } from "@/components/site/auth-form";

export const metadata: Metadata = {
  title: "Sign In — ATS Precision",
  description:
    "Sign in or create an account to unlock unlimited ATS evaluations.",
};

export default function AuthPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center px-4 py-16">
      <div className="container max-w-md">
        <div className="text-center">
          <p className="label-sm text-muted-foreground">GET STARTED FREE</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-foreground">
            Welcome
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Create an account or sign in to unlock unlimited evaluations and
            cloud-synced history.
          </p>
        </div>
        <div className="mt-10">
          <AuthForm />
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          2 free evaluations available without an account.{" "}
          <div>
            <a
              href="/app/upload"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Try without signing in →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
