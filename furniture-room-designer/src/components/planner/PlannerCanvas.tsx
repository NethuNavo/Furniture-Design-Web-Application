"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Expand,
  Grid2X2,
  Eraser,
  Minus,
  Plus,
  ScanSearch,
  X,
} from "lucide-react";
import type { FurnitureLibraryItem } from "@/lib/furnitureItems";
import type { PlannerItem } from "@/lib/plannerUtils";
import { clamp } from "@/lib/plannerUtils";

type PlannerCanvasProps = {
  width: number;
  height: number;
  roomShape: "rectangle" | "l-shape" | "square" | "open-plan" | "u-shape";
  wallColor: string;
  floorColor: string;
  showGrid: boolean;
  items: PlannerItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItemPosition: (id: string, x: number, y: number) => void;
  onDropFurniture: (item: FurnitureLibraryItem, x: number, y: number) => void;
  onToggleGrid: () => void;
  onClear: () => void;
};

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
};

export default function PlannerCanvas({
  width,
  height,
  roomShape,
  wallColor,
  floorColor,
  showGrid,
  items,
  selectedItemId,
  onSelectItem,
  onUpdateItemPosition,
  onDropFurniture,
  onToggleGrid,
  onClear,
}: PlannerCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const updateScale = () => {
      const horizontalPadding = isExpanded ? 56 : 40;
      const verticalPadding = isExpanded ? 56 : 40;

      const availableWidth = element.clientWidth - horizontalPadding;
      const availableHeight = element.clientHeight - verticalPadding;

      if (availableWidth <= 0 || availableHeight <= 0) {
        setFitScale(1);
        return;
      }

      const nextScale = Math.min(
        availableWidth / width,
        availableHeight / height,
        1.2,
      );

      setFitScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => updateScale());
    observer.observe(element);

    return () => observer.disconnect();
  }, [width, height, isExpanded]);

  const finalScale = fitScale * zoom;

  const getClipPath = () => {
    switch (roomShape) {
      case "l-shape":
        return "polygon(0 0, 100% 0, 100% 64%, 66% 64%, 66% 100%, 0 100%)";
      case "u-shape":
        return "polygon(0 0, 100% 0, 100% 100%, 76% 100%, 76% 34%, 24% 34%, 24% 100%, 0 100%)";
      case "open-plan":
        return "polygon(4% 4%, 96% 4%, 96% 96%, 4% 96%)";
      case "square":
      case "rectangle":
      default:
        return "none";
    }
  };

  const getRoundingClass = () => {
    switch (roomShape) {
      case "l-shape":
        return "rounded-[1rem_1rem_0.65rem_1rem]";
      case "u-shape":
      case "open-plan":
      case "square":
        return "rounded-[1rem]";
      default:
        return "rounded-[0.9rem]";
    }
  };

  const gridBackground = useMemo(
    () =>
      showGrid
        ? {
            backgroundImage:
              "linear-gradient(rgba(145,120,92,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(145,120,92,0.22) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }
        : {},
    [showGrid],
  );

  function startDrag(
    event: React.PointerEvent<HTMLButtonElement>,
    item: PlannerItem,
  ) {
    const rect = event.currentTarget.getBoundingClientRect();

    setDragState({
      id: item.id,
      offsetX: (event.clientX - rect.left) / finalScale,
      offsetY: (event.clientY - rect.top) / finalScale,
    });

    event.currentTarget.setPointerCapture(event.pointerId);
    onSelectItem(item.id);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState || !canvasRef.current) return;

    const bounds = canvasRef.current.getBoundingClientRect();
    const activeItem = items.find((item) => item.id === dragState.id);
    if (!activeItem) return;

    const nextX = clamp(
      (event.clientX - bounds.left) / finalScale - dragState.offsetX,
      0,
      width - activeItem.width,
    );
    const nextY = clamp(
      (event.clientY - bounds.top) / finalScale - dragState.offsetY,
      0,
      height - activeItem.height,
    );

    onUpdateItemPosition(activeItem.id, nextX, nextY);
  }

  function stopDrag() {
    setDragState(null);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDropActive(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDropActive(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDropActive(false);

    if (!canvasRef.current) return;

    const raw = event.dataTransfer.getData("application/x-nord-furniture");
    if (!raw) return;

    try {
      const item = JSON.parse(raw) as FurnitureLibraryItem;
      const bounds = canvasRef.current.getBoundingClientRect();

      const nextX = clamp(
        (event.clientX - bounds.left) / finalScale - item.width / 2,
        0,
        width - item.width,
      );
      const nextY = clamp(
        (event.clientY - bounds.top) / finalScale - item.height / 2,
        0,
        height - item.height,
      );

      onDropFurniture(item, nextX, nextY);
    } catch {
      return;
    }
  }

  const canvasShellClassName = isExpanded
    ? "fixed inset-4 z-[110] rounded-[2rem] border border-stone-300 bg-white p-4 shadow-2xl"
    : "flex h-full min-h-0 flex-col rounded-[1.6rem] border border-stone-300/80 bg-[#f7f3ee] p-4 shadow-soft";

  return (
    <section className={canvasShellClassName}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleGrid}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              showGrid
                ? "bg-charcoal text-white shadow-soft"
                : "border border-stone-300 bg-white text-charcoal hover:bg-stone-50"
            }`}
          >
            <Grid2X2 className="h-4 w-4" />
            Grid
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-stone-50"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setZoom((prev) => Math.max(0.7, Number((prev - 0.1).toFixed(2))))
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-charcoal shadow-soft transition hover:bg-stone-50"
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-charcoal shadow-soft">
            {Math.round(finalScale * 100)}%
          </div>

          <button
            type="button"
            onClick={() =>
              setZoom((prev) => Math.min(2, Number((prev + 0.1).toFixed(2))))
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-charcoal shadow-soft transition hover:bg-stone-50"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoom(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-charcoal shadow-soft transition hover:bg-stone-50"
            title="Fit view"
          >
            <ScanSearch className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-charcoal shadow-soft transition hover:bg-stone-50"
            title={isExpanded ? "Close expanded view" : "Expand canvas"}
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.6rem] bg-[#f4efe8] p-4"
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${finalScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            ref={canvasRef}
            className={`relative overflow-hidden border border-stone-300/80 bg-[#fbf8f2] shadow-soft ${getRoundingClass()}`}
            style={{
              width,
              height,
              backgroundColor: floorColor || "#fbf8f2",
              ...gridBackground,
            }}
            onClick={() => onSelectItem(null)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className="absolute inset-0"
              style={{
                background: floorColor || "#fbf8f2",
                clipPath: getClipPath(),
              }}
            />

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: `inset 0 0 0 10px ${wallColor}`,
                clipPath: getClipPath(),
              }}
            />

            {isDropActive ? (
              <div className="absolute inset-0 z-10 border-2 border-dashed border-charcoal/35 bg-white/30" />
            ) : null}

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-charcoal/70 shadow-soft">
              W: {(width / 100).toFixed(1)}m
            </div>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-charcoal/70 shadow-soft [writing-mode:vertical-rl]">
              H: {(height / 100).toFixed(1)}m
            </div>

            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onPointerDown={(event) => startDrag(event, item)}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectItem(item.id);
                }}
                className={`absolute flex items-center justify-center rounded-[0.45rem] border-2 px-2 text-center text-[11px] font-semibold text-charcoal shadow-[0_4px_10px_rgba(58,49,44,0.08)] transition ${
                  selectedItemId === item.id
                    ? "border-[#7a8fd8] ring-2 ring-[#7a8fd8]/20"
                    : "border-charcoal/45 hover:border-charcoal/75"
                }`}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  backgroundColor: `${item.color ?? "#f6ecd8"}cc`,
                }}
              >
                <span className="leading-4">{shortLabel(item.label)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function shortLabel(label: string) {
  return label
    .replace("Nord Living ", "")
    .replace("Minimal ", "")
    .replace("Scandinavian ", "")
    .replace("Modern ", "");
}