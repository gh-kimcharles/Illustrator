import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Project } from "./DashboardClient";
import { formatDate } from "@/utils";

export function ProjectListRow({ project }: { project: Project }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Link
      href={`/editor?projectId=${project.id}`}
      className="grid grid-cols-[auto_1fr_120px_120px_100px] gap-4 px-4 py-2.5 border-b border-editor-border last:border-0 hover:bg-editor-hover transition-colors items-center group"
    >
      {/* Thumb */}
      <div className="w-10 h-7 bg-editor-canvas-bg rounded overflow-hidden flex-shrink-0 border border-editor-border-light">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.name}
            width={40}
            height={28}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-editor-text-disabled">
            🖼
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-[13px] text-editor-text truncate">
        {project.name}
      </span>

      {/* Modified */}
      <span className="text-[12px] text-editor-text-muted">
        {formatDate(project.updatedAt)}
      </span>

      {/* Created */}
      <span className="text-[12px] text-editor-text-muted">
        {formatDate(project.createdAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          disabled={busy}
          className="text-[11px] px-2 py-0.5 border border-transparent text-editor-text-disabled hover:border-editor-danger/30 hover:text-editor-danger hover:bg-editor-danger-subtle transition-colors rounded"
        >
          Delete
        </button>
      </div>
    </Link>
  );
}
