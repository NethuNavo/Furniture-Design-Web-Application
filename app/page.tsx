import homePageCoverImage from "../image/home page cover 2.png";
import tableImage from "../image/table.webp";
import storageImage from "../image/storage.jpg";
import nordicLoungeSofaImage from "../image/Nordic Lounge Sofa.jpg";
import minimalistWoodenDresserImage from "../image/Minimalist Wooden Dresser.jpg";
import scandinavianDiningSetImage from "../image/Scandinavian Dining Set.jpg";
import modernLivingRoomSetImage from "../image/Modern Living Room Set.jpg";
import { CategorySection } from "@/components/home/CategorySection";
import { CTASection } from "@/components/home/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularFurnitureSection } from "@/components/home/PopularFurnitureSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const heroImageUrl = homePageCoverImage.src;

const categories = [
  {
    name: "Sofas",
    itemCount: "120+ items",
    slug: "sofas" as const,
    icon: "sofa" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Chairs",
    itemCount: "85+ items",
    slug: "chairs" as const,
    icon: "chair" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tables",
    itemCount: "95+ items",
    slug: "tables" as const,
    icon: "table" as const,
    imageUrl: tableImage.src,
  },
  {
    name: "Storage",
    itemCount: "60+ items",
    slug: "storage" as const,
    icon: "storage" as const,
    imageUrl: storageImage.src,
  },
];

const popularProducts = [
  {
    title: "Nordic Lounge Sofa",
    description: "Spacious modern sectional sofa",
    price: "$1299",
    imageUrl: nordicLoungeSofaImage.src,
  },
  {
    title: "Minimalist Wooden Dresser",
    description: "Light wood dresser with clean lines",
    price: "$599",
    imageUrl: minimalistWoodenDresserImage.src,
  },
  {
    title: "Scandinavian Dining Set",
    description: "Elegant dining table and chairs",
    price: "$899",
    imageUrl: scandinavianDiningSetImage.src,
  },
  {
    title: "Modern Living Room Set",
    description: "Complete living room furniture",
    price: "$1799",
    imageUrl: modernLivingRoomSetImage.src,
  },
];

const designSteps = [
  {
    number: "1",
    title: "Add Your Room Details",
    description: "Enter your room size, layout details, and setup preferences to begin planning",
    icon: "style" as const,
  },
  {
    number: "2",
    title: "Edit in 2D",
    description: "Arrange furniture and refine your layout using the interactive 2D room designer",
    icon: "design" as const,
  },
  {
    number: "3",
    title: "View in 3D",
    description: "Preview your finished setup in 3D to understand how it fits your space",
    icon: "home" as const,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <Navbar />
      <HeroSection imageUrl={heroImageUrl} />
      <CategorySection categories={categories} />
      <PopularFurnitureSection products={popularProducts} />
      <HowItWorksSection steps={designSteps} />
      <CTASection />
      <Footer />
    </main>
  );
}
