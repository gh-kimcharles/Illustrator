"use client";

import { formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  thumbnail: string | null;
  isShared: boolean;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ProjectCard({ project }: { project: ProjectCardProps }) {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(project.isShared);
  const [shareToken, setShareToken] = useState(project.shareToken);

  // delete
  async function handleDelete() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh(); // re-run server component to get updated list
  }

  // toggle share
  async function handleToggleShare() {
    setBusy(true);
    if (isShared) {
      await fetch(`/api/projects/${project.id}/share`, { method: "DELETE" });
      setIsShared(false);
      setShareToken(null);
    } else {
      const res = await fetch(`/api/projects/${project.id}/share`, {
        method: "POST",
      });
      const json = await res.json();
      setIsShared(true);
      setShareToken(json.shareToken);
    }
    setBusy(false);
  }

  // copy share line
  async function handleCopyLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/share/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const formattedDate = formatDate(project.updatedAt);

  return (
    <div className="group bg-editor-panel border border-editor-border hover:border-editor-border-light transition-colors">
      {/* Thumbnail */}
      <Link href={`/editor?projectId=${project.id}`}>
        <div className="relative aspect-video bg-editor-canvas-bg overflow-hidden">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl text-editor-text-disabled">🖼</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[12px] font-medium">Open</span>
          </div>
        </div>
      </Link>

      {/* Info + actions */}
      <div className="p-3">
        <p className="text-[13px] text-editor-text font-medium truncate mb-0.5">
          {project.name}
        </p>
        <p className="text-[11px] text-editor-text-muted mb-3">
          {formattedDate}
        </p>

        <div className="flex items-center gap-1.5">
          {/* Share toggle */}
          <button
            onClick={handleToggleShare}
            disabled={busy}
            title={isShared ? "Disable sharing" : "Enable sharing"}
            className={`text-[10px] px-2 py-1 border transition-colors ${
              isShared
                ? "border-editor-accent/40 text-editor-accent bg-editor-accent-subtle"
                : "border-editor-border-light text-editor-text-muted hover:bg-editor-hover"
            }`}
          >
            {isShared ? "Shared" : "Share"}
          </button>

          {/* Copy link — only when shared */}
          {isShared && shareToken && (
            <button
              onClick={handleCopyLink}
              title="Copy share link"
              className="text-[10px] px-2 py-1 border border-editor-border-light text-editor-text-muted hover:bg-editor-hover transition-colors"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={busy}
            title="Delete project"
            className="text-[10px] px-2 py-1 border border-transparent text-editor-text-disabled hover:border-editor-danger/30 hover:text-editor-danger hover:bg-editor-danger-subtle transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
