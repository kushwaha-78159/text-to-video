import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const [users, projects, generations, providers] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.videoGeneration.count(),
      prisma.aIProvider.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      counts: { users, projects, generations, providers },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 }
    );
  }
}
