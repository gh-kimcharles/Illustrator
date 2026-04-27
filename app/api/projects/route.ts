import { NextRequest } from "next/server";
// get all projects

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

// GET /api/projects
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized " }, { status: 401 });
  }

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

  return NextResponse.json({ projects });
}

// create new project
// POST /api/projects
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, thumbnail, data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Project data is required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: name || "Untitled Project",
        thumbnail: thumbnail || null,
        data,
      },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        // exclude data
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error("[projects POST] error:", err);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 },
    );
  }
}
