import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, getRoleFromEmail } from "@/lib/auth";
import { createDemoUser, findDemoUserByEmail } from "@/lib/demoAuthStore";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getPrismaClient } from "@/lib/safePrisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    let user:
      | {
          id: string;
          name: string;
          email: string;
          passwordHash: string;
          role: "customer" | "admin";
          avatarUrl?: string | null;
        }
      | null = null;

    try {
      const prisma = await getPrismaClient();
      if (!prisma) {
        throw new Error("Prisma unavailable");
      }

      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user && email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        user = await prisma.user.create({
          data: {
            name: "Admin User",
            email,
            passwordHash: hashPassword(password),
            role: getRoleFromEmail(email),
          },
        });
      }
    } catch {
      user = await findDemoUserByEmail(email);

      if (!user && email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        user = await createDemoUser({
          id: `demo-admin-${Date.now()}`,
          name: "Admin User",
          email,
          passwordHash: hashPassword(password),
          role: getRoleFromEmail(email),
          avatarUrl: null,
        });
      }
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Could not log in." }, { status: 500 });
  }
}
