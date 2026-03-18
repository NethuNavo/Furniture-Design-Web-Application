"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export type SavedDesign = {
  id: string;
  title: string;
  roomWidth: number;
  roomHeight: number;
  roomShape: string;
  wallColor: string;
  floorColor: string;
  itemCount: number;
  items: unknown;
  createdAt: string;
  updatedAt: string;
};

export function useDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's designs
  const fetchDesigns = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/designs?email=${encodeURIComponent(user.email)}`);

      if (!response.ok) {
        // Silently fail and set empty designs
        setDesigns([]);
        return;
      }

      const data = await response.json() as { designs: SavedDesign[] };
      setDesigns(data.designs ?? []);
    } catch (error) {
      // Silently fail and set empty designs
      setDesigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Create new design
  const createDesign = useCallback(
    async (designData: Omit<SavedDesign, "id" | "createdAt" | "updatedAt">) => {
      if (!user?.email) {
        throw new Error("User must be logged in");
      }

      try {
        const response = await fetch("/api/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            ...designData,
          }),
        });

        if (!response.ok) {
          const error = await response.json() as { error?: string };
          throw new Error(error.error || "Failed to save design");
        }

        const data = await response.json() as { design: SavedDesign };
        setDesigns((prev) => [data.design, ...prev]);
        return data.design;
      } catch (error) {
        console.error("Error creating design:", error);
        throw error;
      }
    },
    [user?.email]
  );

  // Update design
  const updateDesign = useCallback(
    async (designId: string, updates: Partial<SavedDesign>) => {
      try {
        const response = await fetch("/api/designs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: designId,
            ...updates,
          }),
        });

        if (!response.ok) {
          const error = await response.json() as { error?: string };
          throw new Error(error.error || "Failed to update design");
        }

        const data = await response.json() as { design: SavedDesign };
        setDesigns((prev) =>
          prev.map((design) => (design.id === designId ? data.design : design))
        );
        return data.design;
      } catch (error) {
        console.error("Error updating design:", error);
        throw error;
      }
    },
    []
  );

  // Delete design
  const deleteDesign = useCallback(async (designId: string) => {
    try {
      const response = await fetch("/api/designs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: designId }),
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || "Failed to delete design");
      }

      setDesigns((prev) => prev.filter((design) => design.id !== designId));
    } catch (error) {
      console.error("Error deleting design:", error);
      throw error;
    }
  }, []);

  return {
    designs,
    isLoading,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
  };
}
