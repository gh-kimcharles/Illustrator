import { cn } from "@/utils";

interface ToolButtonProps {
  active?: boolean;
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolButton({
  active,
  onClick,
  title,
  children,
  className,
}: ToolButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        title={title}
        className={cn(
          "editor-tool-btn",
          active && "editor-tool-btn-active",
          className,
        )}
      >
        {children}
      </button>

      {title && (
        <div
          className="
          absolute left-[46px] top-1/2 -translate-y-1/2
          bg-editor-panel-header border border-editor-border-light
          px-2 py-1 whitespace-nowrap text-[11px] text-editor-text
          pointer-events-none opacity-0 group-hover:opacity-100
          z-50 transition-opacity duration-150 shadow-lg
        "
        >
          {title}
        </div>
      )}
    </div>
  );
}
