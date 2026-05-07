import Link from "next/link";
import EditorMockup from "./EditorMockup";

const FEATURE_CHIPS = [
  "Layer compositing",
  "Gaussian blur",
  "Hue/Saturation",
  "Levels",
  "Undo/Redo",
  "Marquee selection",
  "Export PNG",
  "Cloud save",
  "Share via link",
];

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-10 pt-14 pb-16 gap-12 max-w-[1300px] mx-auto">
      {/* Left */}
      <div
        className="flex-none max-w-[460px] animate-[heroLeft_0.8s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ flex: "0 0 460px" }}
      >
        <div className="inline-flex items-center gap-2 text-[11.5px] text-editor-text-muted border border-editor-border-light px-3 py-1 rounded-full mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-editor-accent animate-[pulseDot_2s_ease_infinite]" />
          Browser-native · No install
        </div>

        <h1
          className="text-[52px] font-extrabold leading-[1.07] tracking-[-2px] mb-5"
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
            <span className="w-4 h-4 rounded-full bg-editor-bg inline-flex items-center justify-center text-[10px] text-editor-text">
              →
            </span>
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
      <div className="flex-1 min-w-0 animate-[heroRight_0.8s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
        <EditorMockup />
      </div>
    </section>
  );
}
