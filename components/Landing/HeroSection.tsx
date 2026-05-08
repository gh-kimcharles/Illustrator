import Link from "next/link";
import EditorMockup from "./Mockups/EditorMockup";

const FEATURE_CHIPS = [
  "HTML5 Canvas",
  "Layers",
  "Tools",
  "Adjustment Filters",
  "Export PNG",
  "Cloud save",
  "Share via link",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col px-25 pt-14 pb-16 overflow-hidden">
      {/* Main hero row */}
      {/* Fading checker background */}
      <div
        className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='32' height='32' fill='rgba(255,255,255,0.07)'/%3E%3Crect x='32' y='32' width='32' height='32' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E")`,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />

      <div className="flex items-center gap-12 flex-1">
        {/* Left */}
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
              style={{
                fontFamily: "var(--font-instrument-serif)",
              }}
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

        {/* Right */}
        <div className="relative flex-1 flex justify-end animate-[heroRight_0.8s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="w-full max-w-[850px] pr-10">
            <EditorMockup />
          </div>
        </div>
      </div>

      {/* Featured chips */}
      <div className="relative z-10 pt-10">
        {/* <h2
          className="text-[13px] tracking-[0.18em] text-editor-text-muted/60 mb-4"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Features include
        </h2> */}

        <div className="flex flex-wrap gap-2">
          {FEATURE_CHIPS.map((chip) => (
            <span
              key={chip}
              className="text-[13px] text-editor-text-muted border border-editor-border-light bg-editor-panel/70 backdrop-blur-sm px-3 py-1.5 rounded-md"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
