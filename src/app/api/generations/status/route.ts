import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";


export async function GET(request: NextRequest) {
  try {
    if (!process.env.RUNWAY_API_KEY) {
      return NextResponse.json({ error: "Runway API key is not configured." }, { status: 503 });
    }

    const taskId = request.nextUrl.searchParams.get("taskId");
    if (!taskId || !/^[0-9a-f-]{36}$/i.test(taskId)) {
      return NextResponse.json({ error: "Valid taskId required." }, { status: 400 });
    }

    const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });
    const task = await client.tasks.retrieve(taskId);

    const output = "output" in task ? task.output : [];
    const failure = "failure" in task ? task.failure : null;

    return NextResponse.json({
      success: true,
      taskId: task.id,
      status: task.status,
      output,
      failure,
    });
  } catch (error) {
    console.error("Runway status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to retrieve task." },
      { status: 502 }
    );
  }
}
