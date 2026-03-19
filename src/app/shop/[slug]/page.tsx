import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <Navbar />
      <section className="shell py-16 sm:py-20">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-base font-medium text-charcoal/68 transition hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-stone-300 bg-white p-4 shadow-soft">
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[560px]"
            />
          </div>

          <div className="rounded-[2rem] border border-stone-300 bg-white/92 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-charcoal/45">{product.category}</p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-xl text-charcoal/68">
              {product.material} • {product.color}
            </p>
            <p className="mt-6 text-3xl font-semibold text-charcoal">${product.price}</p>
            <p className="mt-8 max-w-xl text-lg leading-9 text-charcoal/68">
              A premium placeholder product page designed to keep the shop flow connected while you
              expand Nord Living with full product details, delivery options, and room styling
              content.
            </p>
            <Link href="/shop" className="button-pill mt-10">
              Explore More Furniture
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
