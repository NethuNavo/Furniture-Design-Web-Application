import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ""),
    // Connection pooling configuration
    ...(process.env.NODE_ENV === "development" && {
      // Increase timeouts in development
      errorFormat: "pretty",
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof globalThis !== "undefined") {
  const cleanup = async () => {
    await prisma.$disconnect().catch(console.error);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}


