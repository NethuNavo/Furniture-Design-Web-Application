import { NextRequest, NextResponse } from "next/server";
import { getRoleFromEmail } from "@/lib/auth";
import { findDemoUserByEmail, updateDemoUser } from "@/lib/demoAuthStore";
import { getPrismaClient } from "@/lib/safePrisma";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
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

      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });
    } catch {
      user = await findDemoUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      currentEmail?: string;
      name?: string;
      email?: string;
      avatar?: string;
    };

    const currentEmail = body.currentEmail?.trim().toLowerCase();
    const nextName = body.name?.trim();
    const nextEmail = body.email?.trim().toLowerCase();

    if (!currentEmail || !nextName || !nextEmail) {
      return NextResponse.json({ error: "Current email, name, and new email are required." }, { status: 400 });
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
        where: { email: currentEmail },
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const emailOwner = await prisma.user.findUnique({
        where: { email: nextEmail },
        select: { id: true },
      });

      if (emailOwner && emailOwner.id !== existingUser.id) {
        return NextResponse.json({ error: "Another account already uses that email." }, { status: 409 });
      }

      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: nextName,
          email: nextEmail,
          role: getRoleFromEmail(nextEmail),
          avatarUrl: body.avatar || null,
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
      const existingUser = await findDemoUserByEmail(currentEmail);

      if (!existingUser) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const emailOwner = await findDemoUserByEmail(nextEmail);
      if (emailOwner && emailOwner.id !== existingUser.id) {
        return NextResponse.json({ error: "Another account already uses that email." }, { status: 409 });
      }

      user = await updateDemoUser(currentEmail, {
        name: nextName,
        email: nextEmail,
        role: getRoleFromEmail(nextEmail),
        avatarUrl: body.avatar || null,
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
