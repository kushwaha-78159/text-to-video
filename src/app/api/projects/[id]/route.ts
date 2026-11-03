import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const data: { name?: string; description?: string | null; status?: "ACTIVE" | "ARCHIVED" } = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Name must be 1–80 characters." }, { status: 400 });
    }
    data.name = name;
  }

  if (body.description !== undefined) {
    data.description = String(body.description).trim().slice(0, 500) || null;
  }

  if (body.status !== undefined) {
    if (!["ACTIVE", "ARCHIVED"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid project status." }, { status: 400 });
    }
    data.status = body.status;
  }

  const result = await prisma.project.updateMany({
    where: { id, userId: session.id },
    data,
  });

  if (!result.count) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const project = await prisma.project.findFirst({ where: { id, userId: session.id } });
  return NextResponse.json({ project });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const result = await prisma.project.deleteMany({ where: { id, userId: session.id } });

  if (!result.count) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}
