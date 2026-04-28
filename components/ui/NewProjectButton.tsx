"use client";

import { useRouter } from "next/router";

// new project button
// navigates to the editor with no projectId - creates a fresh canvas
export function NewProjectButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/editor")}
      className="bg-editor-accent hover:bg-editor-accent-hover text-white px-4 py-2 text-[13px] font-medium transition-colors"
    >
      + New Project
    </button>
  );
}
