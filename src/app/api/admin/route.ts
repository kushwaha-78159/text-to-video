import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "UNAUTHORIZED" ? "Sign in required." : "Admin access required." },
      { status: auth.error === "UNAUTHORIZED" ? 401 : 403 }
    );
  }

  const [users, projects, generations, completed, failed, credits, recentUsers, recentJobs] =
    await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.videoGeneration.count(),
      prisma.videoGeneration.count({ where: { status: "COMPLETED" } }),
      prisma.videoGeneration.count({ where: { status: "FAILED" } }),
      prisma.user.aggregate({ _sum: { credits: true } }),
      prisma.user.findMany({
        take: 10, orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, credits: true, createdAt: true },
      }),
      prisma.videoGeneration.findMany({
        take: 10, orderBy: { createdAt: "desc" },
        select: { id: true, prompt: true, status: true, createdAt: true, user: { select: { email: true } } },
      }),
    ]);

  return NextResponse.json({
    stats: { users, projects, generations, completed, failed, totalCredits: credits._sum.credits ?? 0 },
    users: recentUsers,
    jobs: recentJobs,
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const userId = String(body.userId ?? "");
    const role = body.role;

    if (!userId || !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Valid userId and role required." }, { status: 400 });
    }
    if (userId === auth.user.id && role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot remove your own admin role." }, { status: 400 });
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to update user role." }, { status: 400 });
  }
}
