import { products } from "@/lib/products";

export type FurnitureCategory =
  | "all"
  | "favorites"
  | "sofas"
  | "chairs"
  | "tables"
  | "storage"
  | "lighting"
  | "bedroom";

export type FurnitureType =
  | "sofa"
  | "armchair"
  | "coffee-table"
  | "dining-table"
  | "accent-chair"
  | "sectional-sofa"
  | "side-table"
  | "storage-shelf"
  | "tv-console"
  | "bed"
  | "cabinet"
  | "floor-lamp";

export type FurnitureSizeOption = {
  label: string;
  width: number;
  height: number;
};

export type FurnitureLibraryItem = {
  type: FurnitureType;
  label: string;
  category: Exclude<FurnitureCategory, "all">;
  width: number;
  height: number;
  icon: "sofa" | "armchair" | "table" | "bed" | "cabinet" | "lamp";
  image?: string;
  slug?: string;
  availableColors: string[];
  availableSizes: FurnitureSizeOption[];
};

function getDefaultColors(type: FurnitureType) {
  switch (type) {
    case "sofa":
    case "sectional-sofa":
      return ["#b49d86", "#9f8a74", "#d1c0b2", "#7c6754"];
    case "armchair":
    case "accent-chair":
      return ["#d6c1b0", "#c7b09d", "#e1d2c6", "#8e7767"];
    case "coffee-table":
    case "dining-table":
    case "side-table":
      return ["#cab48f", "#b99f72", "#8b6545", "#d9c6a8"];
    case "storage-shelf":
    case "cabinet":
    case "tv-console":
      return ["#8f6a48", "#6f5239", "#b4906f", "#d5bda5"];
    case "floor-lamp":
      return ["#ece2d0", "#d8ccb9", "#cbbba6", "#f5ede2"];
    case "bed":
      return ["#e7dcc4", "#d9cdb4", "#c8b89d", "#f0e7d8"];
    default:
      return ["#cdb89d"];
  }
}

function getDefaultSizes(
  baseWidth: number,
  baseHeight: number,
): FurnitureSizeOption[] {
  return [
    {
      label: "Small",
      width: Math.max(50, Math.round(baseWidth * 0.85)),
      height: Math.max(50, Math.round(baseHeight * 0.85)),
    },
    {
      label: "Medium",
      width: baseWidth,
      height: baseHeight,
    },
    {
      label: "Large",
      width: Math.round(baseWidth * 1.2),
      height: Math.round(baseHeight * 1.2),
    },
  ];
}

const shopFurnitureItems: FurnitureLibraryItem[] = products.map((product) => {
  if (product.category === "sofas") {
    const type =
      product.slug === "premium-sectional-sofa" ? "sectional-sofa" : "sofa";
    const width = product.slug === "premium-sectional-sofa" ? 220 : 180;
    const height = 88;

    return {
      type,
      label: product.name,
      category: "sofas",
      width,
      height,
      icon: "sofa",
      image: product.image,
      slug: product.slug,
      availableColors: getDefaultColors(type),
      availableSizes: getDefaultSizes(width, height),
    };
  }

  if (product.category === "chairs") {
    const type =
      product.slug === "scandinavian-accent-chair" ||
      product.slug === "cozy-reading-chair"
        ? "accent-chair"
        : "armchair";
    const width = 90;
    const height = 90;

    return {
      type,
      label: product.name,
      category: "chairs",
      width,
      height,
      icon: "armchair",
      image: product.image,
      slug: product.slug,
      availableColors: getDefaultColors(type),
      availableSizes: getDefaultSizes(width, height),
    };
  }

  if (product.category === "tables") {
    const type =
      product.slug === "wooden-side-table"
        ? "side-table"
        : product.slug === "round-coffee-table"
          ? "coffee-table"
          : "dining-table";

    const width =
      product.slug === "wooden-side-table"
        ? 70
        : product.slug === "round-coffee-table"
          ? 120
          : 160;

    const height =
      product.slug === "wooden-side-table"
        ? 70
        : product.slug === "round-coffee-table"
          ? 70
          : 100;

    return {
      type,
      label: product.name,
      category: "tables",
      width,
      height,
      icon: "table",
      image: product.image,
      slug: product.slug,
      availableColors: getDefaultColors(type),
      availableSizes: getDefaultSizes(width, height),
    };
  }

  const type =
    product.slug === "tall-storage-shelf"
      ? "storage-shelf"
      : product.slug === "compact-tv-console"
        ? "tv-console"
        : "cabinet";

  const width = product.slug === "compact-tv-console" ? 140 : 100;
  const height = product.slug === "tall-storage-shelf" ? 60 : 70;

  return {
    type,
    label: product.name,
    category: "storage",
    width,
    height,
    icon: "cabinet",
    image: product.image,
    slug: product.slug,
    availableColors: getDefaultColors(type),
    availableSizes: getDefaultSizes(width, height),
  };
});

export const furnitureItems: FurnitureLibraryItem[] = [
  ...shopFurnitureItems,
  {
    type: "bed",
    label: "Nord Living Bed",
    category: "bedroom",
    width: 180,
    height: 140,
    icon: "bed",
    availableColors: getDefaultColors("bed"),
    availableSizes: getDefaultSizes(180, 140),
  },
  {
    type: "floor-lamp",
    label: "Floor Lamp",
    category: "lighting",
    width: 60,
    height: 60,
    icon: "lamp",
    availableColors: getDefaultColors("floor-lamp"),
    availableSizes: getDefaultSizes(60, 60),
  },
];

export const furnitureCategories: Array<{
  label: string;
  value: FurnitureCategory;
}> = [
  { label: "All Items", value: "all" },
  { label: "Favorites", value: "favorites" },
  { label: "Sofas", value: "sofas" },
  { label: "Chairs", value: "chairs" },
  { label: "Tables", value: "tables" },
  { label: "Storage", value: "storage" },
  { label: "Lighting", value: "lighting" },
  { label: "Bedroom", value: "bedroom" },
];