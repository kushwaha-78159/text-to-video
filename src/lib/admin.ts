import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return { error: "UNAUTHORIZED" as const };

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "FORBIDDEN" as const };
  }

  return { user };
}
