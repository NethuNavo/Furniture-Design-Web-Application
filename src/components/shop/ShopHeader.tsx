import { Search } from "lucide-react";

type SortOption = "default" | "price-low" | "price-high" | "name-asc";

type ShopHeaderProps = {
  search: string;
  productCount: number;
  sortBy: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

export function ShopHeader({
  search,
  productCount,
  sortBy,
  onSearchChange,
  onSortChange,
}: ShopHeaderProps) {
  return (
    <section className="w-full px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-[1440px]">
      <div className="flex flex-col gap-3.5">
        <div className="space-y-3">
          <h1 className="font-display text-[2rem] font-semibold tracking-tight text-charcoal sm:text-[2.2rem] lg:text-[2.35rem]">
            Shop Furniture
          </h1>

          <label className="flex items-center gap-3 rounded-full border border-stone-300/80 bg-white/80 px-4 py-3 shadow-soft sm:px-5 sm:py-3">
            <Search className="h-4.5 w-4.5 shrink-0 text-charcoal/45" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search for furniture..."
              className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-charcoal/38"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-charcoal/68">{productCount} products</p>

          <label className="flex w-full items-center justify-between rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm text-charcoal shadow-soft sm:w-auto sm:min-w-[172px]">
            <span className="mr-3 text-charcoal/68">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="w-full bg-transparent pr-3 text-right text-charcoal outline-none sm:w-auto"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </label>
        </div>
      </div>
      </div>
    </section>
  );
}
