"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Box, Save, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FurnitureLibraryPanel } from "@/components/planner/FurnitureLibraryPanel";
import RoomSettingsPanel from "@/components/planner/RoomSettingsPanel";
import PlannerCanvas from "@/components/planner/PlannerCanvas";
import type {
  FurnitureCategory,
  FurnitureLibraryItem,
  FurnitureSizeOption,
} from "@/lib/furnitureItems";
import type { PlannerItem } from "@/lib/plannerUtils";
import { createPlannerItem } from "@/lib/plannerUtils";
import { saveDesign, type SavedRoomShape } from "@/lib/savedDesigns";

type CanvasRoomShape =
  | "rectangle"
  | "l-shape"
  | "square"
  | "u-shape"
  | "open-plan";

const CURRENT_DESIGN_STORAGE_KEY = "nord-living-current-design";

function normalizeCanvasShape(value: string | null): CanvasRoomShape {
  if (value === "l-shape") return "l-shape";
  if (value === "square") return "square";
  if (value === "u-shape") return "u-shape";
  if (value === "open-plan") return "open-plan";
  return "rectangle";
}

function mapCanvasShapeToSavedShape(shape: CanvasRoomShape): SavedRoomShape {
  if (shape === "square") return "square";
  if (shape === "l-shape") return "l-shape";
  if (shape === "u-shape") return "u-shape";
  if (shape === "open-plan") return "open-plan";
  return "rectangle";
}

export default function RoomDesigner2DPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCanvasShape = normalizeCanvasShape(searchParams.get("shape"));

  const [width, setWidth] = useState(
    Number(searchParams.get("width")) * 100 || 500,
  );
  const [height, setHeight] = useState(
    Number(searchParams.get("length")) * 100 ||
      Number(searchParams.get("height")) * 100 ||
      400,
  );
  const [wallColor, setWallColor] = useState(
    searchParams.get("wallColor") || "#f4efe8",
  );
  const [floorColor, setFloorColor] = useState(
    searchParams.get("floorColor") || "#d9c7ae",
  );
  const [roomShape, setRoomShape] = useState<CanvasRoomShape>(initialCanvasShape);

  const [designName, setDesignName] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<FurnitureCategory>("all");
  const [showGrid, setShowGrid] = useState(true);
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const persistCurrentDesign = (nextItems: PlannerItem[] = items) => {
    if (typeof window === "undefined") return;

    const payload = {
      title: designName.trim() || "My Nord Living Design",
      roomWidth: width,
      roomHeight: height,
      roomShape: mapCanvasShapeToSavedShape(roomShape),
      wallColor,
      floorColor,
      itemCount: nextItems.length,
      items: nextItems,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      CURRENT_DESIGN_STORAGE_KEY,
      JSON.stringify(payload),
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(CURRENT_DESIGN_STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as {
          title?: string;
          roomWidth?: number;
          roomHeight?: number;
          roomShape?: SavedRoomShape;
          wallColor?: string;
          floorColor?: string;
          items?: PlannerItem[];
        };

        setDesignName(parsed.title ?? "");
        setWidth(parsed.roomWidth ?? (Number(searchParams.get("width")) * 100 || 500));
        setHeight(
          parsed.roomHeight ||
            Number(searchParams.get("length")) * 100 ||
            Number(searchParams.get("height")) * 100 ||
            400,
        );
        setWallColor(parsed.wallColor ?? searchParams.get("wallColor") ?? "#f4efe8");
        setFloorColor(parsed.floorColor ?? searchParams.get("floorColor") ?? "#d9c7ae");
        setRoomShape(
          parsed.roomShape === "square" ||
            parsed.roomShape === "l-shape" ||
            parsed.roomShape === "u-shape" ||
            parsed.roomShape === "open-plan"
            ? parsed.roomShape
            : "rectangle",
        );
        setItems(parsed.items ?? []);
      }
    } catch {
      window.localStorage.removeItem(CURRENT_DESIGN_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hasHydrated) return;
    persistCurrentDesign(items);
  }, [hasHydrated, designName, width, height, roomShape, wallColor, floorColor, items]);

  const handleAddFurniture = (furniture: FurnitureLibraryItem) => {
    const created = createPlannerItem(furniture, items.length, {
      x: Math.max(20, Math.floor((width - furniture.width) / 2)),
      y: Math.max(20, Math.floor((height - furniture.height) / 2)),
    });

    const nextItems = [...items, created];
    setItems(nextItems);
    setSelectedItemId(created.id);
    persistCurrentDesign(nextItems);
  };

  const handleDropFurniture = (
    furniture: FurnitureLibraryItem,
    x: number,
    y: number,
  ) => {
    const created = createPlannerItem(furniture, items.length, { x, y });
    const nextItems = [...items, created];
    setItems(nextItems);
    setSelectedItemId(created.id);
    persistCurrentDesign(nextItems);
  };

  const handleUpdateItemPosition = (id: string, x: number, y: number) => {
    setItems((current) => {
      const next = current.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      );
      persistCurrentDesign(next);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedItemId) return;

    const nextItems = items.filter((item) => item.id !== selectedItemId);
    setItems(nextItems);
    setSelectedItemId(null);
    persistCurrentDesign(nextItems);
  };

  const handleClear = () => {
    setItems([]);
    setSelectedItemId(null);
    persistCurrentDesign([]);
  };

  const handleSave = () => {
    const now = new Date().toISOString();

    const design = {
      id: `design-${Date.now()}`,
      title: designName.trim() || "My Nord Living Design",
      updatedAt: now,
      roomWidth: width,
      roomHeight: height,
      roomShape: mapCanvasShapeToSavedShape(roomShape),
      wallColor,
      floorColor,
      itemCount: items.length,
      items,
    };

    saveDesign(design);
    persistCurrentDesign(items);
    alert("Design saved successfully.");
  };

  const handleView3D = () => {
    persistCurrentDesign(items);
    router.push("/room-designer/3d");
  };

  const handleSelectedItemColorChange = (color: string) => {
    if (!selectedItemId) return;

    setItems((current) => {
      const next = current.map((item) =>
        item.id === selectedItemId ? { ...item, color } : item,
      );
      persistCurrentDesign(next);
      return next;
    });
  };

  const handleSelectedItemSizeChange = (size: FurnitureSizeOption) => {
    if (!selectedItemId) return;

    setItems((current) => {
      const next = current.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              width: size.width,
              height: size.height,
              selectedSizeLabel: size.label,
            }
          : item,
      );
      persistCurrentDesign(next);
      return next;
    });
  };

  return (
    <ProtectedRoute>
      <main className="flex h-screen flex-col overflow-hidden bg-stone-100 text-charcoal">
        <div className="w-full px-5 pt-5">
          <Link
            href="/room-designer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <section className="flex-1 min-h-0 w-full px-5 pb-5 pt-4">
          <div className="grid h-full min-h-0 gap-5 xl:grid-cols-[270px_minmax(0,1fr)_360px]">
            <div className="min-h-0 overflow-hidden rounded-[2rem] border border-stone-300/70 bg-white/90 shadow-soft-lg">
              <FurnitureLibraryPanel
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onAddFurniture={handleAddFurniture}
              />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-stone-300/70 bg-white/90 shadow-soft-lg">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200/80 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-charcoal/42">
                    Active Design
                  </p>
                  <h2 className="mt-1 text-[2.1rem] font-semibold tracking-tight text-charcoal">
                    2D Design
                  </h2>
                  <p className="mt-2 text-sm text-charcoal/60">
                    Create your ideal layout and preview the same arrangement in 3D.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleView3D}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-stone-50"
                >
                  <Box className="h-4 w-4" />
                  Switch to 3D
                </button>
              </div>

              <div className="flex-shrink-0 border-b border-stone-200/80 px-6 py-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <input
                    type="text"
                    value={designName}
                    onChange={(event) => setDesignName(event.target.value)}
                    placeholder="Add a name for your design"
                    className="w-full rounded-full border border-stone-300 bg-stone-50 px-5 py-3 text-base text-charcoal outline-none placeholder:text-charcoal/35"
                  />

                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                  >
                    <Save className="h-4 w-4" />
                    Save Design
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={!selectedItem}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white text-charcoal shadow-soft transition hover:bg-stone-50 disabled:opacity-40"
                    title="Delete selected furniture"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 p-5">
                <PlannerCanvas
                  width={width}
                  height={height}
                  roomShape={roomShape}
                  wallColor={wallColor}
                  floorColor={floorColor}
                  showGrid={showGrid}
                  items={items}
                  selectedItemId={selectedItemId}
                  onSelectItem={setSelectedItemId}
                  onUpdateItemPosition={handleUpdateItemPosition}
                  onDropFurniture={handleDropFurniture}
                  onToggleGrid={() => setShowGrid((prev) => !prev)}
                  onClear={handleClear}
                />
              </div>
            </div>

            <div className="min-h-0 overflow-hidden rounded-[2rem] border border-stone-300/70 bg-white/90 shadow-soft-lg">
              <RoomSettingsPanel
                width={width}
                height={height}
                shape={roomShape}
                wallColor={wallColor}
                floorColor={floorColor}
                itemCount={items.length}
                selectedItem={selectedItem}
                onWidthChange={setWidth}
                onHeightChange={setHeight}
                onShapeChange={setRoomShape}
                onWallColorChange={setWallColor}
                onFloorColorChange={setFloorColor}
                onSelectedItemColorChange={handleSelectedItemColorChange}
                onSelectedItemSizeChange={handleSelectedItemSizeChange}
              />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
