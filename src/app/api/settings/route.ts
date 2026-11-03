import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, settings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true, email: true, credits: true, createdAt: true },
    }),
    prisma.userSettings.findUnique({ where: { userId: session.id } }),
  ]);

  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({
    profile: user,
    settings: settings ?? { theme: "dark", defaultAspectRatio: "16:9", notifications: true },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const theme = String(body.theme ?? "dark");
    const defaultAspectRatio = String(body.defaultAspectRatio ?? "16:9");
    const notifications = body.notifications;

    if (!name || name.length > 60) {
      return NextResponse.json({ error: "Name must be 1–60 characters." }, { status: 400 });
    }
    if (!["dark", "light", "system"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme." }, { status: 400 });
    }
    if (!["16:9", "9:16", "1:1"].includes(defaultAspectRatio)) {
      return NextResponse.json({ error: "Invalid aspect ratio." }, { status: 400 });
    }
    if (typeof notifications !== "boolean") {
      return NextResponse.json({ error: "Invalid notification preference." }, { status: 400 });
    }

    const [profile, settings] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.id },
        data: { name },
        select: { name: true, email: true, credits: true },
      }),
      prisma.userSettings.upsert({
        where: { userId: session.id },
        create: { userId: session.id, theme, defaultAspectRatio, notifications },
        update: { theme, defaultAspectRatio, notifications },
      }),
    ]);

    return NextResponse.json({ success: true, profile, settings });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
