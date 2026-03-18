import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminDesignsTable, { type AdminDesignRow } from "@/components/admin/AdminDesignsTable";
import { prisma } from "@/lib/prisma";

const mockDesigns: AdminDesignRow[] = [
  {
    id: "demo-1",
    title: "Cozy Studio Layout",
    roomWidth: 800,
    roomHeight: 600,
    itemCount: 12,
    createdAt: new Date().toISOString(),
    user: { name: "Jane Doe", email: "jane@example.com" },
    wallColor: "#e7e0d6",
    floorColor: "#d9c7b3",
  },
  {
    id: "demo-2",
    title: "Open Loft Concept",
    roomWidth: 1000,
    roomHeight: 750,
    itemCount: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    user: { name: "John Smith", email: "john@example.com" },
    wallColor: "#dbe2e0",
    floorColor: "#a9b4b9",
  },
];

export default async function AdminDesignsPage() {
  let designs: AdminDesignRow[] = [];
  let isMock = false;

  try {
    const rows = await prisma.savedDesign.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    designs = rows.map((row: typeof rows[number]) => ({
      id: row.id,
      title: row.title,
      roomWidth: row.roomWidth,
      roomHeight: row.roomHeight,
      itemCount: row.itemCount,
      createdAt: row.createdAt.toISOString(),
      user: { name: row.user?.name ?? null, email: row.user?.email ?? null },
      wallColor: row.wallColor,
      floorColor: row.floorColor,
    }));
  } catch (error) {
    // Backend may not be connected; fall back to mock data.
    designs = mockDesigns;
    isMock = true;
  }

  return (
    <div className="space-y-8">
      <AdminHeader title="Designs" subtitle="Review saved room concepts and designer activity" />
      <section className="rounded-[2rem] bg-gradient-to-br from-blue-50/10 via-slate-50/5 to-blue-100/10 p-8 shadow-soft border border-blue-200/20">
        <div className="max-w-5xl space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-blue-600">Design review area</h2>
            <p className="mt-4 text-base leading-7 text-blue-700">
              This section is prepared for saved room layouts, featured design approvals, and future collaboration tools for your design team.
            </p>
          </div>

          <AdminDesignsTable designs={designs} isMock={isMock} />
        </div>
      </section>
    </div>
  );
}
