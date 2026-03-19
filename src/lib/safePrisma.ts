import type { PrismaClient } from "@prisma/client";

export async function getPrismaClient(): Promise<PrismaClient | null> {
  try {
    const prismaModule = await import("@/lib/prisma");
    return prismaModule.prisma;
  } catch (error) {
    console.warn("Prisma client unavailable, falling back to demo store.", error);
    return null;
  }
}
