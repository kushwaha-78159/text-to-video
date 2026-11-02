import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.aIProvider.findMany({
      where: { enabled: true },
      include: {
        models: {
          where: { enabled: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Models API failed:", error);
    return NextResponse.json(
      { error: "Unable to load AI providers" },
      { status: 500 }
    );
  }
}
