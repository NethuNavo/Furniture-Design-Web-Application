import {
  Armchair,
  Bed,
  Grid2X2,
  LampFloor,
  PackageOpen,
  Sofa,
} from "lucide-react";
import type { FurnitureLibraryItem } from "@/lib/furnitureItems";

type FurnitureCardProps = {
  item: FurnitureLibraryItem;
  onAdd: (item: FurnitureLibraryItem) => void;
};

const iconMap = {
  sofa: Sofa,
  armchair: Armchair,
  table: Grid2X2,
  bed: Bed,
  cabinet: PackageOpen,
  lamp: LampFloor,
} as const;

export function FurnitureCard({ item, onAdd }: FurnitureCardProps) {
  // ✅ SAFE fallback icon
  const Icon =
    iconMap[item.icon as keyof typeof iconMap] || PackageOpen;

  return (
    <button
      type="button"
      draggable
      onClick={() => onAdd(item)}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(
          "application/x-nord-furniture",
          JSON.stringify(item)
        );
      }}
      className="flex min-h-[138px] flex-col items-center justify-center rounded-[1.35rem] border border-stone-300/80 bg-white/95 px-3 py-3 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-stone-400/80 hover:shadow-soft-lg"
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.label}
          className="h-16 w-full rounded-[0.95rem] object-cover"
        />
      ) : (
        <div className="flex h-16 w-full items-center justify-center rounded-[0.95rem] bg-stone-50">
          <Icon className="h-8 w-8 text-charcoal/68" strokeWidth={1.8} />
        </div>
      )}

      <span className="mt-3 line-clamp-2 text-[0.92rem] font-medium leading-5 text-charcoal">
        {item.label}
      </span>
    </button>
  );
}