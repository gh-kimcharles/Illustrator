"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TopologyBackground from "@/components/ui/TopologyBackground";
import EditorMockup from "@/components/Landing/Mockups/EditorMockup";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
    // ref: Demo: Login - Flow
    // https://shadcn-nextjs-flow-landing-page.vercel.app/login
    <div className="min-h-screen flex bg-editor-bg">
      {/* Left panel: topology + mockup */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden overflow-x-hidden">
        <TopologyBackground />
        {/* Decorative arc */}
        <div
          className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-editor-border-light opacity-20"
          style={{ boxShadow: "0 0 0 60px rgba(255,255,255,0.015)" }}
        />
        <div className="relative w-full max-w-[850px] z-10 px-10">
          <EditorMockup />
        </div>
      </div>

      {/* Right panel: form */}
      <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col items-center justify-center px-10 py-12 bg-editor-bg border-l border-editor-border">
        {/* Logo */}
        <div className="w-full max-w-[360px]">
          <div className="flex items-center gap-2.5 mb-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold font-rethink-sans text-base text-[20px] tracking-tight text-editor-text no-underline"
            >
              {/* Logo */}
              <div className="w-9 h-full flex items-center justify-center font-bold bg-[oklch(0.10_0.05_240)] text-editor-accent text-[11px] tracking-wide flex-shrink-0">
                Ill
              </div>
              Illustrator
            </Link>
          </div>

          <h1 className="text-[22px] font-rethink-sans font-semibold text-editor-text mb-1">
            Sign in to Illustrator
          </h1>
          <p className="text-[13px] font-inter text-editor-text-muted mb-7">
            Enter your email below to login to your account
          </p>

          {/* OAuth */}
          <div className="mb-5">
            <button className="w-full h-9 flex items-center justify-center gap-2 border border-editor-border-light rounded-md text-[12px] text-editor-text hover:bg-editor-hover transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-editor-border" />
            <span className="text-[11px] text-editor-text-muted">or</span>
            <div className="flex-1 h-px bg-editor-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-editor-danger-subtle border border-editor-danger/30 text-editor-danger text-[12px] px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] text-editor-text mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full editor-input px-3 py-2 text-[13px] rounded-md"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-[13px] text-editor-text mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full editor-input px-3 py-2 text-[13px] rounded-md"
                placeholder="••••••••••••••••"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRememberMe((v) => !v)}
                  className={`w-3.5 h-3.5 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                    rememberMe
                      ? "bg-editor-accent border-editor-accent"
                      : "bg-editor-input-bg border-editor-border-light hover:border-editor-accent/50"
                  }`}
                >
                  {rememberMe && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path
                        d="M1 3.5L3.5 6L8 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span
                  onClick={() => setRememberMe((v) => !v)}
                  className="text-[12px] text-editor-text-muted cursor-pointer select-none"
                >
                  Remember Me
                </span>
              </div>

              <div>
                <button
                  type="button"
                  className="text-[12px] text-editor-text-muted hover:text-editor-text transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-editor-accent hover:bg-editor-accent-hover py-2.5 text-[13px] font-medium transition-colors disabled:opacity-60 rounded-md mt-1"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-[13px] text-editor-text-muted mt-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-editor-accent font-medium hover:underline underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
