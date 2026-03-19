"use client";

import Link from "next/link";
import { Cuboid, LampFloor, Leaf, Sofa, Tv, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RoomScene } from "@/components/3d/RoomScene";
import { getSavedDesigns, type SavedDesign } from "@/lib/savedDesigns";

const sceneFeatures = [
  { icon: Sofa, label: "Modern sofa composition" },
  { icon: Waves, label: "Soft Scandinavian materials" },
  { icon: Tv, label: "TV console and styling" },
  { icon: LampFloor, label: "Warm accent lighting" },
  { icon: Leaf, label: "Natural plant decor" },
];

export default function RoomDesigner3DPage() {
  const [design, setDesign] = useState<SavedDesign | null>(null);

  useEffect(() => {
    const saved = getSavedDesigns();

    if (saved.length > 0) {
      const latestDesign = [...saved].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )[0];

      setDesign(latestDesign);
    } else {
      setDesign(null);
    }
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <Navbar />

        <section className="w-full px-4 py-7 sm:px-6 sm:py-8 lg:px-7 lg:py-9">
          <div className="mx-auto w-full max-w-[1600px] space-y-6">
            <div className="glass-card rounded-[2rem] px-6 py-6 sm:px-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.26em] text-charcoal/46">
                    3D Room Preview
                  </p>
                  <h1 className="mt-3 text-[2.1rem] font-semibold tracking-tight text-charcoal sm:text-[2.5rem]">
                    Warm Scandinavian living room render
                  </h1>
                  <p className="mt-3 text-sm leading-7 text-charcoal/66 sm:text-[0.98rem]">
                    Explore your room with softer lighting, more realistic furniture
                    forms, and a calm interior perspective inspired by premium
                    Scandinavian renders.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/room-designer"
                    className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
                  >
                    Back to Designer
                  </Link>
                  <Link
                    href="/saved-designs"
                    className="button-pill gap-3 px-6 py-3 text-sm"
                  >
                    <Cuboid className="h-4.5 w-4.5" />
                    Saved Designs
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {sceneFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.label}
                      className="glass-subcard inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-charcoal/72"
                    >
                      <Icon className="h-4 w-4 text-charcoal/68" />
                      {feature.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-4 sm:p-5">
              {design ? (
                <RoomScene
                  roomWidth={design.roomWidth}
                  roomHeight={design.roomHeight}
                  wallColor={design.wallColor}
                  floorColor={design.floorColor}
                  items={design.items}
                />
              ) : (
                <div className="flex h-[68vh] min-h-[520px] items-center justify-center rounded-[1.8rem] border border-stone-300/70 bg-[linear-gradient(180deg,#f7f2eb_0%,#efe4d5_100%)] text-center shadow-soft">
                  <div className="max-w-xl px-6">
                    <h2 className="text-2xl font-semibold text-charcoal">
                      No 3D room to preview yet
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-charcoal/66 sm:text-[0.98rem]">
                      Save a 2D design first, then come back here to see it in a
                      more realistic 3D living room view.
                    </p>
                    <Link href="/room-designer" className="button-pill mt-6 inline-flex">
                      Create a 2D Layout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}