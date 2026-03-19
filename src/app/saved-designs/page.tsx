"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, DraftingCompass, FolderOpenDot } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useDesigns } from "@/hooks/useDesigns";

export default function SavedDesignsPage() {
  const { designs, isLoading, fetchDesigns } = useDesigns();

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <Navbar />
        <section className="w-full px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
          <div className="mx-auto w-full max-w-[1360px] space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-charcoal/42">Saved Designs</p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                Your saved room concepts
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-charcoal/66">
                Reopen saved 2D layouts, continue editing them, and move back into the 3D preview whenever you need.
              </p>
            </div>

            {isLoading ? (
              <div className="glass-card rounded-[2rem] p-8 text-center">
                <p className="text-charcoal/66">Loading your designs...</p>
              </div>
            ) : designs.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {designs.map((design) => (
                  <article key={design.id} className="glass-card rounded-[2rem] p-6 transition hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 text-charcoal shadow-soft">
                          <FolderOpenDot className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl font-semibold tracking-tight text-charcoal truncate">
                            {design.title}
                          </h2>
                          <p className="text-sm text-charcoal/52 mt-1">
                            {new Date(design.updatedAt).toISOString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="glass-subcard rounded-[1.2rem] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">Room</p>
                        <p className="mt-1 text-sm font-semibold text-charcoal">
                          {Math.round(design.roomWidth / 100)}m × {Math.round(design.roomHeight / 100)}m
                        </p>
                      </div>
                      <div className="glass-subcard rounded-[1.2rem] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">Shape</p>
                        <p className="mt-1 text-sm font-semibold text-charcoal">
                          {design.roomShape === "rectangle" ? "Rectangle" : "L-Shape"}
                        </p>
                      </div>
                      <div className="glass-subcard rounded-[1.2rem] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">Items</p>
                        <p className="mt-1 text-sm font-semibold text-charcoal">{design.itemCount} placed</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        href="/room-designer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:text-charcoal/80"
                      >
                        Open in planner
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-[2rem] p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-50 text-charcoal shadow-soft">
                  <DraftingCompass className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">No saved designs yet</h2>
                <p className="mx-auto mt-3 max-w-xl text-charcoal/64">
                  Start in Room Designer, edit your layout in 2D, then save it to keep a personal library of room concepts.
                </p>
                <Link href="/room-designer" className="button-pill mt-7">
                  Open Room Designer
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
