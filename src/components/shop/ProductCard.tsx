"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    setIsFavoritedLocal(isFavorited(product.slug));
  }, [product.slug, isFavorited]);

  const handleToggleFavorite = async () => {
    if (!user?.email) {
      // If not logged in, use local wishlist
      setIsFavoritedLocal(!isFavoritedLocal);
      return;
    }

    try {
      setIsTogglingFavorite(true);
      await toggleFavorite(product.slug, product.name);
      setIsFavoritedLocal(!isFavoritedLocal);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <article className="glass-card group overflow-hidden rounded-[1.55rem] transition duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative overflow-hidden rounded-t-[1.55rem]">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[15.5rem] xl:h-[17rem]"
        />

        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/55 text-charcoal shadow-soft backdrop-blur-sm transition hover:scale-105 disabled:opacity-50"
          aria-label={isFavoritedLocal ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4.5 w-4.5 ${isFavoritedLocal ? "fill-charcoal text-charcoal" : "text-charcoal/70"}`}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="space-y-2 px-5 py-4 sm:px-5.5 sm:py-4.5">
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-[1.18rem] font-semibold tracking-tight text-charcoal transition group-hover:text-charcoal/85 sm:text-[1.28rem]">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm leading-6 text-charcoal/62">
          {product.material} <span aria-hidden="true">&bull;</span> {product.color}
        </p>
        <p className="pt-1 text-[1.18rem] font-semibold text-charcoal whitespace-nowrap">
          {formattedPrice}
        </p>
      </div>
    </article>
  );
}
