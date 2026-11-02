import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const providers = [
  {
    name: "OpenAI",
    description: "AI text, reasoning and prompt enhancement",
  },
  {
    name: "Google Gemini",
    description: "Gemini AI models and multimodal capabilities",
  },
  {
    name: "Anthropic",
    description: "Claude AI models and prompt direction",
  },
  {
    name: "DeepSeek",
    description: "DeepSeek language models",
  },
  {
    name: "Groq",
    description: "Fast inference for supported language models",
  },
  {
    name: "Runway",
    description: "AI video generation provider",
  },
];

async function main() {
  for (const provider of providers) {
    await prisma.aIProvider.upsert({
      where: { name: provider.name },
      update: { description: provider.description },
      create: provider,
    });
  }

  console.log(`Seeded ${providers.length} AI providers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
