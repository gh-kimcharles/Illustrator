import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-editor-border-light px-10 py-10 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-bold text-sm text-editor-text no-underline"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <div className="flex gap-[3px] items-end h-[16px]">
          <span className="w-[3px] h-[9px]  bg-editor-accent rounded-full" />
          <span className="w-[3px] h-[14px] bg-editor-accent rounded-full" />
          <span className="w-[3px] h-[6px]  bg-editor-accent rounded-full" />
        </div>
        Illustrator
      </Link>

      <div className="flex gap-6">
        {["Privacy", "Terms", "GitHub", "Contact"].map((link) => (
          <Link
            key={link}
            href="#"
            className="text-[12px] text-editor-text-muted no-underline transition-colors hover:text-editor-text"
          >
            {link}
          </Link>
        ))}
      </div>

      <p className="text-[12px] text-editor-text-disabled">
        Built by Kim Charles De Guzman
      </p>
    </footer>
  );
}
