"use client";

import Link from "next/link";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-10 h-14 border-b border-editor-border-light backdrop-blur-md bg-editor-bg/90">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-bold text-base tracking-tight text-editor-text no-underline"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <LogoBars />
        Illustrator
      </Link>

      {/* <ul className="flex gap-1 list-none">
        {["Product", "Use Cases", "Resources"].map((item) => (
          <li key={item}>
            <Link
              href="#"
              className="text-[13px] text-editor-text-muted px-3 py-1.5 rounded-md transition-colors hover:bg-editor-hover hover:text-editor-text no-underline"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul> */}

      <div className="flex gap-2 items-center">
        <Link
          href="/login"
          className="text-[13px] text-editor-text-muted border border-editor-border-light px-4 py-1.5 rounded-md transition-all hover:text-editor-text hover:border-white/25 no-underline"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-[13px] font-medium text-white bg-editor-accent px-4 py-1.5 rounded-md transition-all hover:bg-editor-accent-hover hover:-translate-y-px no-underline"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}

function LogoBars() {
  return (
    <div className="flex gap-[3px] items-end h-[18px]">
      <span className="w-[3px] h-[10px] bg-editor-accent rounded-full" />
      <span className="w-[3px] h-[16px] bg-editor-accent rounded-full" />
      <span className="w-[3px] h-[7px] bg-editor-accent rounded-full" />
    </div>
  );
}
