import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(false);

    // signIn() from next-auth/react
    // POST /api/auth/signin/credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh(); // refresh server components to pick up new session
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-editor-bg">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[oklch(0.10_0.05_240)] text-editor-accent text-xl font-bold mb-3">
            Ill
          </div>
          <h1 className="text-xl font-semibold text-editor-text">
            Sign in to Illustrator
          </h1>
          <p className="text-[13px] text-editor-text-muted mt-1">
            Welcome back
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-editor-panel border border-editor-border p-6 space-y-4"
        >
          {error && (
            <div className="bg-editor-danger-subtle border border-editor-danger/30 text-editor-danger text-[12px] px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] text-editor-text-muted uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full editor-input px-3 py-2 text-[13px]"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-editor-text-muted uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full editor-input px-3 py-2 text-[13px]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-editor-accent hover:bg-editor-accent-hover text-white py-2 text-[13px] font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[12px] text-editor-text-muted mt-4">
          No account?{" "}
          <Link href="/register" className="text-editor-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
