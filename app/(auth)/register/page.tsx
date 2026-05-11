"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopologyBackground from "@/components/ui/TopologyBackground";
import EditorMockup from "@/components/Landing/Mockups/EditorMockup";

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please agree to the privacy policy & terms");
      return;
    }
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
    // ref: Demo: Register - Flow
    // https://shadcn-nextjs-flow-landing-page.vercel.app/register
    <div className="min-h-screen flex bg-editor-bg">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden overflow-x-hidden">
        <TopologyBackground />
        <div
          className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-editor-border-light opacity-20"
          style={{ boxShadow: "0 0 0 60px rgba(255,255,255,0.015)" }}
        />
        <div className="relative w-full max-w-[850px] z-10 px-10">
          <EditorMockup />
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col items-center justify-center px-10 py-12 bg-editor-bg border-l border-editor-border overflow-y-auto">
        <div className="w-full max-w-[360px]">
          {/* Logo */}
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

          <h1 className="text-[22px] font-semibold text-editor-text mb-1">
            Create your account
          </h1>
          <p className="text-[13px] text-editor-text-muted mb-7">
            Enter your information below to create your account
          </p>

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
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-editor-border" />
            <span className="text-[11px] text-editor-text-muted">or</span>
            <div className="flex-1 h-px bg-editor-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-editor-danger-subtle border border-editor-danger/30 text-editor-danger text-[12px] px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] text-editor-text mb-2">
                Full Name{" "}
                <span className="normal-case text-editor-text-muted">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full editor-input px-3 py-2 text-[13px] rounded-md"
                placeholder="Enter your username"
              />
            </div>

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
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full editor-input px-3 py-2 pr-9 text-[13px] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editor-text-muted hover:text-editor-text transition-colors"
                >
                  <EyeIcon show={showPass} />
                </button>
              </div>
            </div>

            <p className="text-[12px] text-editor-text-muted mt-2 mb-6">
              Must be at least 8 characters long.
            </p>

            <div>
              <label className="block text-[13px] text-editor-text mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full editor-input px-3 py-2 pr-9 text-[13px] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editor-text-muted hover:text-editor-text transition-colors"
                >
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
            </div>

            <p className="text-[12px] text-editor-text-muted mt-2.5 mb-6">
              Please confirm your password.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAgreed((v) => !v)}
                className={`w-3.5 h-3.5 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                  agreed
                    ? "bg-editor-accent border-editor-accent"
                    : "bg-editor-input-bg border-editor-border-light hover:border-editor-accent/50"
                }`}
              >
                {agreed && (
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
                onClick={() => setAgreed((v) => !v)}
                className="text-[12px] text-editor-text-muted cursor-pointer select-none"
              >
                I agree to{" "}
                <span className="text-editor-text hover:underline underline-offset-4">
                  Terms &amp; Policy.
                </span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-editor-accent hover:bg-editor-text-muted text-white py-2.5 text-[13px] font-medium transition-colors disabled:opacity-60 rounded-md"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-[13px] text-editor-text-muted mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-editor-accent font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
