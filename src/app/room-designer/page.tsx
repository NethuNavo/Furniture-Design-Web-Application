"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  PencilRuler,
  Box,
  RectangleHorizontal,
  PanelsTopLeft,
  Shapes,
  Palette,
} from "lucide-react";
import homePageCoverImage from "../../../image/home page cover 2.png";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type RoomShape =
  | "rectangle"
  | "l-shape"
  | "square"
  | "u-shape"
  | "open-plan";

type ColorScheme = {
  id: string;
  name: string;
  description: string;
  wall: string;
  floor: string;
};

const roomShapes: {
  id: RoomShape;
  name: string;
  description: string;
  icon: typeof RectangleHorizontal;
}[] = [
  {
    id: "rectangle",
    name: "Rectangle",
    description: "Best for common bedroom and living layouts.",
    icon: RectangleHorizontal,
  },
  {
    id: "square",
    name: "Square",
    description: "Balanced layout for compact rooms.",
    icon: Shapes,
  },
  {
    id: "l-shape",
    name: "L-Shape",
    description: "Great for split functional areas.",
    icon: PanelsTopLeft,
  },
  {
    id: "u-shape",
    name: "U-Shape",
    description: "Works well for enclosed planning zones.",
    icon: Shapes,
  },
  {
    id: "open-plan",
    name: "Open Plan",
    description: "For larger connected spaces.",
    icon: Shapes,
  },
];

const colorSchemes: ColorScheme[] = [
  {
    id: "light-neutral",
    name: "Light Neutral",
    description: "Soft beige tones for calm and airy interiors.",
    wall: "#f4efe8",
    floor: "#d9c7ae",
  },
  {
    id: "warm-beige",
    name: "Warm Beige",
    description: "A cozy palette for bedrooms and family rooms.",
    wall: "#eadcc8",
    floor: "#b9855b",
  },
  {
    id: "cool-grey",
    name: "Cool Grey",
    description: "Modern contrast for office-inspired spaces.",
    wall: "#d9dde2",
    floor: "#7d8794",
  },
  {
    id: "earthy-oak",
    name: "Earthy Oak",
    description: "Natural warm wood feeling for welcoming rooms.",
    wall: "#e7ddcf",
    floor: "#8b6b4c",
  },
  {
    id: "soft-minimal",
    name: "Soft Minimal",
    description: "Light monochrome styling for a clean look.",
    wall: "#efede8",
    floor: "#cfc8be",
  },
  {
    id: "charcoal-modern",
    name: "Charcoal Modern",
    description: "Bold darker tones for premium spaces.",
    wall: "#cfd2d8",
    floor: "#4d5561",
  },
];

const heroImageUrl = homePageCoverImage.src;

export default function RoomDesignerPage() {
  const router = useRouter();

  const [width, setWidth] = useState(5);
  const [length, setLength] = useState(4);
  const [height, setHeight] = useState(2.8);
  const [shape, setShape] = useState<RoomShape>("rectangle");
  const [wallColor, setWallColor] = useState("#f4efe8");
  const [floorColor, setFloorColor] = useState("#d9c7ae");
  const [selectedScheme, setSelectedScheme] = useState("light-neutral");

  const activeScheme = useMemo(() => {
    return colorSchemes.find((scheme) => scheme.id === selectedScheme) ?? colorSchemes[0];
  }, [selectedScheme]);

  const roomArea = useMemo(() => (width * length).toFixed(1), [width, length]);

  const handleSchemeSelect = (schemeId: string) => {
    const scheme = colorSchemes.find((item) => item.id === schemeId);
    if (!scheme) return;

    setSelectedScheme(scheme.id);
    setWallColor(scheme.wall);
    setFloorColor(scheme.floor);
  };

  const handleProceed = () => {
    const params = new URLSearchParams({
      width: String(width),
      length: String(length),
      height: String(height),
      shape,
      wallColor,
      floorColor,
    });

    router.push(`/room-designer/2d?${params.toString()}`);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <Navbar />

        <section className="w-full px-0 py-4 sm:py-6 lg:py-8">
          <div className="relative overflow-hidden border-y border-white/70 shadow-soft-lg sm:mx-4 sm:rounded-[1.75rem] sm:border lg:mx-6">
            <img
              src={heroImageUrl}
              alt="Warm Scandinavian living room interior"
              className="h-[320px] w-full object-cover sm:h-[390px] lg:h-[450px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,22,18,0.30)_0%,rgba(28,22,18,0.56)_100%)]" />

            <div className="absolute inset-0 flex items-end px-5 py-7 sm:px-8 sm:py-8 lg:px-12">
              <div className="max-w-3xl text-white">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/85 sm:text-xs">
                  Customer Workflow
                </p>

                <h1 className="mt-3 font-display text-[2rem] font-semibold leading-tight tracking-tight text-white [text-shadow:0_6px_24px_rgba(0,0,0,0.35)] sm:text-[2.7rem] lg:text-[3.2rem]">
                  Create your room design in three simple steps.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/95 sm:text-[15px] sm:leading-7">
                  Add room details, continue to the editable 2D layout, and then
                  preview the same design in 3D when you are ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="shell pb-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Select room details",
                text: "Set dimensions, choose the room shape, and pick a color palette before you begin.",
                icon: Package,
              },
              {
                step: "02",
                title: "Edit in 2D",
                text: "Arrange furniture in the planner and improve your room layout clearly.",
                icon: PencilRuler,
              },
              {
                step: "03",
                title: "View in 3D",
                text: "Check the final room feel in a more immersive perspective.",
                icon: Box,
              },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.step}
                  className="rounded-[1.5rem] border border-white/60 bg-white/75 p-5 shadow-soft-lg"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-charcoal shadow-soft">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] tracking-[0.22em] text-charcoal/45">
                      {card.step}
                    </span>
                  </div>

                  <h3 className="font-display text-[1.35rem] font-semibold leading-snug text-charcoal">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-charcoal/78">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="shell pb-16 pt-4">
          <div className="rounded-[2rem] border border-white/65 bg-white/80 p-6 shadow-soft-lg md:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal/58">
                Step 01
              </p>

              <h2 className="font-display text-[2rem] font-semibold leading-tight text-charcoal sm:text-[2.35rem]">
                Add your room details
              </h2>

              <p className="max-w-3xl text-sm leading-6 text-charcoal/76 sm:text-[15px]">
                Choose your room size, layout shape, and color direction before
                moving into the editable 2D design workspace.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-7">
                <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
                  <h3 className="font-display text-[1.35rem] font-semibold text-charcoal">
                    Room dimensions
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm text-charcoal/78">Width</span>
                      <input
                        type="number"
                        step="0.1"
                        min="2"
                        max="10"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
                      />
                      <p className="text-xs text-charcoal/50">2 - 10 m</p>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-charcoal/78">Length</span>
                      <input
                        type="number"
                        step="0.1"
                        min="2"
                        max="10"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
                      />
                      <p className="text-xs text-charcoal/50">2 - 10 m</p>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-charcoal/78">Height</span>
                      <input
                        type="number"
                        step="0.1"
                        min="2"
                        max="4"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-3 text-base text-charcoal outline-none"
                      />
                      <p className="text-xs text-charcoal/50">2 - 4 m</p>
                    </label>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
                  <h3 className="font-display text-[1.35rem] font-semibold text-charcoal">
                    Room shape
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {roomShapes.map((roomShape) => {
                      const Icon = roomShape.icon;
                      const active = shape === roomShape.id;

                      return (
                        <button
                          key={roomShape.id}
                          type="button"
                          onClick={() => setShape(roomShape.id)}
                          className={`rounded-[1.2rem] border p-4 text-left transition ${
                            active
                              ? "border-charcoal bg-white shadow-soft-lg"
                              : "border-stone-200 bg-stone-50 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-charcoal">
                              <Icon size={16} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-charcoal">
                                {roomShape.name}
                              </h4>
                              <p className="mt-1 text-xs leading-5 text-charcoal/65">
                                {roomShape.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
                  <h3 className="font-display text-[1.35rem] font-semibold text-charcoal">
                    Color scheme
                  </h3>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {colorSchemes.map((scheme) => {
                      const active = selectedScheme === scheme.id;

                      return (
                        <button
                          key={scheme.id}
                          type="button"
                          onClick={() => handleSchemeSelect(scheme.id)}
                          className={`rounded-[1.2rem] border p-4 text-left transition ${
                            active
                              ? "border-charcoal bg-white shadow-soft-lg"
                              : "border-stone-200 bg-stone-50 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-charcoal">
                              <Palette size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-charcoal">
                                {scheme.name}
                              </h4>
                              <p className="mt-1 text-xs leading-5 text-charcoal/65">
                                {scheme.description}
                              </p>

                              <div className="mt-3 flex gap-2">
                                <div
                                  className="h-3 flex-1 rounded-full"
                                  style={{ backgroundColor: scheme.wall }}
                                />
                                <div
                                  className="h-3 flex-1 rounded-full"
                                  style={{ backgroundColor: scheme.floor }}
                                />
                              </div>

                              <div className="mt-3 grid gap-1 text-[11px] text-charcoal/62 sm:grid-cols-2">
                                <span>Wall: {scheme.wall}</span>
                                <span>Floor: {scheme.floor}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleProceed}
                    className="button-pill min-w-[240px] px-8 py-4 text-sm sm:text-base"
                  >
                    Proceed to 2D Layout
                  </button>
                </div>
              </div>

              <aside className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5">
                <h3 className="font-display text-[1.3rem] font-semibold text-charcoal">
                  Design summary
                </h3>

                <div className="mt-4 space-y-4 text-sm text-charcoal/78">
                  <div className="rounded-[1rem] border border-stone-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">
                      Room
                    </p>
                    <p className="mt-2 font-medium text-charcoal">
                      {shape.replace("-", " ")}
                    </p>
                    <p className="mt-1 text-charcoal/65">
                      {width}m × {length}m × {height}m
                    </p>
                    <p className="mt-1 text-charcoal/65">
                      Area: {roomArea} m²
                    </p>
                  </div>

                  <div className="rounded-[1rem] border border-stone-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">
                      Selected scheme
                    </p>
                    <p className="mt-2 font-medium text-charcoal">
                      {activeScheme.name}
                    </p>
                    <p className="mt-1 text-charcoal/65">
                      {activeScheme.description}
                    </p>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs text-charcoal/62">
                          <span>Wall color</span>
                          <span>{wallColor}</span>
                        </div>
                        <div
                          className="h-4 rounded-full border border-stone-200"
                          style={{ backgroundColor: wallColor }}
                        />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs text-charcoal/62">
                          <span>Floor color</span>
                          <span>{floorColor}</span>
                        </div>
                        <div
                          className="h-4 rounded-full border border-stone-200"
                          style={{ backgroundColor: floorColor }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1rem] border border-stone-200 bg-white p-4 text-xs leading-5 text-charcoal/62">
                    Your selected wall color and floor color are shown here clearly
                    before you continue to the 2D editor.
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
