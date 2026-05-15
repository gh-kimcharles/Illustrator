"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopologyBackground from "@/components/ui/TopologyBackground";
import EditorMockup from "@/components/Landing/Mockups/EditorMockup";
import { EyeOutline, EyeSlashOutline } from "@/assets/icons";
import { GoogleLogo } from "@/assets/logos/google-logo";

const EyeIcon = ({ show }: { show: boolean }) => {
  return show ? (
    <EyeSlashOutline size={14} strokeWidth={2} />
  ) : (
    <EyeOutline size={14} strokeWidth={2} />
  );
};

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
            <GoogleLogo size={14} />
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
