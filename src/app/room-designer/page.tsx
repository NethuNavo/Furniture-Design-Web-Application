"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import RoomSettingsPanel from "@/components/planner/RoomSettingsPanel";
import { ThreeRoomPreview } from "@/components/planner/ThreeRoomPreview";
import { furnitureItems } from "@/lib/furnitureItems";
import {
  createPlannerItem,
  type PlannerItem,
} from "@/lib/plannerUtils";

type Stage = "setup" | "2d" | "3d";

export default function RoomDesignerPage() {
  const [stage, setStage] = useState<Stage>("setup");

  const [roomWidth, setRoomWidth] = useState(520);
  const [roomHeight, setRoomHeight] = useState(360);
  const [wallColor, setWallColor] = useState("#f4efe8");
  const [floorColor, setFloorColor] = useState("#d9c7ae");

  const [items, setItems] = useState<PlannerItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? null;

  // ➕ Add furniture
  function addItem(itemType: any) {
    const newItem = createPlannerItem(itemType, items.length);
    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  }

  // ❌ Delete
  function deleteItem() {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  }

  // 🔁 Update helper
  function updateItem(updater: (item: PlannerItem) => PlannerItem) {
    if (!selectedId) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedId ? updater(item) : item
      )
    );
  }

  // 🎛️ Controls
  const handlers = {
    width: (v: number) => updateItem((i) => ({ ...i, width: v })),
    height: (v: number) => updateItem((i) => ({ ...i, height: v })),
    color: (c: string) => updateItem((i) => ({ ...i, color: c })),
    size: (label: string) =>
      updateItem((i) => {
        const s = i.availableSizes.find((s) => s.label === label);
        if (!s) return i;
        return {
          ...i,
          selectedSizeLabel: label,
          width: s.width,
          height: s.height,
        };
      }),
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <Navbar />

        <section className="px-6 py-8">
          {/* ================= SETUP ================= */}
          {stage === "setup" && (
            <div className="glass-card p-8 rounded-2xl max-w-xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">
                Setup Your Room
              </h1>

              <div className="space-y-4">
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  className="input"
                  placeholder="Width"
                />
                <input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Number(e.target.value))}
                  className="input"
                  placeholder="Height"
                />
              </div>

              <button
                onClick={() => setStage("2d")}
                className="button-pill mt-6"
              >
                Start Designing →
              </button>
            </div>
          )}

          {/* ================= 2D DESIGN ================= */}
          {stage === "2d" && (
            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
              {/* LEFT PANEL */}
              <div className="glass-card p-4 rounded-2xl">
                <RoomSettingsPanel
                  width={roomWidth}
                  height={roomHeight}
                  shape="rectangle"
                  wallColor={wallColor}
                  floorColor={floorColor}
                  itemCount={items.length}
                  selectedItem={selectedItem}
                  onWidthChange={setRoomWidth}
                  onHeightChange={setRoomHeight}
                  onShapeChange={() => {}}
                  onWallColorChange={setWallColor}
                  onFloorColorChange={setFloorColor}
                  onPresetSelect={(w, f) => {
                    setWallColor(w);
                    setFloorColor(f);
                  }}
                  onSelectedItemWidthChange={handlers.width}
                  onSelectedItemHeightChange={handlers.height}
                  onSelectedItemColorChange={handlers.color}
                  onSelectedItemSizeChange={handlers.size}
                />
              </div>

              {/* RIGHT AREA */}
              <div className="space-y-6">
                {/* Furniture */}
                <div className="glass-card p-4 rounded-2xl">
                  <h2 className="font-semibold mb-3">
                    Furniture Library
                  </h2>

                  <div className="grid grid-cols-3 gap-3">
                    {furnitureItems.map((f) => (
                      <button
                        key={f.label}
                        onClick={() => addItem(f)}
                        className="glass-subcard p-3 rounded-xl"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas */}
                <div className="glass-card p-4 rounded-2xl">
                  <div
                    className="relative border rounded-xl"
                    style={{
                      width: roomWidth,
                      height: roomHeight,
                      background: `linear-gradient(${wallColor} 60%, ${floorColor} 60%)`,
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          position: "absolute",
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          height: item.height,
                          backgroundColor: item.color,
                        }}
                        className={`cursor-pointer ${
                          selectedId === item.id
                            ? "ring-2 ring-black"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStage("3d")}
                    className="button-pill"
                  >
                    View 3D
                  </button>

                  <button
                    onClick={deleteItem}
                    className="button-pill bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3D ================= */}
          {stage === "3d" && (
            <div className="space-y-6">
              <ThreeRoomPreview
                roomWidth={roomWidth}
                roomHeight={roomHeight}
                wallColor={wallColor}
                floorColor={floorColor}
                items={items}
              />

              <button
                onClick={() => setStage("2d")}
                className="button-pill"
              >
                ← Back to 2D
              </button>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}