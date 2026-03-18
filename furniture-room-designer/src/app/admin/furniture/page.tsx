"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";

const defaultCategories = ["sofas", "chairs", "tables", "storage"];

function normalizeCategoryValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AdminFurniturePage() {
  const { furniture, addFurniture, removeFurniture, theme } = useAdminPanel();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [createdCategories, setCreatedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState("");

  const categories = useMemo(() => {
    const values = [...defaultCategories, ...createdCategories, ...furniture.map((item) => item.category)];
    return Array.from(new Set(values));
  }, [createdCategories, furniture]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleAddCategory() {
    const normalizedCategory = normalizeCategoryValue(newCategory);

    if (!normalizedCategory) {
      return;
    }

    setCreatedCategories((current) => (current.includes(normalizedCategory) ? current : [...current, normalizedCategory]));
    setCategory(normalizedCategory);
    setNewCategory("");
    setShowAddCategory(false);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name || !material || !color || !price) {
      return;
    }

    addFurniture({
      name,
      category,
      material,
      color,
      price: Number(price),
      image: imagePreview || undefined,
    });

    setName("");
    setCategory(defaultCategories[0]);
    setMaterial("");
    setColor("");
    setPrice("");
    setNewCategory("");
    setShowAddCategory(false);
    setImagePreview("");
  }

  return (
    <div className="space-y-7">
      <AdminHeader title="Furniture" subtitle="Add new furniture and remove items already in the catalog." />

      <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]" : "glass-card border-stone-300/70",
          ].join(" ")}
        >
          <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>
            Add furniture
          </h2>
          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Furniture name"
              className={[
                "w-full rounded-[1rem] border px-4 py-3 text-sm outline-none",
                isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal",
              ].join(" ")}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={[
                    "min-w-0 flex-1 rounded-[1rem] border px-4 py-3 text-sm outline-none",
                    isDark ? "border-stone-600 bg-stone-900/70 text-stone-100" : "border-stone-300 bg-white/75 text-charcoal",
                  ].join(" ")}
                >
                  {categories.map((itemCategory) => (
                    <option key={itemCategory} value={itemCategory}>
                      {formatCategoryLabel(itemCategory)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory((current) => !current)}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.08em] transition",
                    isDark
                      ? "border-stone-600 bg-stone-900/75 text-stone-200 hover:bg-stone-800"
                      : "border-stone-300 bg-white/85 text-charcoal/75 hover:bg-stone-50",
                  ].join(" ")}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              {showAddCategory ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    placeholder="New category name"
                    className={[
                      "min-w-0 flex-1 rounded-[1rem] border px-4 py-3 text-sm outline-none",
                      isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal",
                    ].join(" ")}
                  />
                  <button type="button" onClick={handleAddCategory} className="button-pill shrink-0 px-4 py-3 text-xs">
                    Save
                  </button>
                </div>
              ) : null}
            </div>

            <input
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              placeholder="Material"
              className={[
                "w-full rounded-[1rem] border px-4 py-3 text-sm outline-none",
                isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal",
              ].join(" ")}
            />
            <input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="Color"
              className={[
                "w-full rounded-[1rem] border px-4 py-3 text-sm outline-none",
                isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal",
              ].join(" ")}
            />
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              placeholder="Price"
              className={[
                "w-full rounded-[1rem] border px-4 py-3 text-sm outline-none",
                isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal",
              ].join(" ")}
            />

            <label
              className={[
                "block rounded-[1.1rem] border border-dashed p-4 transition",
                isDark ? "border-stone-600 bg-stone-900/45" : "border-stone-300 bg-white/55",
              ].join(" ")}
            >
              <span className={["mb-3 flex items-center gap-2 text-sm font-medium", isDark ? "text-stone-200" : "text-charcoal"].join(" ")}>
                <ImagePlus className="h-4 w-4" />
                <span>Furniture image</span>
              </span>

              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full cursor-pointer text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:transition file:cursor-pointer file:bg-charcoal file:text-white" />

              {imagePreview ? (
                <div className="mt-4 overflow-hidden rounded-[1rem] border border-stone-300/20">
                  <div className="relative h-44 w-full">
                    <Image src={imagePreview} alt="Furniture preview" fill className="object-cover" unoptimized />
                  </div>
                </div>
              ) : (
                <div
                  className={[
                    "mt-4 flex h-32 items-center justify-center rounded-[1rem] border text-sm",
                    isDark ? "border-stone-700/70 bg-stone-950/40 text-stone-400" : "border-stone-200 bg-stone-50/80 text-charcoal/50",
                  ].join(" ")}
                >
                  Preview will appear here
                </div>
              )}
            </label>

            <button type="submit" className="button-pill w-full justify-center py-3 text-sm">
              Add Furniture
            </button>
          </form>
        </article>

        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]" : "glass-card border-stone-300/70",
          ].join(" ")}
        >
          <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>
            Current furniture
          </h2>
          <div className={["mt-5 overflow-hidden rounded-[1.2rem] border backdrop-blur-md", isDark ? "border-stone-700/70 bg-stone-900/45" : "border-stone-200/80 bg-white/40"].join(" ")}>
            <div
              className={[
                "grid grid-cols-[88px_minmax(0,1.5fr)_1fr_1fr_1fr_0.8fr_auto] gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]",
                isDark ? "bg-stone-900/60 text-stone-400" : "bg-white/55 text-charcoal/45",
              ].join(" ")}
            >
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Material</span>
              <span>Color</span>
              <span>Price</span>
              <span>Action</span>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {furniture.map((item) => (
                <div
                  key={item.id}
                  className={[
                    "grid grid-cols-[88px_minmax(0,1.5fr)_1fr_1fr_1fr_0.8fr_auto] items-center gap-3 border-t px-4 py-4 text-sm",
                    isDark ? "border-stone-700/70 text-stone-100" : "border-stone-200/80 text-charcoal",
                  ].join(" ")}
                >
                  {item.image ? (
                    <div className="relative h-14 w-14 overflow-hidden rounded-[0.95rem] border border-stone-300/20">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div
                      className={[
                        "flex h-14 w-14 items-center justify-center rounded-[0.95rem] border text-[0.7rem] font-medium uppercase tracking-[0.14em]",
                        isDark ? "border-stone-700 bg-stone-950/40 text-stone-500" : "border-stone-200 bg-stone-100 text-charcoal/40",
                      ].join(" ")}
                    >
                      No Image
                    </div>
                  )}
                  <span className="font-medium">{item.name}</span>
                  <span className={["capitalize", isDark ? "text-stone-300/75" : "text-charcoal/65"].join(" ")}>
                    {formatCategoryLabel(item.category)}
                  </span>
                  <span className={isDark ? "text-stone-300/75" : "text-charcoal/65"}>{item.material}</span>
                  <span className={isDark ? "text-stone-300/75" : "text-charcoal/65"}>{item.color}</span>
                  <span>${item.price}</span>
                  <button
                    type="button"
                    onClick={() => removeFurniture(item.id)}
                    className={[
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-soft transition",
                      isDark ? "border-stone-600 bg-stone-900/75 text-stone-100 hover:bg-stone-800" : "border-stone-300 bg-white/85 text-charcoal hover:bg-stone-50",
                    ].join(" ")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
