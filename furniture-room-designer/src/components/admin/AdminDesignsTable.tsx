"use client"; // Required for client-side React features (useState, useRouter, etc.)

// Next.js navigation hook for routing
import { useRouter } from "next/navigation";

// React hooks
import { useMemo, useState } from "react";

// Icons
import { AlertTriangle, Eye, Trash2 } from "lucide-react";

/**
 * Type definition for each design row
 */
export type AdminDesignRow = {
  id: string;                 // unique design ID
  title: string;              // design name
  roomWidth: number;          // width (in cm)
  roomHeight: number;         // height (in cm)
  itemCount: number;          // number of furniture items
  createdAt: string;          // date created (ISO string)
  user?: {
    name?: string | null;     // user name
    email?: string | null;    // user email
  };
  wallColor?: string | null;  // preview wall color
  floorColor?: string | null; // preview floor color
};

/**
 * Props passed to component
 */
type AdminDesignsTableProps = {
  designs: AdminDesignRow[]; // list of designs
  isMock?: boolean;          // if using mock data
  isDark?: boolean;          // theme toggle
};

/**
 * Main component
 */
export default function AdminDesignsTable({
  designs: initialDesigns,
  isMock,
  isDark = false,
}: AdminDesignsTableProps) {

  const router = useRouter();

  // Local state for designs
  const [designs, setDesigns] = useState(initialDesigns);

  // Track which design is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if designs exist
  const hasDesigns = designs.length > 0;

  /**
   * Sort designs by newest first
   */
  const sortedDesigns = useMemo(() => {
    return [...designs].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }, [designs]);

  /**
   * Format date nicely
   */
  const formattedDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  /**
   * Navigate to design view page
   */
  const handleView = (designId: string) => {
    router.push(`/room-designer?designId=${encodeURIComponent(designId)}`);
  };

  /**
   * Navigate to 3D design view
   */
  const handleView3D = (designId: string) => {
    router.push(`/room-designer/3d?designId=${encodeURIComponent(designId)}`);
  };

  /**
   * Delete design from backend
   */
  const handleDelete = async (designId: string) => {
    if (!confirm("Delete this design? This cannot be undone.")) return;

    setDeletingId(designId);

    try {
      const res = await fetch("/api/designs", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: designId }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Remove from UI
      setDesigns((current) =>
        current.filter((design) => design.id !== designId)
      );
    } catch (error) {
      console.error(error);
      window.alert("Unable to delete design.");
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Small preview card (wall + floor)
   */
  const renderPreview = (design: AdminDesignRow) => {
    const wall = design.wallColor ?? (isDark ? "#1e40af" : "#dbeafe");
    const floor = design.floorColor ?? (isDark ? "#1e293b" : "#bfdbfe");

    return (
      <div
        className={`flex h-14 w-20 flex-col rounded-2xl border ${
          isDark
            ? "border-blue-700/50 bg-blue-950/20"
            : "border-blue-300/50 bg-blue-50/20"
        }`}
      >
        <div className="h-6" style={{ backgroundColor: wall }} />
        <div className="h-8" style={{ backgroundColor: floor }} />
      </div>
    );
  };

  /**
   * EMPTY STATE UI
   */
  if (!hasDesigns) {
    return (
      <p className="text-blue-400 text-left">
        {isMock
          ? "Connect to your backend database to start seeing saved designs here."
          : "There are no saved room designs yet. Users can save designs from the room designer."}
      </p>
    );
  }

  /**
   * MAIN TABLE UI
   */
  return (
    <div
      className={`rounded-2xl border p-6 ${
        isDark
          ? "border-blue-700/50 bg-gradient-to-br from-blue-950/20 to-slate-900/10"
          : "border-blue-300/50 bg-gradient-to-br from-blue-50/20 to-slate-50/10"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between">
        <h3 className={isDark ? "text-blue-100" : "text-blue-900"}>
          Saved room designs
        </h3>
        <span className={isDark ? "text-blue-200" : "text-stone-500"}>{sortedDesigns.length} designs</span>
      </div>

      {/* Table */}
      <table className="w-full mt-4">
        <thead>
          <tr className={isDark ? "text-blue-200" : "text-stone-500"}>
            <th>Preview</th>
            <th>Design</th>
            <th>User</th>
            <th>Room</th>
            <th>Items</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody className={isDark ? "text-blue-100" : "text-blue-900"}>
          {sortedDesigns.map((design) => (
            <tr key={design.id} className="border-b border-blue-200/20">
              <td>{renderPreview(design)}</td>

              <td>{design.title}</td>

              <td>{design.user?.email ?? "Unknown"}</td>

              <td>
                {Math.round(design.roomWidth / 100)}m ×{" "}
                {Math.round(design.roomHeight / 100)}m
              </td>

              <td>{design.itemCount}</td>

              <td>{formattedDate(design.createdAt)}</td>

              <td className="space-x-2">
                {/* View 3D button */}
                <button onClick={() => handleView3D(design.id)} className="text-emerald-600 hover:text-emerald-700 mr-2" title="View 3D">
                  <Eye size={16} />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(design.id)}
                  disabled={deletingId === design.id}
                  className="text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}