import Link from "next/link";
import EditorMockup from "./EditorMockup";

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
    <section className="relative min-h-screen flex items-center px-20 pt-14 pb-16 gap-12 mx-auto overflow-hidden">
      {/* Fading checker background */}
      <div
        className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='32' height='32' fill='rgba(255,255,255,0.07)'/%3E%3Crect x='32' y='32' width='32' height='32' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E")`,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 95%)",
        }}
      />

      {/* Left */}
      <div
        className="relative flex-none max-w-[460px] animate-[heroLeft_0.8s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ flex: "0 0 460px" }}
      >
        <h1
          className="text-[56px] font-bold leading-[1.08] tracking-[-1px] mb-5"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Photoshop-level editing,{" "}
          <em className="not-italic font-light text-editor-text-muted">
            right in your browser.
          </em>
        </h1>

        <p className="text-[15px] text-editor-text-muted leading-[1.7] mb-8 max-w-[380px] font-light">
          Layers, filters, adjustments, undo history — all free, all in the
          browser. Powerful enough for professionals. Simple enough for
          everyone.
        </p>

        <div className="flex gap-3 items-center mb-12">
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

        <div className="flex flex-wrap gap-1.5">
          {FEATURE_CHIPS.map((chip) => (
            <span
              key={chip}
              className="text-[11px] text-editor-text-muted border border-editor-border-light px-2.5 py-1 rounded-md bg-editor-panel"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Right — animated editor */}
      <div className="relative flex-1 flex justify-end animate-[heroRight_0.8s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="w-full max-w-[850px] pr-10">
          <EditorMockup />
        </div>
      </div>
    </section>
  );
}
