import type {
  FurnitureLibraryItem,
  FurnitureSizeOption,
} from "@/lib/furnitureItems";

export type PlannerItem = {
  id: string;
  type: FurnitureLibraryItem["type"];
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  availableColors: string[];
  availableSizes: FurnitureSizeOption[];
  selectedSizeLabel: string;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type PlannerItemPosition = {
  x?: number;
  y?: number;
};

export function createPlannerItem(
  item: FurnitureLibraryItem,
  currentCount: number,
  position?: PlannerItemPosition,
): PlannerItem {
  const mediumSize =
    item.availableSizes.find((size) => size.label === "Medium") ??
    item.availableSizes[0];

  return {
    id: `${item.type}-${Date.now()}-${currentCount}`,
    type: item.type,
    label: item.label,
    x: position?.x ?? 40 + (currentCount % 4) * 36,
    y: position?.y ?? 40 + (currentCount % 3) * 36,
    width: mediumSize?.width ?? item.width,
    height: mediumSize?.height ?? item.height,
    color: item.availableColors[0] ?? getPlannerItemColor(item.type),
    availableColors: item.availableColors,
    availableSizes: item.availableSizes,
    selectedSizeLabel: mediumSize?.label ?? "Medium",
  };
}

export function getPlannerItemColor(type: FurnitureLibraryItem["type"]) {
  switch (type) {
    case "sofa":
    case "sectional-sofa":
      return "#b49d86";
    case "armchair":
    case "accent-chair":
      return "#d6c1b0";
    case "coffee-table":
    case "dining-table":
    case "side-table":
      return "#cab48f";
    case "storage-shelf":
    case "cabinet":
    case "tv-console":
      return "#8f6a48";
    case "floor-lamp":
      return "#9cd8d8";
    case "bed":
      return "#e7dcc4";
    default:
      return "#cdb89d";
  }
}