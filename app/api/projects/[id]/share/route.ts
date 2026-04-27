import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// enable sharing
// POST /api/projects/:id/share
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  // verify ownership
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (project.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // generate cryptographically random share token if not already shared
  const shareToken = project.shareToken ?? randomBytes(16).toString("hex");

  const updated = await prisma.project.update({
    where: { id },
    data: { isShared: true, shareToken },
    select: { shareToken: true },
  });

  return NextResponse.json({
    shareToken: updated.shareToken,
    shareUrl: `/share/${updated.shareToken}`,
  });
}

// disable sharing
// DELETE /api/projects/:id/share
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (project.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.update({
    where: { id },
    data: { isShared: false, shareToken: null },
  });

  return NextResponse.json({ message: "Sharing disabled" });
}
