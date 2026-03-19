"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Cuboid } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoomScene } from "@/components/3d/RoomScene";
import type { SavedDesign } from "@/lib/savedDesigns";

const CURRENT_DESIGN_STORAGE_KEY = "nord-living-current-design";

type CurrentDraft = Omit<SavedDesign, "id">;

export default function RoomDesigner3DPage() {
  const [design, setDesign] = useState<CurrentDraft | null>(null);
  const [sceneKey, setSceneKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadCurrentDraft = () => {
      const currentDraftRaw = window.localStorage.getItem(CURRENT_DESIGN_STORAGE_KEY);

      if (!currentDraftRaw) {
        setDesign(null);
        return;
      }

      try {
        const parsed = JSON.parse(currentDraftRaw) as CurrentDraft;
        setDesign(parsed);
        setSceneKey((prev) => prev + 1);
      } catch {
        window.localStorage.removeItem(CURRENT_DESIGN_STORAGE_KEY);
        setDesign(null);
      }
    };

    loadCurrentDraft();

    window.addEventListener("focus", loadCurrentDraft);
    window.addEventListener("storage", loadCurrentDraft);

    return () => {
      window.removeEventListener("focus", loadCurrentDraft);
      window.removeEventListener("storage", loadCurrentDraft);
    };
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <section className="w-full px-5 py-5">
          <div className="mx-auto w-full max-w-[1600px] space-y-5">
            <div className="rounded-[2rem] border border-stone-300/70 bg-white/85 px-6 py-5 shadow-soft-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Link
                    href="/room-designer/2d"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:opacity-70"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to 2D Design
                  </Link>

                  <p className="mt-4 text-xs uppercase tracking-[0.26em] text-charcoal/46">
                    3D Room Preview
                  </p>
                  <h1 className="mt-2 text-[2.1rem] font-semibold tracking-tight text-charcoal">
                    Your room in 3D
                  </h1>
                  <p className="mt-2 text-sm leading-7 text-charcoal/66">
                    Review the same room details, colors, and placed furniture from your 2D design.
                  </p>
                </div>

                <Link
                  href="/saved-designs"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
                >
                  <Cuboid className="h-4 w-4" />
                  Saved Designs
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-stone-300/70 bg-white/85 p-4 shadow-soft-lg sm:p-5">
              {design ? (
                <RoomScene
                  key={sceneKey}
                  roomWidth={design.roomWidth}
                  roomHeight={design.roomHeight}
                  wallColor={design.wallColor}
                  floorColor={design.floorColor}
                  roomShape={design.roomShape}
                  items={design.items}
                />
              ) : (
                <div className="flex h-[72vh] min-h-[540px] items-center justify-center rounded-[1.8rem] border border-stone-300/70 bg-[linear-gradient(180deg,#f7f2eb_0%,#efe4d5_100%)] text-center shadow-soft">
                  <div className="max-w-xl px-6">
                    <h2 className="text-2xl font-semibold text-charcoal">
                      No 3D room to preview yet
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-charcoal/66">
                      Create your room in 2D first, then open this page again to preview it in 3D.
                    </p>
                    <Link
                      href="/room-designer/2d"
                      className="mt-6 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white shadow-soft"
                    >
                      Go to 2D Designer
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}