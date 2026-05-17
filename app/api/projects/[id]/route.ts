import { NextRequest, NextResponse } from "next/server";
import { requireSessionService } from "@/lib/services/auth.service";
import {
  deleteProjectService,
  getProjectByIdService,
  ProjectForbiddenError,
  ProjectNotFoundError,
  updateProjectService,
} from "@/lib/services/project.service";
import { updateProjectSchema } from "@/lib/validations/project.validation";
import { ZodError } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

// load project
// GET /api/projects/:id
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const { id } = await params;
    const project = await getProjectByIdService(session.user.id, id); // catch: ProjectNotFoundError | ProjectForbiddenError

    return NextResponse.json({ project }, { status: 200 });
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

    console.error("[projects/:id GET] unexpected error: ", err);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}

// update project
// PATCH /api/projects/:id
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const body = req.json();
    const { id } = await params;
    const input = await updateProjectSchema.parse(body);
    const project = await updateProjectService(id, session.user.id, input); // catch: ProjectNotFoundError | ProjectForbiddenError

    return NextResponse.json({ project }, { status: 200 });
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

    console.error("[projects/:id PATCH] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// delete project
// DELETE /api/projects/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const { id } = await params;
    await deleteProjectService(id, session.user.id); // catch: ProjectNotFoundError | ProjectForbiddenError

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
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

    console.error("[projects/:id DELETE] unexpected error: ", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
