"use client";

import type { PlannerItem } from "@/lib/plannerUtils";

export type SavedRoomShape =
  | "rectangle"
  | "square"
  | "l-shape"
  | "open-plan"
  | "u-shape";

export type SavedDesign = {
  id: string;
  title: string;
  updatedAt: string;
  roomWidth: number;
  roomHeight: number;
  roomShape: SavedRoomShape;
  wallColor: string;
  floorColor: string;
  itemCount: number;
  items: PlannerItem[];
};

const SAVED_DESIGNS_STORAGE_KEY = "nord-living-saved-designs";


// ✅ MOCK DATA (ONLY used if nothing saved yet)
const mockSavedDesigns: SavedDesign[] = [
  {
    id: "mock-1",
    title: "My Nord Living Design",
    updatedAt: "2026-03-17T13:32:28.873Z",
    roomWidth: 500,
    roomHeight: 400,
    roomShape: "l-shape",
    wallColor: "#f5f1ea",
    floorColor: "#c9a26b",
    itemCount: 3,
    items: [
      {
        id: "sofa-1",
        type: "sofa",
        label: "Sofa",
        x: 120,
        y: 120,
        width: 180,
        height: 90,
        color: "#d8c7b4",
        availableColors: ["#d8c7b4"],
        availableSizes: [],
        selectedSizeLabel: "Medium",
      },
      {
        id: "table-1",
        type: "coffee-table",
        label: "Coffee Table",
        x: 200,
        y: 200,
        width: 100,
        height: 60,
        color: "#cab48f",
        availableColors: ["#cab48f"],
        availableSizes: [],
        selectedSizeLabel: "Medium",
      },
    ],
  },
  {
    id: "mock-2",
    title: "My Nord Living Design",
    updatedAt: "2026-03-17T13:32:14.291Z",
    roomWidth: 500,
    roomHeight: 400,
    roomShape: "l-shape",
    wallColor: "#f8f6f1",
    floorColor: "#b98b5c",
    itemCount: 2,
    items: [
      {
        id: "bed-1",
        type: "bed",
        label: "Bed",
        x: 140,
        y: 110,
        width: 200,
        height: 160,
        color: "#e7dcc4",
        availableColors: ["#e7dcc4"],
        availableSizes: [],
        selectedSizeLabel: "Medium",
      },
      {
        id: "lamp-1",
        type: "floor-lamp",
        label: "Floor Lamp",
        x: 80,
        y: 200,
        width: 40,
        height: 40,
        color: "#9cd8d8",
        availableColors: ["#9cd8d8"],
        availableSizes: [],
        selectedSizeLabel: "Medium",
      },
    ],
  },
];


export function getSavedDesigns(): SavedDesign[] {
  if (typeof window === "undefined") {
    return mockSavedDesigns;
  }

  try {
    const raw = window.localStorage.getItem(SAVED_DESIGNS_STORAGE_KEY);

    // ✅ If nothing saved → return mock
    if (!raw) {
      return mockSavedDesigns;
    }

    const parsed = JSON.parse(raw) as SavedDesign[];

    // ✅ If empty array → return mock
    if (!parsed || parsed.length === 0) {
      return mockSavedDesigns;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(SAVED_DESIGNS_STORAGE_KEY);
    return mockSavedDesigns;
  }
}


export function saveDesign(design: SavedDesign) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getSavedDesigns().filter(d => !d.id.startsWith("mock-"));

  const next = [design, ...current.filter((item) => item.id !== design.id)].slice(0, 12);

  window.localStorage.setItem(SAVED_DESIGNS_STORAGE_KEY, JSON.stringify(next));
}


export function deleteSavedDesign(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getSavedDesigns().filter(d => !d.id.startsWith("mock-"));
  const next = current.filter((item) => item.id !== id);

  window.localStorage.setItem(SAVED_DESIGNS_STORAGE_KEY, JSON.stringify(next));
}


export function updateSavedDesign(
  id: string,
  updates: Partial<Omit<SavedDesign, "id">>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getSavedDesigns().filter(d => !d.id.startsWith("mock-"));

  const next = current.map((item) =>
    item.id === id ? { ...item, ...updates } : item,
  );

  window.localStorage.setItem(SAVED_DESIGNS_STORAGE_KEY, JSON.stringify(next));
}