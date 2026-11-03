import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const providers = [
  { id: "runway", name: "Runway", env: "RUNWAY_API_KEY", capabilities: ["text-to-video"] },
  { id: "google", name: "Google AI", env: "GEMINI_API_KEY", capabilities: ["text"] },
  { id: "openai", name: "OpenAI", env: "OPENAI_API_KEY", capabilities: ["text"] },
  { id: "anthropic", name: "Anthropic", env: "ANTHROPIC_API_KEY", capabilities: ["text"] },
  { id: "deepseek", name: "DeepSeek", env: "DEEPSEEK_API_KEY", capabilities: ["text"] },
  { id: "groq", name: "Groq", env: "GROQ_API_KEY", capabilities: ["text"] },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const configured = providers.map((p) => ({
    id: p.id,
    name: p.name,
    configured: Boolean(process.env[p.env]?.trim()),
    capabilities: p.capabilities,
    status: process.env[p.env]?.trim() ? "KEY_CONFIGURED" : "NOT_CONFIGURED",
  }));

  let databaseModels: Awaited<ReturnType<typeof prisma.aIProvider.findMany<{ include: { models: true } }>>> = [];
  try {
    databaseModels = await prisma.aIProvider.findMany({
      where: { enabled: true },
      include: { models: { where: { enabled: true }, orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database models unavailable:", error);
  }

  return NextResponse.json({
    providers: configured,
    databaseModels,
    note: "Key configured means a non-empty environment variable exists; it does not verify provider authentication or service availability.",
  });
}
