import Link from "next/link";
import EditorMockup from "./Mockups/EditorMockup";
import TopologyBackground from "../ui/TopologyBackground";
import {
  AdjustmentsHorizontalSolid,
  CloudArrowDownSolid,
  InboxArrowDownSolid,
  LinkSolid,
  RectangleGroupSolid,
  SquareStackSolid,
  WrenchScrewdriverSolid,
} from "@/assets/icons";

const FEATURE_CHIPS = [
  {
    label: "HTML5 Canvas",
    icon: <RectangleGroupSolid />,
  },
  {
    label: "Layers",
    icon: <SquareStackSolid />,
  },
  {
    label: "Tools",
    icon: <WrenchScrewdriverSolid />,
  },
  {
    label: "Adjustment Filters",
    icon: <AdjustmentsHorizontalSolid />,
  },
  {
    label: "Export PNG",
    icon: <InboxArrowDownSolid />,
  },
  {
    label: "Cloud save",
    icon: <CloudArrowDownSolid />,
  },
  {
    label: "Share via link",
    icon: <LinkSolid />,
  },
];

export default function HeroSection() {
  return (
    // bg-transparent lets the TopologyBackground canvas show
    // still `relative` so the absolute canvas inside is positioned correctly
    <section className="relative min-h-screen flex flex-col px-25 pt-24 pb-16 overflow-hidden bg-transparent">
      {/* update: vanta implementation */}
      {/* https://www.vantajs.com/?effect=topology#(backgroundAlpha:1,backgroundColor:#09090b,color:#71717a,gyroControls:!f,minHeight:200,minWidth:200,mouseControls:!t,scale:1,scaleMobile:1,touchControls:!t) */}
      <TopologyBackground />

      <div className="flex items-center gap-12 flex-1">
        <div
          className="relative flex-none max-w-[650px] animate-[heroLeft_0.8s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ flex: "0 0 650px" }}
        >
          <h1 className="text-[56px] font-semibold font-rethink-sans leading-[1.2] tracking-[-1px] mb-5">
            Desktop-class editing,{" "}
            <em className="italic font-light font-instrument-serif">
              right in your browser.
            </em>
          </h1>

          <p className="text-[24px] font-inter font-light text-editor-text-muted mb-8 max-w-[520px]">
            Everything you need to edit, made accessible for everyone.
          </p>

          <div className="flex gap-3 items-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-[16px] font-medium px-6 py-2.5 rounded-lg bg-editor-text text-editor-bg no-underline transition-all hover:opacity-90 hover:-translate-y-px"
            >
              Create free account
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 text-[16px] text-editor-text-muted px-6 py-2.5 rounded-lg border border-editor-border-light no-underline transition-all hover:text-editor-text hover:border-white/25"
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
        <h2 className="text-[16px] font-inter font-light text-editor-text-muted leading-[1.5] mb-4 max-w-[520px]">
          Built-in tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {FEATURE_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 text-[18px] font-inter text-editor-text-muted pr-5 py-1.5 rounded-md [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:flex-shrink-0"
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
