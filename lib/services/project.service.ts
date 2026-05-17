import { randomBytes } from "crypto";
import { prisma } from "../db/prisma";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "../validations/project.validator";
import { Prisma } from "@prisma/client";

// type errors
export class ProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ProjectForbiddenError";
  }
}

// safe select shapes
const projectListSelect = {
  id: true,
  name: true,
  thumbnail: true,
  isShared: true,
  shareToken: true,
  createdAt: true,
  updatedAt: true,
} as const;

const projectSummarySelect = {
  id: true,
  name: true,
  thumbnail: true,
  createdAt: true,
  updatedAt: true,
} as const;

// helper
async function getProjectOwner(id: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new ProjectNotFoundError();
  if (project.userId !== userId) throw new ProjectForbiddenError();
  return project;
}

// services
export async function getUserProjectsService(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: projectListSelect,
  });
}

export async function getProjectByIdService(id: string, userId: string) {
  const project = await getProjectOwner(id, userId);
  return project;
}

export async function createProjectService(
  userId: string,
  input: CreateProjectSchema,
) {
  return prisma.project.create({
    data: {
      userId,
      name: input.name ?? "Untitled Project",
      thumbnail: input.thumbnail ?? null,
      data: input.data as Prisma.InputJsonValue,
    },
    select: projectSummarySelect,
  });
}

export async function updateProjectService(
  id: string,
  userId: string,
  input: UpdateProjectSchema,
) {
  await getProjectOwner(id, userId);

  return prisma.project.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.thumbnail !== undefined && { thumbnail: input.thumbnail }),
      ...(input.data !== undefined && {
        data: input.data as Prisma.InputJsonValue,
      }),
    },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      updatedAt: true,
    },
  });
}

export async function deleteProjectService(id: string, userId: string) {
  await getProjectOwner(id, userId);

  await prisma.project.delete({ where: { id } });
}

export async function enableSharingService(id: string, userId: string) {
  const project = await getProjectOwner(id, userId);

  // reuse existing token if already shared
  const shareToken = project.shareToken ?? randomBytes(16).toString("hex");

  return prisma.project.update({
    where: { id },
    data: { isShared: true, shareToken },
    select: { shareToken: true },
  });
}

export async function disableSharingService(id: string, userId: string) {
  await getProjectOwner(id, userId);

  await prisma.project.update({
    where: { id },
    data: { isShared: false, shareToken: null },
  });
}
