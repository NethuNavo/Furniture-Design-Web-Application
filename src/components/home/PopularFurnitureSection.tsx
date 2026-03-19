import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";

type Product = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

type PopularFurnitureSectionProps = {
  products: Product[];
};

export function PopularFurnitureSection({ products }: PopularFurnitureSectionProps) {
  return (
    <section id="shop" className="shell py-16 sm:py-20 lg:py-24">
      <div className="flex items-center justify-between gap-6">
        <h2 className="section-title">Popular Furniture</h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-base font-medium text-charcoal/66 transition hover:text-charcoal sm:text-lg"
        >
          View all
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-9 grid gap-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </section>
  );
}
