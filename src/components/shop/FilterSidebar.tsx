import { priceRanges, type PriceRangeId, type ProductCategory } from "@/lib/products";

type FilterSidebarProps = {
  selectedCategories: ProductCategory[];
  selectedPriceRanges: PriceRangeId[];
  onCategoryToggle: (category: ProductCategory) => void;
  onSelectAllCategories: () => void;
  onPriceRangeToggle: (range: PriceRangeId) => void;
  onClearAll: () => void;
};

const categoryOptions: Array<{ label: string; value: ProductCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Sofas", value: "sofas" },
  { label: "Chairs", value: "chairs" },
  { label: "Tables", value: "tables" },
  { label: "Storage", value: "storage" },
];

export function FilterSidebar({
  selectedCategories,
  selectedPriceRanges,
  onCategoryToggle,
  onSelectAllCategories,
  onPriceRangeToggle,
  onClearAll,
}: FilterSidebarProps) {
  const allSelected = selectedCategories.length === 0;

  return (
    <aside className="glass-card rounded-[1.5rem] p-4 lg:h-[calc(100vh-214px)] lg:overflow-y-auto lg:sticky lg:top-[146px] lg:w-[230px] xl:w-[245px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[1.25rem] font-semibold tracking-tight text-charcoal">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium text-charcoal/66 transition hover:text-charcoal"
        >
          Clear all
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <h3 className="text-base font-semibold tracking-tight text-charcoal">Category</h3>
          <div className="mt-3 space-y-2.5">
            {categoryOptions.map((option) => {
              const checked =
                option.value === "all"
                  ? allSelected
                  : selectedCategories.includes(option.value as ProductCategory);

              return (
                <label
                  key={option.label}
                  className="flex items-center gap-3 text-sm text-charcoal/78"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      option.value === "all"
                        ? onSelectAllCategories()
                        : onCategoryToggle(option.value as ProductCategory)
                    }
                    className="h-4 w-4 rounded border-stone-300 text-charcoal focus:ring-charcoal"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="border-t border-stone-200 pt-5">
          <h3 className="text-base font-semibold tracking-tight text-charcoal">Price Range</h3>
          <div className="mt-3 space-y-2.5">
            {priceRanges.map((range) => (
              <label key={range.id} className="flex items-center gap-3 text-sm text-charcoal/78">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.includes(range.id)}
                  onChange={() => onPriceRangeToggle(range.id)}
                  className="h-4 w-4 rounded border-stone-300 text-charcoal focus:ring-charcoal"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
