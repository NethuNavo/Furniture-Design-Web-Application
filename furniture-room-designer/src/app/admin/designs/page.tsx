"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminDesignsTable, { type AdminDesignRow } from "@/components/admin/AdminDesignsTable";
import { useAdminPanel } from "@/components/admin/AdminProvider";

const mockDesigns: AdminDesignRow[] = [
  {
    id: "demo-1",
    title: "Cozy Studio Layout",
    roomWidth: 800,
    roomHeight: 600,
    itemCount: 12,
    createdAt: new Date().toISOString(),
    user: { name: "Janani Upeksha", email: "janani@example.com" },
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
    user: { name: "Kavinda Perera", email: "kavinda@example.com" },
    wallColor: "#dbe2e0",
    floorColor: "#a9b4b9",
  },
  {
    id: "demo-3",
    title: "Minimalist Bedroom",
    roomWidth: 600,
    roomHeight: 500,
    itemCount: 7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    user: { name: "Amara Silva", email: "amara@example.com" },
    wallColor: "#f0ebe3",
    floorColor: "#c8b89a",
  },
];

export default function AdminDesignsPage() {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      <AdminHeader title="Designs" subtitle="Review saved room concepts and designer activity." />
      <section
        className={[
          "rounded-[2rem] border p-8 shadow-soft",
          isDark
            ? "border-blue-700/70 bg-[rgba(30,24,21,0.74)]"
            : "border-blue-300/80 bg-gradient-to-br from-blue-50/20 to-white/95",
        ].join(" ")}
      >
        <div className="max-w-5xl space-y-6">
          <div>
            <h2 className={["text-3xl font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>
              Saved room designs
            </h2>
            <p className={["mt-4 text-base leading-7", isDark ? "text-blue-200/72" : "text-stone-500"].join(" ")}>
              Browse all room layouts saved by users. You can preview or remove any design from this panel.
            </p>
          </div>
          <AdminDesignsTable designs={mockDesigns} isDark={isDark} />
        </div>
      </section>
    </div>
  );
}
