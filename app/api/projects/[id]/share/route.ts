import { NextRequest, NextResponse } from "next/server";
import { requireSessionService } from "@/lib/services/auth.service";
import {
  disableSharingService,
  enableSharingService,
  ProjectForbiddenError,
  ProjectNotFoundError,
} from "@/lib/services/project.service";
import { ZodError } from "zod";

type ContextRoute = { params: Promise<{ id: string }> };

// enable sharing
// POST /api/projects/:id/share
export async function POST(_req: NextRequest, { params }: ContextRoute) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const { id } = await params;
    const updated = await enableSharingService(id, session.user.id); // catch: ProjectNotFoundError | ProjectForbiddenError

    return NextResponse.json(
      {
        shareToken: updated.shareToken,
        shareUrl: `/share/${updated.shareToken}`,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message, fields: err.flatten().fieldErrors },
        { status: 422 },
      );
    }

    if (err instanceof ProjectNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ProjectForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("[projects/:id/share POST] unexpected error: ", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// disable sharing
// DELETE /api/projects/:id/share
export async function DELETE(_req: NextRequest, { params }: ContextRoute) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const { id } = await params;
    await disableSharingService(id, session.user.id); // catch: ProjectNotFoundError | ProjectForbiddenError

    return NextResponse.json({ message: "Sharing disabled" }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message, fields: err.flatten().fieldErrors },
        { status: 422 },
      );
    }

    if (err instanceof ProjectNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ProjectForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("[projects/:id/share DELETE] unexpected error: ", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
