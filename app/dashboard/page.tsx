import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { NewProjectButton } from "@/components/ui/NewProjectButton";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  // check session (middleware handle this, but be defensive)
  if (!session?.user?.id) redirect("/login");

  // fetch user's project (no pixel data)
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      isShared: true,
      shareToken: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return (
    <div className="min-h-screen bg-editor-bg text-editor-text">
      {/* Header */}
      <header className="bg-editor-menubar border-b border-editor-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-sm font-bold">
            Ill
          </div>
          <span className="text-[14px] font-semibold text-editor-text">
            Illustrator
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[12px] text-editor-text-muted">
            {session.user.email}
          </span>
          <Link
            href="/api/auth/signout"
            className="text-[12px] text-editor-text-muted hover:text-editor-text transition-colors"
          >
            Sign out
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-editor-text">
              Your Projects
            </h1>
            <p className="text-[13px] text-editor-text-muted mt-0.5">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <NewProjectButton />
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-editor-panel border border-editor-border flex items-center justify-center mb-4">
              <span className="text-2xl text-editor-text-muted">🖼</span>
            </div>
            <p className="text-editor-text font-medium mb-1">No projects yet</p>
            <p className="text-[13px] text-editor-text-muted mb-4">
              Create your first project to get started
            </p>
            <NewProjectButton />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
