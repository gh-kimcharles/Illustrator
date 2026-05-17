// handle new user registration with email + password

import { NextRequest, NextResponse } from "next/server";
import {
  EmailConflictError,
  registerService,
} from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validations/auth.validator";
import { ZodError } from "zod";

// POST /api/auth/register
// Body: { name, email, password }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = registerSchema.parse(body);
    const user = await registerService(input); // service

    return NextResponse.json(
      { user, message: "Account created successfully" },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message, fields: err.flatten().fieldErrors },
        { status: 422 },
      );
    }

    if (err instanceof EmailConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }

    // unknown
    console.error("[register] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
