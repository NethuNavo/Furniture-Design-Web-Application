"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

export type AdminDesignRow = {
  id: string;
  title: string;
  roomWidth: number;
  roomHeight: number;
  itemCount: number;
  createdAt: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  wallColor?: string | null;
  floorColor?: string | null;
};

type AdminDesignsTableProps = {
  designs: AdminDesignRow[];
  isDark?: boolean;
};

export default function AdminDesignsTable({ designs: initialDesigns, isDark = false }: AdminDesignsTableProps) {
  const router = useRouter();
  const [designs, setDesigns] = useState(initialDesigns);

  const sortedDesigns = useMemo(
    () => [...designs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [designs],
  );

  const formattedDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const handleView3D = (designId: string) => {
    router.push(`/room-designer/3d?designId=${encodeURIComponent(designId)}`);
  };

  const handleDelete = (designId: string) => {
    if (!confirm("Remove this design from the list?")) return;
    setDesigns((current) => current.filter((d) => d.id !== designId));
  };

  const renderPreview = (design: AdminDesignRow) => {
    const wall = design.wallColor ?? (isDark ? "#1e40af" : "#dbeafe");
    const floor = design.floorColor ?? (isDark ? "#1e293b" : "#bfdbfe");
    return (
      <div className={`flex h-14 w-20 flex-col overflow-hidden rounded-2xl border ${isDark ? "border-blue-700/50" : "border-blue-300/50"}`}>
        <div className="h-6" style={{ backgroundColor: wall }} />
        <div className="h-8" style={{ backgroundColor: floor }} />
      </div>
    );
  };

  if (designs.length === 0) {
    return (
      <p className={isDark ? "text-blue-300" : "text-stone-500"}>
        No saved room designs yet. Users can save designs from the room designer.
      </p>
    );
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-[1.5rem] border",
        isDark ? "border-blue-700/50 bg-blue-950/20" : "border-blue-300/50 bg-blue-50/20",
      ].join(" ")}
    >
      <div
        className={[
          "grid grid-cols-[80px_minmax(0,1.5fr)_1fr_1fr_60px_1fr_auto] gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em]",
          isDark ? "bg-blue-900/40 text-blue-300" : "bg-blue-100/60 text-stone-500",
        ].join(" ")}
      >
        <span>Preview</span>
        <span>Design</span>
        <span>User</span>
        <span>Room</span>
        <span>Items</span>
        <span>Date</span>
        <span>Action</span>
      </div>

      <div className="divide-y divide-blue-200/20">
        {sortedDesigns.map((design) => (
          <div
            key={design.id}
            className={[
              "grid grid-cols-[80px_minmax(0,1.5fr)_1fr_1fr_60px_1fr_auto] items-center gap-3 px-5 py-4 text-sm",
              isDark ? "text-blue-100" : "text-blue-900",
            ].join(" ")}
          >
            {renderPreview(design)}
            <span className="font-medium">{design.title}</span>
            <span className={isDark ? "text-blue-300/75" : "text-stone-500"}>{design.user?.email ?? "Unknown"}</span>
            <span className={isDark ? "text-blue-300/75" : "text-stone-500"}>
              {Math.round(design.roomWidth / 100)}m × {Math.round(design.roomHeight / 100)}m
            </span>
            <span className={isDark ? "text-blue-300/75" : "text-stone-500"}>{design.itemCount}</span>
            <span className={isDark ? "text-blue-300/75" : "text-stone-500"}>{formattedDate(design.createdAt)}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleView3D(design.id)}
                title="View in 3D"
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
                  isDark ? "border-blue-700 bg-blue-900/60 text-blue-200 hover:bg-blue-800" : "border-blue-300 bg-white/80 text-blue-700 hover:bg-blue-50",
                ].join(" ")}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(design.id)}
                title="Remove design"
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
                  isDark ? "border-stone-600 bg-stone-900/75 text-stone-100 hover:bg-stone-800" : "border-stone-300 bg-white/85 text-charcoal hover:bg-stone-50",
                ].join(" ")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
