import Link from "next/link";

export default function CTASection() {
  return (
    <div className="max-w-7xl mx-auto mb-24  rounded-2xl bg-editor-panel p-20 flex items-center justify-between gap-10">
      <div className="max-w-[520px]">
        <h2 className="text-[36px] font-rethink-sans tracking-[-1.5px]  mb-4">
          Start editing in seconds.
          <br />
          No download needed.
        </h2>
        <p className="text-[15px] text-editor-text-muted leading-[1.7] font-light font-inter">
          Open your browser, create an account, and start editing. Your files
          live in the cloud, available from any device, any time.
        </p>
        <div className="flex gap-3 mt-8 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-2.5 rounded-lg bg-editor-text text-editor-bg no-underline transition-all hover:bg-white/90 hover:-translate-y-px"
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
    </div>
  );
}
