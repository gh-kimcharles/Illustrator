"use client";

import { useEffect } from "react";
import { cn } from "@/utils";

interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  title,
  onClose,
  children,
  footer,
  className,
}: DialogProps) {
  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escapse") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "bg-editor-panel border border-editor-border-light shadow-2xl flex flex-col",
          className ?? "w-80",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-editor-panel-header border-b border-editor-border flex-shrink-0">
          <h2 className="text-[13px] font-semibold text-editor-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-editor-text-muted hover:text-editor-text text-[16px] leading-none transition-colors w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 px-4 pb-4 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable dialog button */
export function DialogButton({
  onClick,
  variant = "default",
  children,
}: {
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-[12px] transition-colors",
        variant === "primary" &&
          "bg-editor-accent text-white hover:bg-editor-accent-hover",
        variant === "danger" &&
          "bg-editor-danger/80 text-white hover:bg-editor-danger",
        variant === "default" &&
          "border border-editor-border-light text-editor-text-muted hover:bg-editor-hover hover:text-editor-text",
      )}
    >
      {children}
    </button>
  );
}
