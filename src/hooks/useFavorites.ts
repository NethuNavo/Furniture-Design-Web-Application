"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useCallback } from "react";

type Favorite = {
  productSlug: string;
  productName: string | null;
};

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/favorites?email=${encodeURIComponent(user.email)}`);
      
      if (!response.ok) {
        console.error("Failed to fetch favorites");
        return;
      }

      const data = await response.json() as { favorites: Favorite[] };
      setFavorites(data.favorites ?? []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Add to favorites
  const addToFavorites = useCallback(
    async (productSlug: string, productName?: string) => {
      if (!user?.email) {
        throw new Error("User must be logged in");
      }

      try {
        const response = await fetch("/api/users/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            productSlug,
            productName: productName || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json() as { error?: string };
          throw new Error(error.error || "Failed to add to favorites");
        }

        setFavorites((prev) => [
          { productSlug, productName: productName || null },
          ...prev.filter((fav) => fav.productSlug !== productSlug),
        ]);
      } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
      }
    },
    [user?.email]
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    async (productSlug: string) => {
      if (!user?.email) {
        throw new Error("User must be logged in");
      }

      try {
        const response = await fetch("/api/users/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            productSlug,
          }),
        });

        if (!response.ok) {
          const error = await response.json() as { error?: string };
          throw new Error(error.error || "Failed to remove from favorites");
        }

        setFavorites((prev) => prev.filter((fav) => fav.productSlug !== productSlug));
      } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
      }
    },
    [user?.email]
  );

  // Check if product is favorited
  const isFavorited = useCallback(
    (productSlug: string) => {
      return favorites.some((fav) => fav.productSlug === productSlug);
    },
    [favorites]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (productSlug: string, productName?: string) => {
      if (isFavorited(productSlug)) {
        await removeFromFavorites(productSlug);
      } else {
        await addToFavorites(productSlug, productName);
      }
    },
    [isFavorited, addToFavorites, removeFromFavorites]
  );

  return {
    favorites,
    isLoading,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    toggleFavorite,
  };
}
