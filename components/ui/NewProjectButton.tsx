"use client";

import { useRouter } from "next/navigation";

export function NewProjectButton({ compact }: { compact?: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/editor")}
      className={`bg-editor-accent hover:bg-editor-accent-hover text-white font-inter text-[13px] font-medium transition-colors rounded-md ${
        compact ? "px-3 py-1.5" : "w-full px-3 py-2"
      }`}
    >
      New file
    </button>
  );
}
