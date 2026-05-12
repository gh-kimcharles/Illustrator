"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";
import { NewProjectButton } from "./NewProjectButton";
import { ProjectCard } from "./ProjectCard";

type Project = {
  id: string;
  name: string;
  thumbnail: string | null;
  isShared: boolean;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type SortKey = "recent" | "name" | "created";
type ViewMode = "grid" | "list";
type NavSection = "recent" | "yours" | "shared" | "deleted";

const NAV_ITEMS: { key: NavSection; label: string; icon: React.ReactNode }[] = [
  {
    key: "recent",
    label: "Recent",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: "yours",
    label: "Your files",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
  },
  {
    key: "shared",
    label: "Shared with you",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "deleted",
    label: "Deleted",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    ),
  },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "name", label: "Name" },
  { key: "created", label: "Date created" },
];

// List view
function ProjectListView({ projects }: { projects: Project[] }) {
  return (
    <div className="border border-editor-border rounded overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_120px_120px_100px] gap-4 px-4 py-2 bg-editor-panel-header border-b border-editor-border">
        {["", "Name", "Modified", "Created", ""].map((h, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold uppercase tracking-wide text-editor-text-muted"
          >
            {h}
          </span>
        ))}
      </div>
      {/* Rows */}
      {projects.map((project) => (
        <ProjectListRow key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectListRow({ project }: { project: Project }) {
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

export function DashboardClient({
  projects,
  userEmail,
  userName,
}: {
  projects: Project[];
  userEmail: string;
  userName: string;
}) {
  const [activeNav, setActiveNav] = useState<NavSection>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [sortAsc, setSortAsc] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const sectionTitle: Record<NavSection, string> = {
    recent: "Recent",
    yours: "Your Files",
    shared: "Shared with you",
    deleted: "Deleted",
  };

  // filter by nav section
  let filtered = projects.filter((p) => {
    if (activeNav === "shared") return p.isShared;
    return true; // recent / yours / deleted all show everything for now
  });

  // filter by match
  if (filterText.trim()) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }

  // sort
  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "created")
      cmp = a.createdAt.valueOf() - b.createdAt.valueOf();
    else cmp = b.updatedAt.valueOf() - a.updatedAt.valueOf(); // recent
    return sortAsc ? cmp : -cmp;
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (userEmail[0]?.toUpperCase() ?? "U");

  return (
    <div className="h-screen flex flex-col bg-editor-bg text-editor-text overflow-hidden">
      {/* Top bar */}
      <header className="h-15 bg-editor-menubar border-b border-editor-border flex items-center px-3 gap-3 flex-shrink-0">
        {/* Logo */}
        <div className="w-7 h-7 flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-[12px] font-bold rounded-sm flex-shrink-0">
          Ill
        </div>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-editor-text-muted hidden sm:block">
            {userEmail}
          </span>
          <button
            className="text-[12px] text-editor-text-muted hover:text-editor-text transition-colors"
            onClick={handleSignOut}
          >
            Sign out
          </button>
          {/* Avatar */}
          <div className="w-7 h-7 rounded bg-editor-accent flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
            {initials}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56  flex flex-col flex-shrink-0 overflow-y-auto py-6.5 px-4.5">
          {/* New file */}
          <div className="flex flex-col gap-2.5">
            <NewProjectButton />
            <button className="w-full px-3 py-1.5 flex items-center justify-center border border-editor-border-light rounded-md text-[13px] font-inter text-editor-text hover:bg-editor-hover transition-colors">
              Open
            </button>
          </div>

          <div className=" py-3">
            <hr className="border-editor-border" />
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveNav(key)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12px] transition-colors text-left w-full ${
                  activeNav === key
                    ? "bg-editor-accent-subtle text-editor-accent"
                    : "text-editor-text-muted hover:bg-editor-hover hover:text-editor-text"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-shrink-0 py-6.5 px-25">
            {/* Left */}
            <div className="flex flex-col gap-2">
              {/* Title */}
              <h1 className="text-[16px] font-inter font-semibold text-editor-text">
                {sectionTitle[activeNav]}
              </h1>

              {/* Sort controls */}
              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen((v) => !v)}
                    className="flex items-center gap-1.5 text-[12px] text-editor-text-muted hover:text-editor-text transition-colors"
                  >
                    Sort:{" "}
                    <span className="font-semibold">
                      {SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
                    </span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {sortOpen && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-editor-panel border border-editor-border-light rounded shadow-lg z-20">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setSortKey(opt.key);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors hover:bg-editor-hover ${
                            sortKey === opt.key
                              ? "text-editor-accent"
                              : "text-editor-text-muted"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort direction */}
                <button
                  onClick={() => setSortAsc((v) => !v)}
                  title={sortAsc ? "Ascending" : "Descending"}
                  className="text-editor-text-muted hover:text-editor-text transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transform: sortAsc ? "scaleY(-1)" : undefined }}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2">
              {/* View toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-7 h-7 flex items-center justify-center transition-colors rounded ${
                    viewMode === "list"
                      ? "bg-editor-accent-subtle text-editor-accent"
                      : "text-editor-text-muted hover:bg-editor-hover"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {" "}
                    <line x1="8" y1="6" x2="21" y2="6" />{" "}
                    <line x1="8" y1="12" x2="21" y2="12" />{" "}
                    <line x1="8" y1="18" x2="21" y2="18" />{" "}
                    <line x1="3" y1="6" x2="3.01" y2="6" />{" "}
                    <line x1="3" y1="12" x2="3.01" y2="12" />{" "}
                    <line x1="3" y1="18" x2="3.01" y2="18" />{" "}
                  </svg>
                </button>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-7 h-7 flex items-center justify-center transition-colors rounded ${
                    viewMode === "grid"
                      ? "bg-editor-accent-subtle text-editor-accent"
                      : "text-editor-text-muted hover:bg-editor-hover"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {" "}
                    <rect x="3" y="3" width="7" height="7" />{" "}
                    <rect x="14" y="3" width="7" height="7" />{" "}
                    <rect x="3" y="14" width="7" height="7" />{" "}
                    <rect x="14" y="14" width="7" height="7" />{" "}
                  </svg>
                </button>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 w-54">
                <span className="text-[12px] font-semibold text-editor-text-muted whitespace-nowrap">
                  Filter
                </span>

                <div className="flex-1 border-b border-editor-border-light focus-within:border-editor-text-muted transition-colors">
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filer Recent Files"
                    className="w-full bg-transparent text-[11px] py-0.5 outline-none text-editor-text placeholder:text-editor-text-disabled placeholder:italic"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-25 py-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-editor-panel border border-editor-border flex items-center justify-center mb-4 rounded">
                  <span className="text-2xl text-editor-text-muted">🖼</span>
                </div>
                <p className="text-editor-text font-medium mb-1">
                  No projects yet
                </p>
                <p className="text-[13px] text-editor-text-muted mb-4">
                  Create your first project to get started
                </p>
                <NewProjectButton />
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <ProjectListView projects={filtered} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
