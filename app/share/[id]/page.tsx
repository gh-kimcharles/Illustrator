// renders a read-only flattened view of a shared project ussing the shareToken

interface Props {
  params: Promise<{ id: string }>;
}

import { ShareView } from "@/components/ui/ShareView";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import React from "react";

const SharePage = async ({ params }: Props) => {
  const { id } = await params;

  // look up project by shareToken
  const project = await prisma.project.findFirst({
    where: {
      shareToken: id,
      isShared: true,
    },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      data: true,
      user: {
        select: { name: true },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-editor-bg text-editor-text">
      {/* Header */}
      <header className="bg-editor-menubar border-b border-editor-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[oklch(0.10_0.05_240)] text-editor-accent text-sm font-bold">
            Ps
          </div>
          <div>
            <p className="text-[13px] font-semibold text-editor-text">
              {project.name}
            </p>
            {project.user?.name && (
              <p className="text-[11px] text-editor-text-muted">
                by {project.user.name}
              </p>
            )}
          </div>
        </div>
        <span className="text-[11px] text-editor-text-muted border border-editor-border-light px-2 py-1">
          Read-only
        </span>
      </header>

      {/* Canvas view */}
      <main className="flex items-center justify-center p-8">
        <ShareView projectData={project.data} />
      </main>
    </div>
  );
};

export default SharePage;
