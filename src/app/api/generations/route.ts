import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";


export async function POST(request: NextRequest) {
  try {
    if (!process.env.RUNWAY_API_KEY) {
      return NextResponse.json({ error: "RUNWAY_API_KEY missing." }, { status: 503 });
    }

    const body = await request.json();
    const prompt = String(body.prompt ?? "").trim();
    const duration = Number(body.duration ?? 10);
    const rawRatio = String(body.ratio ?? "1280:720");

    if (!prompt || prompt.length > 1000) {
      return NextResponse.json({ error: "Prompt must be 1–1000 characters." }, { status: 400 });
    }

    if (![5, 10].includes(duration)) {
      return NextResponse.json({ error: "Clip duration must be 5 or 10 seconds." }, { status: 400 });
    }

    if (!["1280:720", "720:1280"].includes(rawRatio)) {
      return NextResponse.json({ error: "Use 16:9 or 9:16 aspect ratio." }, { status: 400 });
    }

    const ratio = rawRatio as "1280:720" | "720:1280";
    const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });

    const task = await client.textToVideo.create({
      model: "gen4.5",
      promptText: prompt,
      ratio,
      duration,
    });

    return NextResponse.json({
      success: true,
      taskId: task.id,
      status: "SUBMITTED",
      duration,
      model: "gen4.5",
    });
  } catch (error) {
    console.error("Runway generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation submission failed." },
      { status: 502 }
    );
  }
}
