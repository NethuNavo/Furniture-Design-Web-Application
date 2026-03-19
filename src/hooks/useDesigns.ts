"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getSavedDesigns,
  saveDesign,
  deleteSavedDesign,
  updateSavedDesign,
  type SavedDesign,
} from "@/lib/savedDesigns";

export function useDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDesigns = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const localDesigns = getSavedDesigns();
      setDesigns(localDesigns ?? []);
    } catch (error) {
      console.error("Error fetching designs:", error);
      setDesigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  const createDesign = useCallback(
    async (designData: Omit<SavedDesign, "id" | "updatedAt">) => {
      if (!user?.email) {
        throw new Error("User must be logged in");
      }

      try {
        const design: SavedDesign = {
          id: `design-${Date.now()}`,
          ...designData,
          updatedAt: new Date().toISOString(),
        };

        saveDesign(design);
        setDesigns((prev) => [design, ...prev.filter((item) => item.id !== design.id)]);
        return design;
      } catch (error) {
        console.error("Error creating design:", error);
        throw error;
      }
    },
    [user?.email]
  );

  const updateDesign = useCallback(
    async (designId: string, updates: Partial<SavedDesign>) => {
      try {
        updateSavedDesign(designId, updates);
        const refreshed = getSavedDesigns();
        const updated = refreshed.find((design) => design.id === designId);

        setDesigns(refreshed);

        if (!updated) {
          throw new Error("Failed to update design");
        }

        return updated;
      } catch (error) {
        console.error("Error updating design:", error);
        throw error;
      }
    },
    []
  );

  const deleteDesign = useCallback(async (designId: string) => {
    try {
      deleteSavedDesign(designId);
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
