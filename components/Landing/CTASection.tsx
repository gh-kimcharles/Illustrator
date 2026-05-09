import Link from "next/link";

export default function CTASection() {
  return (
    <div className="mx-10 mb-24 border border-editor-border-light rounded-2xl bg-editor-panel p-20 flex items-center justify-between gap-10">
      <div className="max-w-[520px]">
        <h2
          className="text-[36px] font-extrabold tracking-[-1.5px] leading-[1.1] mb-4"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Start editing in seconds.
          <br />
          No download needed.
        </h2>
        <p className="text-[15px] text-editor-text-muted leading-[1.7] font-light">
          Open your browser, create an account, and start editing. Your files
          live in the cloud — available from any device, any time.
        </p>
        <div className="flex gap-3 mt-8 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-2.5 rounded-lg bg-editor-text text-editor-bg no-underline transition-all hover:bg-white/90 hover:-translate-y-px"
          >
            Create free account →
          </Link>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 text-[14px] text-editor-text-muted px-6 py-2.5 rounded-lg border border-editor-border-light no-underline transition-all hover:text-editor-text hover:border-white/25"
          >
            Try without account
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-shrink-0">
        <div className="bg-editor-panel-header border border-editor-border-light rounded-xl p-4 min-w-[180px]">
          <div
            className="text-[28px] font-extrabold mb-1"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Free
          </div>
          <div className="text-[12px] text-editor-text-muted">
            Forever. No credit card.
          </div>
        </div>
        <div className="bg-editor-accent-subtle border border-editor-accent-border rounded-xl p-4">
          <div
            className="text-[28px] font-extrabold mb-1"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Pro
          </div>
          <div className="text-[12px] text-editor-text-muted">
            Coming soon — advanced tools + AI.
          </div>
        </div>
      </div>
    </div>
  );
}
