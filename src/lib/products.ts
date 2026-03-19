import minimalistWoodenDresserImage from "../../image/Minimalist Wooden Dresser.jpg";
import modernLivingRoomSetImage from "../../image/Modern Living Room Set.jpg";
import nordicLoungeSofaImage from "../../image/Nordic Lounge Sofa.jpg";
import scandinavianDiningSetImage from "../../image/Scandinavian Dining Set.jpg";
import cloudLoungeChairImage from "../../image/cloud lounge chair.jpg";
import storageImage from "../../image/storage.jpg";
import tableImage from "../../image/table.webp";

export type ProductCategory = "sofas" | "chairs" | "tables" | "storage";
export type PriceRangeId = "under-500" | "500-1000" | "1000-2000" | "2000-plus";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  material: string;
  color: string;
  price: number;
  image: string;
  slug: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Modern Leather Sofa",
    category: "sofas",
    material: "Leather",
    color: "Black",
    price: 1299,
    image: nordicLoungeSofaImage.src,
    slug: "modern-leather-sofa",
  },
  {
    id: 2,
    name: "Cloud Lounge Chair",
    category: "chairs",
    material: "Fabric",
    color: "White",
    price: 599,
    image: cloudLoungeChairImage.src,
    slug: "cloud-lounge-chair",
  },
  {
    id: 3,
    name: "Nordic Dining Table",
    category: "tables",
    material: "Wood",
    color: "Black",
    price: 899,
    image: scandinavianDiningSetImage.src,
    slug: "nordic-dining-table",
  },
  {
    id: 4,
    name: "Minimal Storage Cabinet",
    category: "storage",
    material: "Wood",
    color: "Oak",
    price: 749,
    image: minimalistWoodenDresserImage.src,
    slug: "minimal-storage-cabinet",
  },
  {
    id: 5,
    name: "Scandinavian Accent Chair",
    category: "chairs",
    material: "Fabric",
    color: "Beige",
    price: 499,
    image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=900&q=80",
    slug: "scandinavian-accent-chair",
  },
  {
    id: 6,
    name: "Modular Corner Sofa",
    category: "sofas",
    material: "Fabric",
    color: "Grey",
    price: 1499,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    slug: "modular-corner-sofa",
  },
  {
    id: 7,
    name: "Round Coffee Table",
    category: "tables",
    material: "Wood",
    color: "Walnut",
    price: 399,
    image: tableImage.src,
    slug: "round-coffee-table",
  },
  {
    id: 8,
    name: "Tall Storage Shelf",
    category: "storage",
    material: "Metal",
    color: "Black",
    price: 699,
    image: storageImage.src,
    slug: "tall-storage-shelf",
  },
  {
    id: 9,
    name: "Wooden Side Table",
    category: "tables",
    material: "Wood",
    color: "Natural",
    price: 299,
    image: tableImage.src,
    slug: "wooden-side-table",
  },
  {
    id: 10,
    name: "Cozy Reading Chair",
    category: "chairs",
    material: "Fabric",
    color: "Cream",
    price: 549,
    image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=900&q=80",
    slug: "cozy-reading-chair",
  },
  {
    id: 11,
    name: "Compact TV Console",
    category: "storage",
    material: "Wood",
    color: "Brown",
    price: 899,
    image: storageImage.src,
    slug: "compact-tv-console",
  },
  {
    id: 12,
    name: "Premium Sectional Sofa",
    category: "sofas",
    material: "Leather",
    color: "Tan",
    price: 1999,
    image: modernLivingRoomSetImage.src,
    slug: "premium-sectional-sofa",
  },
];

export const priceRanges: Array<{
  id: PriceRangeId;
  label: string;
  min?: number;
  max?: number;
}> = [
  { id: "under-500", label: "Under $500", max: 499 },
  { id: "500-1000", label: "$500 - $1000", min: 500, max: 1000 },
  { id: "1000-2000", label: "$1000 - $2000", min: 1000, max: 2000 },
  { id: "2000-plus", label: "$2000+", min: 2000 },
];
