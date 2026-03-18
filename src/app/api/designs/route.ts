import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        designs: {
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return NextResponse.json({ designs: user?.designs ?? [] });
  } catch (error) {
    console.error("Fetch designs error:", error);
    // Return empty designs instead of error to prevent console spam
    return NextResponse.json({ designs: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      title?: string;
      roomWidth?: number;
      roomHeight?: number;
      roomShape?: string;
      wallColor?: string;
      floorColor?: string;
      itemCount?: number;
      items?: unknown;
    };

    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const design = await prisma.savedDesign.create({
      data: {
        title: body.title?.trim() || "Untitled Design",
        roomWidth: body.roomWidth ?? 800,
        roomHeight: body.roomHeight ?? 600,
        roomShape: body.roomShape ?? "rectangle",
        wallColor: body.wallColor ?? "#e8e6e3",
        floorColor: body.floorColor ?? "#f5f4f2",
        itemCount: body.itemCount ?? 0,
        items: body.items ?? [],
        userId: user.id,
      },
    });

    return NextResponse.json({ design }, { status: 201 });
  } catch (error) {
    console.error("Create design error:", error);
    return NextResponse.json({ error: "Could not save design." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body?.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Design id is required." }, { status: 400 });
    }

    await prisma.savedDesign.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete design error:", error);
    return NextResponse.json({ error: "Could not delete design." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      id?: string;
      title?: string;
      roomWidth?: number;
      roomHeight?: number;
      roomShape?: string;
      wallColor?: string;
      floorColor?: string;
      itemCount?: number;
      items?: unknown;
    };

    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Design id is required." }, { status: 400 });
    }

    const design = await prisma.savedDesign.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title.trim() }),
        ...(body.roomWidth !== undefined && { roomWidth: body.roomWidth }),
        ...(body.roomHeight !== undefined && { roomHeight: body.roomHeight }),
        ...(body.roomShape && { roomShape: body.roomShape }),
        ...(body.wallColor && { wallColor: body.wallColor }),
        ...(body.floorColor && { floorColor: body.floorColor }),
        ...(body.itemCount !== undefined && { itemCount: body.itemCount }),
        ...(body.items !== undefined && { items: body.items }),
      },
    });

    return NextResponse.json({ design }, { status: 200 });
  } catch (error) {
    console.error("Update design error:", error);
    return NextResponse.json({ error: "Could not update design." }, { status: 500 });
  }
}
