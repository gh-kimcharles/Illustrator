"use client";

import Link from "next/link";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-20 h-16 border-b border-editor-border-light backdrop-blur-md bg-editor-bg/90">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-editor-text no-underline"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        {/* Logo */}
        <div className="w-9 h-full flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-[11px] font-bold tracking-wide flex-shrink-0">
          Ill
        </div>
        Illustrator
      </Link>

      <div className="flex gap-2.5 items-center">
        <Link
          href="/login"
          className="text-[14px] text-editor-text-muted border border-editor-border-light px-4 py-1.5 rounded-md transition-all hover:text-editor-text hover:border-white/25 no-underline"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-[14px] font-medium text-white bg-editor-accent px-4 py-1.5 rounded-md transition-all hover:bg-editor-accent-hover hover:-translate-y-px no-underline"
        >
          Get started for free
        </Link>
      </div>
    </nav>
  );
}
