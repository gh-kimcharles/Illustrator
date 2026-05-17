import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { RegisterSchemaType } from "../validations/auth.validator";

// type errors the controller
export class EmailConflictError extends Error {
  constructor() {
    super("An account with this email already exists");
    this.name = "EmailConflictError";
  }
}

export async function registerService(input: RegisterSchemaType) {
  const { name, email, password } = input;

  // check for existing user
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true }, // fetch for the conflict check
  });

  if (existing) {
    throw new EmailConflictError();
  }

  // hash password: bcrypt salt rounds: 12
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
      createdAt: true,
    },
  });

  return user;
}
