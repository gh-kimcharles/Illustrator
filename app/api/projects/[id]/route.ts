// helper
// returns the project if it exists and belong to the current user,

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// else null if not
async function getOwnedProject(id: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project)
    return {
      project: null,
      error: "Not found",
      status: 404,
    };

  if (project.userId !== userId)
    return {
      project: null,
      error: "Forbidden",
      status: 403,
    };

  return { project, error: null, status: 200 };
}

// load project
// GET /api/projects/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const { project, error, status } = await getOwnedProject(id, session.user.id);
  if (error) return NextResponse.json({ error }, { status });

  return NextResponse.json({ project });
}

// update project
// PATCH /api/projects/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const { project, error, status } = await getOwnedProject(id, session.user.id);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await req.json();

    // allow only specific fields to be updated, excludes userId
    const { name, thumbnail, data } = body;

    const updated = await prisma.project.update({
      where: { id: project!.id },
      data: {
        ...(name !== undefined && { name }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(data !== undefined && { data }),
      },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (err) {
    console.error("[projects PATCH] error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// delete project
// DELETE /api/projects/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { project, error, status } = await getOwnedProject(id, session.user.id);
  if (error) return NextResponse.json({ error }, { status });

  await prisma.project.delete({ where: { id: project!.id } });

  return NextResponse.json({ message: "Project deleted" }, { status: 200 });
}
