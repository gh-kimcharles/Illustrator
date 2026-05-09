import Link from "next/link";
import EditorMockup from "./Mockups/EditorMockup";
import TopologyBackground from "../ui/TopologyBackground";

const FEATURE_CHIPS = [
  {
    label: "HTML5 Canvas",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="1" width="12" height="12" rx="1.5" />
        <path d="M4 9.5L6.5 5L9 9.5" />
        <path d="M4.8 8h3.4" />
      </svg>
    ),
  },
  {
    label: "Layers",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 5l6-3 6 3-6 3-6-3Z" />
        <path d="M1 9l6 3 6-3" />
      </svg>
    ),
  },
  {
    label: "Tools",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 2L12 5L5 12L2 12L2 9L9 2Z" />
      </svg>
    ),
  },
  {
    label: "Adjustment Filters",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M1 3h12M3 7h8M5 11h4" />
      </svg>
    ),
  },
  {
    label: "Export PNG",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 1v8M4 6l3 3 3-3" />
        <path d="M2 11h10" />
      </svg>
    ),
  },
  {
    label: "Cloud save",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.5 11H4a2.5 2.5 0 0 1-.4-5 3.5 3.5 0 0 1 6.8-1 2 2 0 0 1 .1 6Z" />
      </svg>
    ),
  },
  {
    label: "Share via link",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 8.5a3 3 0 0 0 4.2 0l1.5-1.5a3 3 0 0 0-4.2-4.2L6 3.8" />
        <path d="M8.5 5.5a3 3 0 0 0-4.2 0L2.8 7A3 3 0 0 0 7 11.2L8 10.2" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  return (
    // bg-transparent lets the TopologyBackground canvas show
    // still `relative` so the absolute canvas inside is positioned correctly
    <section className="relative min-h-screen flex flex-col px-25 pt-24 pb-16 overflow-hidden bg-transparent">
      {/* add: manual implementation of TopologyBackground; no external libraries used */}
      <TopologyBackground />

      <div className="flex items-center gap-12 flex-1">
        <div
          className="relative flex-none max-w-[650px] animate-[heroLeft_0.8s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ flex: "0 0 650px" }}
        >
          <h1
            className="text-[56px] font-semibold leading-[1.2] tracking-[-1px] mb-5"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Desktop-class editing{" "}
            <em
              className="italic font-light"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              right in your browser.
            </em>
          </h1>

          <p
            className="text-[24px] text-editor-text-muted leading-[1.5] mb-8 max-w-[520px] font-light"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Everything you need to edit, made accessible for everyone.
          </p>

          <div className="flex gap-3 items-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-2.5 rounded-lg bg-editor-text text-editor-bg no-underline transition-all hover:opacity-90 hover:-translate-y-px"
            >
              Create free account
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 text-[14px] text-editor-text-muted px-6 py-2.5 rounded-lg border border-editor-border-light no-underline transition-all hover:text-editor-text hover:border-white/25"
            >
              Try without account
            </Link>
          </div>
        </div>

        <div className="relative flex-1 flex justify-end animate-[heroRight_0.8s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="w-full max-w-[850px] pr-10">
            <EditorMockup />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h2
          className="text-[16px] text-editor-text-muted leading-[1.5] mb-4 max-w-[520px] font-light"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Built-in tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {FEATURE_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 text-[18px] text-editor-text-muted backdrop-blur-sm px-3 py-1.5 rounded-md [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:flex-shrink-0 border border-editor-border-light bg-editor-panel"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
