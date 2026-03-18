import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, getRoleFromEmail } from "@/lib/auth";
import { createDemoUser, findDemoUserByEmail } from "@/lib/demoAuthStore";
import { hashPassword } from "@/lib/password";
import { getPrismaClient } from "@/lib/safePrisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Full name, email, and password are required." }, { status: 400 });
    }

    if (email === ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "The admin account is predefined. Please log in instead." }, { status: 403 });
    }

    let user:
      | {
          id: string;
          name: string;
          email: string;
          role: "customer" | "admin";
          avatarUrl?: string | null;
        }
      | null = null;

    try {
      const prisma = await getPrismaClient();
      if (!prisma) {
        throw new Error("Prisma unavailable");
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }

      user = await prisma.user.create({
        data: {
          name: fullName,
          email,
          passwordHash: hashPassword(password),
          role: getRoleFromEmail(email),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });
    } catch {
      const existingUser = await findDemoUserByEmail(email);

      if (existingUser) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }

      user = await createDemoUser({
        id: `demo-user-${Date.now()}`,
        name: fullName,
        email,
        passwordHash: hashPassword(password),
        role: getRoleFromEmail(email),
        avatarUrl: null,
      });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatarUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
