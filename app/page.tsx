import Link from "next/link";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-editor-bg text-editor-text flex flex-col">
      {/* nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-editor-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-sm font-bold">
            Ill
          </div>
          <span className="text-[15px] font-semibold">Illustrator</span>
        </div>

        <div className="flex items-center gap-4">
          <link
            href="/login"
            className="text-[13px] text-editor-text-muted hover:text-editor-text transition-colors"
          >
            Sign in
          </link>
          <Link
            href="/register"
            className="text-[13px] bg-editor-accent hover:bg-editor-accent-hover text-white px-4 py-1.5 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold text-editor-text mb-4 max-w-xl leading-tight">
          A Photoshop-like editor, right in your browser
        </h1>
        <p className="text-[15px] text-editor-text-muted max-w-md mb-8">
          Layers, filters, adjustments, undo history — all free, all in the
          browser. No install required.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="bg-editor-accent hover:bg-editor-accent-hover text-white px-6 py-2.5 text-[14px] font-medium transition-colors"
          >
            Create free account
          </Link>
          <Link
            href="/editor"
            className="border border-editor-border-light text-editor-text-muted hover:text-editor-text hover:bg-editor-hover px-6 py-2.5 text-[14px] transition-colors"
          >
            Try without account
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {[
            "Layer compositing",
            "Gaussian blur",
            "Hue/Saturation",
            "Levels",
            "Undo/Redo",
            "Marquee selection",
            "Export PNG",
            "Cloud save",
            "Share via link",
          ].map((f) => (
            <span
              key={f}
              className="text-[11px] text-editor-text-muted border border-editor-border-light px-3 py-1"
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-editor-border text-center">
        <p className="text-[11px] text-editor-text-disabled">
          Built by Kim Charles De Guzman
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
