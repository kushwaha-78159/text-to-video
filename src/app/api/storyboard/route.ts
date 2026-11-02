import { NextRequest, NextResponse } from "next/server";

const beats = [
  "Opening hook: introduce the subject with a visually striking establishing shot",
  "Establishing shot: reveal the environment, atmosphere and setting",
  "Build-up: introduce movement, action and visual progression",
  "Detail shot: focus on important textures, expressions and cinematic details",
  "Development: expand the action with a new camera angle and composition",
  "Visual transition: connect the previous moment to the next scene naturally",
  "Main sequence: show the central action with dynamic cinematic movement",
  "Emotional beat: create a memorable visual moment",
  "Climax build-up: increase visual energy, scale and intensity",
  "Climax: deliver the main visual payoff",
  "Resolution: slow the action and establish the final composition",
  "Closing shot: finish with a polished cinematic ending",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const duration = Number(body.duration);
    const mode = body.mode;

    if (!prompt || prompt.length > 10000) {
      return NextResponse.json(
        { error: "Enter a prompt between 1 and 10000 characters." },
        { status: 400 }
      );
    }

    if (![5, 10, 15, 30, 60, 90, 120].includes(duration)) {
      return NextResponse.json(
        { error: "Unsupported video duration." },
        { status: 400 }
      );
    }

    if (!["text", "image", "script"].includes(mode)) {
      return NextResponse.json(
        { error: "Unsupported generation mode." },
        { status: 400 }
      );
    }

    const sceneLength = duration >= 60 ? 10 : duration >= 30 ? 10 : 5;
    const sceneCount = Math.ceil(duration / sceneLength);

    const scenes = Array.from({ length: sceneCount }, (_, index) => {
      const start = index * sceneLength;
      const length = Math.min(sceneLength, duration - start);

      return {
        number: index + 1,
        startSeconds: start,
        durationSeconds: length,
        title: `Scene ${String(index + 1).padStart(2, "0")}`,
        direction: beats[index % beats.length],
        prompt: `${prompt}\n\nScene direction: ${beats[index % beats.length]}.\nMaintain consistent characters, environment, color palette and visual style. This is scene ${index + 1} of ${sceneCount}.`,
      };
    });

    return NextResponse.json({
      success: true,
      type: "storyboard",
      totalDurationSeconds: duration,
      sceneCount,
      scenes,
      message: "Storyboard prepared. Video provider submission is not enabled yet.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to prepare storyboard." },
      { status: 400 }
    );
  }
}
