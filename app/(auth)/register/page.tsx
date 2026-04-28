"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // custom register endpoint
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Registration failed");
        setLoading(false);
        return;
      }

      // auto sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // registration succeeded but sign-in failed - send to login
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
            Create your account
          </h1>
          <p className="text-[13px] text-editor-text-muted mt-1">
            Free forever
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
              Name <span className="normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full editor-input px-3 py-2 text-[13px]"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              className="w-full editor-input px-3 py-2 text-[13px]"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-editor-accent hover:bg-editor-accent-hover text-white py-2 text-[13px] font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-[12px] text-editor-text-muted mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-editor-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
