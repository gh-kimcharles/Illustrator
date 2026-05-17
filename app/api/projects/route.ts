import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireSessionService } from "@/lib/services/auth.service";
import {
  createProjectService,
  getUserProjectsService,
} from "@/lib/services/project.service";
import { createProjectSchema } from "@/lib/validations/project.validation";
import { ZodError } from "zod";

// get all projects
// GET /api/projects
export async function GET() {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const projects = await getUserProjectsService(session.user.id); // no catch

    return NextResponse.json({ projects }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message, fields: err.flatten().fieldErrors },
        { status: 422 },
      );
    }

    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("[projects GET] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// create new project
// POST /api/projects
export async function POST(req: NextRequest) {
  try {
    const session = await requireSessionService(); // catch: Unauthorized
    const body = await req.json();
    const input = createProjectSchema.parse(body);
    const project = await createProjectService(session.user.id, input); // no catch

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message, fields: err.flatten().fieldErrors },
        { status: 422 },
      );
    }

    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("[projects POST] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
