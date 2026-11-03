import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const GENERATION_COST = 10;

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const taskId = new URL(request.url).searchParams.get("taskId");
    if (!taskId || !/^[0-9a-f-]{36}$/i.test(taskId)) {
      return NextResponse.json({ error: "Valid taskId required." }, { status: 400 });
    }

    const generation = await prisma.videoGeneration.findFirst({
      where: { providerJobId: taskId, userId: session.id },
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found." }, { status: 404 });
    }

    if (["COMPLETED", "FAILED", "CANCELLED"].includes(generation.status)) {
      return NextResponse.json({
        success: true,
        taskId,
        status: generation.status,
        output: generation.outputUrl ? [generation.outputUrl] : [],
      });
    }

    const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });
    const task = await client.tasks.retrieve(taskId);
    const state = String(task.status).toUpperCase();
    const output = "output" in task && Array.isArray(task.output) ? task.output : [];
    const first = output[0];
    const outputUrl =
      typeof first === "string"
        ? first
        : first && typeof first === "object" && "url" in first && typeof first.url === "string"
          ? first.url
          : null;

    if (state === "SUCCEEDED") {
      await prisma.videoGeneration.update({
        where: { id: generation.id },
        data: { status: "COMPLETED", outputUrl, completedAt: new Date() },
      });
    } else if (["FAILED", "CANCELED", "CANCELLED"].includes(state)) {
      await prisma.$transaction(async (tx) => {
        const changed = await tx.videoGeneration.updateMany({
          where: { id: generation.id, status: { in: ["QUEUED", "PROCESSING"] } },
          data: {
            status: state === "CANCELED" || state === "CANCELLED" ? "CANCELLED" : "FAILED",
            errorMessage: "The video provider could not complete this generation.",
            completedAt: new Date(),
          },
        });

        if (changed.count === 1) {
          await tx.user.update({
            where: { id: session.id },
            data: { credits: { increment: GENERATION_COST } },
          });
          await tx.creditTransaction.create({
            data: {
              userId: session.id,
              amount: GENERATION_COST,
              type: "REFUND",
              description: "Failed video generation refund",
              referenceId: generation.id,
            },
          });
        }
      });
    } else {
      await prisma.videoGeneration.updateMany({
        where: { id: generation.id, status: "QUEUED" },
        data: { status: "PROCESSING", startedAt: new Date() },
      });
    }

    const updated = await prisma.videoGeneration.findUnique({
      where: { id: generation.id },
      select: { status: true, outputUrl: true, errorMessage: true },
    });

    return NextResponse.json({
      success: true,
      taskId,
      status: updated?.status ?? state,
      output: updated?.outputUrl ? [updated.outputUrl] : output,
      failure: updated?.errorMessage ?? null,
    });
  } catch (error) {
    console.error("Runway status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to retrieve task." },
      { status: 502 }
    );
  }
}
