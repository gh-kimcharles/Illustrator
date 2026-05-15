"use client";

import { ChevronDownOutline } from "@/assets/icons";
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

        <ChevronDownOutline
          size={12}
          className={`text-editor-text-muted ${
            open ? "rotate-0" : "rotate-270"
          }`}
        />
      </button>

      {open && <div className="p-2.5">{children}</div>}
    </div>
  );
}
