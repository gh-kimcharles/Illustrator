// handle new user registration with email + password

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/register
// Body: { name, email, password }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // check for existing user
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }, // 409 conflict
      );
    }

    // hash password
    // bcrypt salt rounds: 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
      // return safe fields - no password hash
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { user, message: "Account created successfully" },
      { status: 201 },
    );
  } catch (err) {
    console.log("[register] error: ", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
