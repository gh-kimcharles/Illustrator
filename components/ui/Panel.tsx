"use client";

import { cn } from "@/utils";
import { useState } from "react";

interface PanelProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Panel({
  title,
  defaultOpen = true,
  className,
  children,
}: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("editor-panel-section", className)}>
      <button onClick={() => setOpen(!open)} className="editor-panel-header">
        <span className="editor-panel-title">{title}</span>
        <span
          className="text-[10px] text-editor-text-muted transition-transform duration-150"
          style={{
            display: "inline-block",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          ▾
        </span>
      </button>

      {open && <div className="p-2.5">{children}</div>}
    </div>
  );
}
