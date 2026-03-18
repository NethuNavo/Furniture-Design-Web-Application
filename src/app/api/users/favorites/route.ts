import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findDemoUserByEmail } from "@/lib/demoAuthStore";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          favorites: {
            select: {
              productSlug: true,
              productName: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return NextResponse.json({
        favorites: user?.favorites ?? [],
      });
    } catch {
      // Fallback to demo store
      const demoUser = await findDemoUserByEmail(email);
      if (demoUser) {
        return NextResponse.json({ favorites: [] });
      }
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
  } catch (error) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json({ error: "Could not load favorites." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      productSlug?: string;
      productName?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const productSlug = body.productSlug?.trim();
    const productName = body.productName?.trim();

    if (!email || !productSlug) {
      return NextResponse.json(
        { error: "Email and product slug are required." },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId: user.id,
          productSlug,
          productName: productName || null,
        },
      });

      return NextResponse.json(
        {
          favorite: {
            productSlug: favorite.productSlug,
            productName: favorite.productName,
          },
        },
        { status: 201 }
      );
    } catch (err) {
      // Check for unique constraint violation
      if ((err as any).code === "P2002") {
        return NextResponse.json(
          { error: "Already in favorites." },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json(
      { error: "Could not add to favorites." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      productSlug?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const productSlug = body.productSlug?.trim();

    if (!email || !productSlug) {
      return NextResponse.json(
        { error: "Email and product slug are required." },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      await prisma.favorite.delete({
        where: {
          userId_productSlug: {
            userId: user.id,
            productSlug,
          },
        },
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      if ((err as any).code === "P2025") {
        return NextResponse.json(
          { error: "Favorite not found." },
          { status: 404 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { error: "Could not remove from favorites." },
      { status: 500 }
    );
  }
}
