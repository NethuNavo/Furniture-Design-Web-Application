import { MoveDiagonal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  furnitureCategories,
  furnitureItems,
  type FurnitureCategory,
  type FurnitureLibraryItem,
} from "@/lib/furnitureItems";
import { FurnitureCard } from "@/components/planner/FurnitureCard";
import { getWishlistSlugs } from "@/lib/wishlist";

type FurnitureLibraryPanelProps = {
  activeCategory: FurnitureCategory;
  onCategoryChange: (category: FurnitureCategory) => void;
  onAddFurniture: (item: FurnitureLibraryItem) => void;
};

export function FurnitureLibraryPanel({
  activeCategory,
  onCategoryChange,
  onAddFurniture,
}: FurnitureLibraryPanelProps) {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);

  useEffect(() => {
    setWishlistSlugs(getWishlistSlugs());

    function handleFocus() {
      setWishlistSlugs(getWishlistSlugs());
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") {
      return furnitureItems;
    }

    if (activeCategory === "favorites") {
      return furnitureItems.filter(
        (item) => !!item.slug && wishlistSlugs.includes(item.slug),
      );
    }

    return furnitureItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, wishlistSlugs]);

  return (
    <aside className="h-full overflow-y-auto p-5 pr-3">
      <div className="flex items-center gap-3 text-charcoal">
        <MoveDiagonal className="h-5 w-5 text-charcoal/65" strokeWidth={1.8} />
        <h2 className="text-[1.65rem] font-semibold tracking-tight">
          Furniture Library
        </h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-charcoal/66">
        Add furniture from the shop collection, browse categories, and quickly
        access your favourites.
      </p>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-charcoal/60">
          Category
        </span>
        <select
          value={activeCategory}
          onChange={(event) =>
            onCategoryChange(event.target.value as FurnitureCategory)
          }
          className="w-full rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-charcoal shadow-soft outline-none"
        >
          {furnitureCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => (
            <FurnitureCard
              key={`${item.type}-${item.slug ?? index}`}
              item={item}
              onAdd={onAddFurniture}
            />
          ))
        ) : (
          <div className="col-span-2 rounded-[1.25rem] border border-dashed border-stone-300 bg-white/70 px-4 py-6 text-center text-sm leading-6 text-charcoal/60">
            No favourite furniture yet. Heart items in the shop and they will
            appear here.
          </div>
        )}
      </div>
    </aside>
  );
}