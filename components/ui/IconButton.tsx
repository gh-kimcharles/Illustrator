import { cn } from "@/utils";

interface IconButtonProps {
  onClick?: () => void;
  title?: string;
  danger?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function IconButton({
  onClick,
  title,
  danger,
  children,
  className,
  size = "sm",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "editor-icon-btn",
        size === "md" && "w-7 h-7",
        danger &&
          "hover:bg-editor-danger-subtle hover:text-editor-danger hover:border-editor-danger/30",
        className,
      )}
    >
      {children}
    </button>
  );
}
