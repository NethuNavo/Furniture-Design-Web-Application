"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlannerItem } from "@/lib/plannerUtils";
import type { FurnitureSizeOption } from "@/lib/furnitureItems";

type RoomShape =
  | "rectangle"
  | "l-shape"
  | "square"
  | "u-shape"
  | "open-plan";

type SettingsTab = "room" | "furniture";

type ColorScheme = {
  id: string;
  name: string;
  description: string;
  wall: string;
  floor: string;
};

type RoomSettingsPanelProps = {
  width: number;
  height: number;
  shape: RoomShape;
  wallColor: string;
  floorColor: string;
  itemCount: number;
  selectedItem: PlannerItem | null;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onShapeChange: (value: RoomShape) => void;
  onWallColorChange: (value: string) => void;
  onFloorColorChange: (value: string) => void;
  onSelectedItemColorChange: (value: string) => void;
  onSelectedItemSizeChange: (value: FurnitureSizeOption) => void;
};

const roomShapes: Array<{
  id: RoomShape;
  name: string;
  description: string;
}> = [
  {
    id: "rectangle",
    name: "Rectangle",
    description: "Best for common bedroom and living layouts.",
  },
  {
    id: "square",
    name: "Square",
    description: "Balanced layout for compact rooms.",
  },
  {
    id: "l-shape",
    name: "L-Shape",
    description: "Great for split functional areas.",
  },
  {
    id: "u-shape",
    name: "U-Shape",
    description: "Works well for enclosed planning zones.",
  },
  {
    id: "open-plan",
    name: "Open Plan",
    description: "For larger connected spaces.",
  },
];

const colorSchemes: ColorScheme[] = [
  {
    id: "light-neutral",
    name: "Light Neutral",
    description: "Soft beige tones for calm and airy interiors.",
    wall: "#f4efe8",
    floor: "#d9c7ae",
  },
  {
    id: "warm-beige",
    name: "Warm Beige",
    description: "A cozy palette for bedrooms and family rooms.",
    wall: "#eadcc8",
    floor: "#b9855b",
  },
  {
    id: "cool-grey",
    name: "Cool Grey",
    description: "Modern contrast for office-inspired spaces.",
    wall: "#d9dde2",
    floor: "#7d8794",
  },
  {
    id: "earthy-oak",
    name: "Earthy Oak",
    description: "Natural warm wood feeling for welcoming rooms.",
    wall: "#e7ddcf",
    floor: "#8b6b4c",
  },
  {
    id: "soft-minimal",
    name: "Soft Minimal",
    description: "Light monochrome styling for a clean look.",
    wall: "#efede8",
    floor: "#cfc8be",
  },
  {
    id: "charcoal-modern",
    name: "Charcoal Modern",
    description: "Bold darker tones for premium spaces.",
    wall: "#cfd2d8",
    floor: "#4d5561",
  },
];

export default function RoomSettingsPanel({
  width,
  height,
  shape,
  wallColor,
  floorColor,
  itemCount,
  selectedItem,
  onWidthChange,
  onHeightChange,
  onShapeChange,
  onWallColorChange,
  onFloorColorChange,
  onSelectedItemColorChange,
  onSelectedItemSizeChange,
}: RoomSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("room");
  const roomArea = ((width * height) / 10000).toFixed(2);

  const activeScheme = useMemo(() => {
    return (
      colorSchemes.find(
        (scheme) =>
          scheme.wall.toLowerCase() === wallColor.toLowerCase() &&
          scheme.floor.toLowerCase() === floorColor.toLowerCase(),
      ) ?? null
    );
  }, [wallColor, floorColor]);

  useEffect(() => {
    if (selectedItem) {
      setActiveTab("furniture");
    }
  }, [selectedItem]);

  return (
    <aside className="h-full overflow-y-auto p-5 pr-3">
      <h2 className="text-[1.65rem] font-semibold tracking-tight text-charcoal">
        Design Settings
      </h2>

      <div className="mt-5 flex rounded-full bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("room")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
            activeTab === "room"
              ? "bg-charcoal text-white shadow-soft"
              : "text-charcoal hover:bg-white"
          }`}
        >
          Room Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("furniture")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
            activeTab === "furniture"
              ? "bg-charcoal text-white shadow-soft"
              : "text-charcoal hover:bg-white"
          }`}
        >
          Furniture Details
        </button>
      </div>

      {activeTab === "room" ? (
        <div className="mt-7 space-y-7">
          <section className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-charcoal">
              Room Dimensions
            </h3>

            <div className="space-y-3.5">
              <label className="block space-y-2">
                <span className="text-base text-charcoal/68">Width (px)</span>
                <input
                  type="number"
                  value={width}
                  onChange={(event) => onWidthChange(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-base text-charcoal/68">Height (px)</span>
                <input
                  type="number"
                  value={height}
                  onChange={(event) => onHeightChange(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-charcoal">
              Room Shape
            </h3>

            <div className="grid gap-3">
              {roomShapes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onShapeChange(option.id)}
                  className={`rounded-[1.2rem] border px-4 py-3 text-left transition ${
                    shape === option.id
                      ? "border-charcoal bg-charcoal text-white shadow-soft"
                      : "border-stone-300 bg-stone-50 text-charcoal hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold">{option.name}</div>
                  <div
                    className={`mt-1 text-xs ${
                      shape === option.id ? "text-white/75" : "text-charcoal/55"
                    }`}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-charcoal">
              Wall Color
            </h3>

            <div className="space-y-3">
              <div
                className="h-10 rounded-[0.9rem] border border-stone-300"
                style={{ backgroundColor: wallColor }}
              />
              <input
                type="text"
                value={wallColor}
                onChange={(event) => onWallColorChange(event.target.value)}
                className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-charcoal">
              Floor Color
            </h3>

            <div className="space-y-3">
              <div
                className="h-10 rounded-[0.9rem] border border-stone-300"
                style={{ backgroundColor: floorColor }}
              />
              <input
                type="text"
                value={floorColor}
                onChange={(event) => onFloorColorChange(event.target.value)}
                className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[1.2rem] font-semibold tracking-tight text-charcoal">
                Color Schemes
              </h3>
              {activeScheme ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-charcoal/70">
                  {activeScheme.name}
                </span>
              ) : null}
            </div>

            <div className="grid gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => {
                    onWallColorChange(scheme.wall);
                    onFloorColorChange(scheme.floor);
                  }}
                  className={`rounded-[1.2rem] border p-3 text-left transition ${
                    activeScheme?.id === scheme.id
                      ? "border-charcoal bg-white shadow-soft"
                      : "border-stone-300 bg-stone-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="overflow-hidden rounded-full border border-stone-300">
                      <div className="h-5 w-10" style={{ backgroundColor: scheme.wall }} />
                      <div className="h-5 w-10" style={{ backgroundColor: scheme.floor }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{scheme.name}</p>
                      <p className="text-xs text-charcoal/60">{scheme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 text-sm text-charcoal/75">
            <p>
              Room Area: {roomArea} m<sup>2</sup>
            </p>
            <p className="mt-2">Furniture Items: {itemCount}</p>
            <p className="mt-2">Shape: {roomShapes.find((item) => item.id === shape)?.name}</p>
          </section>
        </div>
      ) : (
        <div className="mt-7 space-y-6">
          {selectedItem ? (
            <>
              <section className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">
                  Selected Furniture
                </p>
                <h3 className="mt-2 text-[1.25rem] font-semibold text-charcoal">
                  {selectedItem.label}
                </h3>
                <p className="mt-3 text-sm text-charcoal/70">
                  Position: X {Math.round(selectedItem.x)} / Y {Math.round(selectedItem.y)}
                </p>
                <p className="mt-2 text-sm text-charcoal/70">
                  Size: {Math.round(selectedItem.width)} × {Math.round(selectedItem.height)} px
                </p>
                <p className="mt-2 text-sm text-charcoal/70">
                  Current option: {selectedItem.selectedSizeLabel}
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-[1.1rem] font-semibold text-charcoal">
                  Available Colors
                </h3>

                <div className="flex flex-wrap gap-3">
                  {selectedItem.availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onSelectedItemColorChange(color)}
                      className={`h-11 w-11 rounded-full border-2 shadow-soft transition hover:scale-105 ${
                        selectedItem.color.toLowerCase() === color.toLowerCase()
                          ? "border-charcoal"
                          : "border-stone-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[1.1rem] font-semibold text-charcoal">
                  Available Sizes
                </h3>

                <div className="flex flex-wrap gap-3">
                  {selectedItem.availableSizes.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => onSelectedItemSizeChange(size)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selectedItem.selectedSizeLabel === size.label
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-stone-300 bg-stone-50 text-charcoal hover:bg-white"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 text-sm text-charcoal/75">
                <p>Type: {selectedItem.type}</p>
                <p className="mt-2">Color options: {selectedItem.availableColors.length}</p>
                <p className="mt-2">Size options: {selectedItem.availableSizes.length}</p>
              </section>
            </>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm leading-6 text-charcoal/60">
              Select a furniture item from the canvas to view and customize its details here.
            </div>
          )}
        </div>
      )}
    </aside>
  );
}