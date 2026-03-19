import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="glass-card rounded-[1.5rem] px-6 py-12 text-center lg:h-[calc(100vh-214px)] lg:overflow-y-auto">
        <h3 className="text-2xl font-semibold tracking-tight text-charcoal">No products found</h3>
        <p className="mt-3 text-base leading-7 text-charcoal/66">
          Try adjusting your search, category, or price filters to explore more furniture.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[1.5rem] p-3 lg:h-[calc(100vh-214px)] lg:overflow-y-auto">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 xl:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
