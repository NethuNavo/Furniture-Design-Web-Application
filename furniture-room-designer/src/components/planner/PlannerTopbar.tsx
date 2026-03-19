"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cuboid, Eraser, Grid2X2, LayoutGrid, LogOut, Redo2, Save, Undo2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type PlannerTopbarProps = {
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
};

export function PlannerTopbar({
  showGrid,
  canUndo,
  canRedo,
  onToggleGrid,
  onUndo,
  onRedo,
  onClear,
  onSave,
}: PlannerTopbarProps) {
  const router = useRouter();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-stone-300/60 bg-stone-100/90 backdrop-blur">
      <div className="mx-auto flex min-h-[78px] w-full max-w-[1360px] flex-col gap-3 px-1 py-3 sm:px-2 xl:flex-row xl:items-center xl:justify-between xl:px-2">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-5">
          <div className="flex items-center gap-3 text-charcoal">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white shadow-soft">
              <LayoutGrid className="h-4.5 w-4.5 text-charcoal/68" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-[0.01em] sm:text-xl">Room Planner</p>
              <p className="text-sm text-charcoal/55">{user?.name || "Nord Living Member"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-charcoal/68">
            <Link href="/" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs shadow-soft transition hover:bg-stone-50 hover:text-charcoal sm:text-sm">
              Home
            </Link>
            <Link href="/shop" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs shadow-soft transition hover:bg-stone-50 hover:text-charcoal sm:text-sm">
              Shop
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="rounded-full border border-stone-300 bg-white p-2.5 text-charcoal shadow-soft transition hover:bg-stone-50 disabled:opacity-40"
          >
            <Undo2 className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="rounded-full border border-stone-300 bg-white p-2.5 text-charcoal shadow-soft transition hover:bg-stone-50 disabled:opacity-40"
          >
            <Redo2 className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={onToggleGrid}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              showGrid ? "bg-charcoal text-white shadow-soft" : "border border-stone-300 bg-white text-charcoal shadow-soft hover:bg-stone-50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Grid2X2 className="h-4.5 w-4.5" />
              Grid
            </span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
          >
            <span className="inline-flex items-center gap-2">
              <Eraser className="h-4.5 w-4.5" />
              Clear
            </span>
          </button>
          <Link
            href="/room-designer/3d"
            className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
          >
            <span className="inline-flex items-center gap-2">
              <Cuboid className="h-4.5 w-4.5" />
              Switch to 3D
            </span>
          </Link>
          <button type="button" onClick={onSave} className="button-pill">
            <Save className="h-4.5 w-4.5" />
            Save Design
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
