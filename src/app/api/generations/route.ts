import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const GENERATION_COST = 10;

async function refundGeneration(generationId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const changed = await tx.videoGeneration.updateMany({
      where: { id: generationId, status: { in: ["QUEUED", "PROCESSING"] } },
      data: { status: "FAILED", errorMessage: "Generation submission failed." },
    });

    if (changed.count !== 1) return;

    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: GENERATION_COST } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: GENERATION_COST,
        type: "REFUND",
        description: "Failed video generation refund",
        referenceId: generationId,
      },
    });
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  if (!process.env.RUNWAY_API_KEY) {
    return NextResponse.json({ error: "Runway API key is not configured." }, { status: 503 });
  }

  let generationId: string | null = null;

  try {
    const body = await request.json();
    const prompt = String(body.prompt ?? "").trim();
    const duration = Number(body.duration ?? 5);
    const ratio = String(body.ratio ?? "1280:720");

    if (!prompt || prompt.length > 1000) {
      return NextResponse.json({ error: "Prompt must be 1–1000 characters." }, { status: 400 });
    }
    if (![5, 10].includes(duration)) {
      return NextResponse.json({ error: "Duration must be 5 or 10 seconds." }, { status: 400 });
    }
    if (!["1280:720", "720:1280"].includes(ratio)) {
      return NextResponse.json({ error: "Use landscape or portrait aspect ratio." }, { status: 400 });
    }

    const generation = await prisma.$transaction(async (tx) => {
      const created = await tx.videoGeneration.create({
        data: {
          userId: session.id,
          prompt,
          duration,
          aspectRatio: ratio === "720:1280" ? "9:16" : "16:9",
          type: "TEXT_TO_VIDEO",
          status: "QUEUED",
          creditsUsed: GENERATION_COST,
        },
      });

      const debit = await tx.user.updateMany({
        where: { id: session.id, credits: { gte: GENERATION_COST } },
        data: { credits: { decrement: GENERATION_COST } },
      });

      if (debit.count !== 1) throw new Error("INSUFFICIENT_CREDITS");

      await tx.creditTransaction.create({
        data: {
          userId: session.id,
          amount: -GENERATION_COST,
          type: "USAGE",
          description: "AI video generation",
          referenceId: created.id,
        },
      });

      return created;
    });

    generationId = generation.id;

    const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });
    const task = await client.textToVideo.create({
      model: "gen4.5",
      promptText: prompt,
      ratio: ratio as "1280:720" | "720:1280",
      duration,
    });

    await prisma.videoGeneration.update({
      where: { id: generation.id },
      data: {
        providerJobId: task.id,
        status: "PROCESSING",
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      taskId: task.id,
      generationId: generation.id,
      status: "SUBMITTED",
      duration,
      model: "gen4.5",
      creditsUsed: GENERATION_COST,
    });
  } catch (error) {
    if (generationId) {
      try {
        await refundGeneration(generationId, session.id);
      } catch (refundError) {
        console.error("Generation refund error:", refundError);
      }
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json({ error: "Not enough credits. You need 10 credits." }, { status: 402 });
    }

    console.error("Generation submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation submission failed." },
      { status: 502 }
    );
  }
}
