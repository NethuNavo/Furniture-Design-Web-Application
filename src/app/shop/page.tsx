"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { priceRanges, products, type PriceRangeId, type ProductCategory } from "@/lib/products";

type SortOption = "default" | "price-low" | "price-high" | "name-asc";

const validCategories: ProductCategory[] = ["sofas", "chairs", "tables", "storage"];

function parseCategoriesFromSearchParams(rawCategory: string | null): ProductCategory[] {
  if (!rawCategory) {
    return [];
  }

  return rawCategory
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is ProductCategory => validCategories.includes(item as ProductCategory));
}

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategories = parseCategoriesFromSearchParams(searchParams.get("category"));
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(initialCategories);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRangeId[]>([]);

  useEffect(() => {
    setSelectedCategories(parseCategoriesFromSearchParams(searchParams.get("category")));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((item) => item.id === rangeId);
          if (!range) {
            return false;
          }

          const minOkay = range.min === undefined || product.price >= range.min;
          const maxOkay = range.max === undefined || product.price <= range.max;
          return minOkay && maxOkay;
        });

      return matchesSearch && matchesCategory && matchesPrice;
    });

    const sorted = [...result];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [search, selectedCategories, selectedPriceRanges, sortBy]);

  function updateCategoryQuery(categories: ProductCategory[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (categories.length > 0) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function handleCategoryToggle(category: ProductCategory) {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(next);
    updateCategoryQuery(next);
  }

  function handlePriceRangeToggle(range: PriceRangeId) {
    setSelectedPriceRanges((current) =>
      current.includes(range) ? current.filter((item) => item !== range) : [...current, range],
    );
  }

  function handleSelectAllCategories() {
    setSelectedCategories([]);
    updateCategoryQuery([]);
  }

  function handleClearAll() {
    setSearch("");
    setSortBy("default");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    router.replace(pathname, { scroll: false });
  }

  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <Navbar />
      <ShopHeader
        search={search}
        productCount={filteredProducts.length}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
      />

      <section className="w-full px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6">
        <div className="mx-auto grid w-full max-w-[1440px] gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-5">
          <FilterSidebar
            selectedCategories={selectedCategories}
            selectedPriceRanges={selectedPriceRanges}
            onCategoryToggle={handleCategoryToggle}
            onSelectAllCategories={handleSelectAllCategories}
            onPriceRangeToggle={handlePriceRangeToggle}
            onClearAll={handleClearAll}
          />
          <ProductGrid products={filteredProducts} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
