import Link from "next/link";
import { Armchair, Grid2X2, PackageOpen, Sofa } from "lucide-react";

type Category = {
  name: string;
  itemCount: string;
  slug: "sofas" | "chairs" | "tables" | "storage";
  icon: "sofa" | "chair" | "table" | "storage";
  imageUrl: string;
};

type CategorySectionProps = {
  categories: Category[];
};

const iconMap = {
  sofa: Sofa,
  chair: Armchair,
  table: Grid2X2,
  storage: PackageOpen,
};

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section id="browse-by-category" className="shell py-16 sm:py-20 lg:py-24">
      <div className="space-y-8">
        <h2 className="section-title">Browse by Category</h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];

            return (
              <Link
                key={category.name}
                href={`/shop?category=${category.slug}`}
                className="glass-card block rounded-[1.8rem] px-6 py-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft-lg sm:px-7 sm:py-7"
              >
                <div className="overflow-hidden rounded-[1.5rem] glass-subcard">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-32 w-full object-cover transition duration-500 hover:scale-[1.03] sm:h-36"
                  />
                </div>
                <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-stone-100 text-charcoal">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 text-[1.6rem] font-semibold tracking-tight text-charcoal">
                  {category.name}
                </h3>
                <p className="mt-2 text-base text-charcoal/60">{category.itemCount}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
