"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, DraftingCompass, FolderOpenDot, Edit2, Trash2, Copy } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useDesigns } from "@/hooks/useDesigns";

export default function SavedDesignsPage() {
  const { designs, isLoading, fetchDesigns, deleteDesign, updateDesign } = useDesigns();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveTitle = async (id: string) => {
    if (!editingTitle.trim()) return;
    try {
      await updateDesign(id, { title: editingTitle });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update design title:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDesign(id);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete design:", error);
    }
  };

  const handleDuplicate = async (design: typeof designs[0]) => {
    try {
      await updateDesign(design.id, {
        ...design,
        title: `${design.title} (Copy)`,
      });
    } catch (error) {
      console.error("Failed to duplicate design:", error);
    }
  };

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
                          {editingId === design.id ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTitle(design.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-1 text-lg font-semibold text-charcoal outline-none focus:border-charcoal"
                              autoFocus
                            />
                          ) : (
                            <h2 className="text-2xl font-semibold tracking-tight text-charcoal truncate">
                              {design.title}
                            </h2>
                          )}
                          <p className="text-sm text-charcoal/52 mt-1">
                            {new Date(design.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {editingId === design.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveTitle(design.id)}
                            className="rounded-lg bg-charcoal px-3 py-1 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg bg-stone-300 px-3 py-1 text-sm font-semibold text-charcoal transition hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(design.id, design.title)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-charcoal transition hover:bg-stone-200"
                            title="Edit design name"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
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
                          {design.roomShape === "rectangle" ? "Rectangle" : design.roomShape === "square" ? "Square" : design.roomShape === "u-shape" ? "U-Shape" : design.roomShape === "open-plan" ? "Open Plan" : "L-Shape"}
                        </p>
                      </div>
                      <div className="glass-subcard rounded-[1.2rem] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">Items</p>
                        <p className="mt-1 text-sm font-semibold text-charcoal">{design.itemCount} placed</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3 flex-wrap">
                      <Link
                        href="/room-designer"
                        className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Open
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(design)}
                        className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-stone-50"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => setDeletingId(design.id)}
                        className="ml-auto inline-flex items-center gap-2 rounded-full border border-red-300/50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {deletingId === design.id && (
                      <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900">Delete this design?</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleDelete(design.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="rounded-lg bg-stone-300 px-4 py-2 text-sm font-semibold text-charcoal transition hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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
