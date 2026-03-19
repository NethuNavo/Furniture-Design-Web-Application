"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type HeroSectionProps = {
  imageUrl: string;
};

export function HeroSection({ imageUrl }: HeroSectionProps) {
  const plannerHref = "#browse-by-category";

  return (
    <section id="top" className="w-full px-0 py-6 sm:py-8 lg:py-10">
      <div className="relative overflow-hidden border-y border-white/70 shadow-soft-lg sm:rounded-[2rem] sm:border sm:mx-4 lg:mx-6">
        <img
          src={imageUrl}
          alt="Warm Scandinavian living room interior"
          className="h-[440px] w-full object-cover sm:h-[520px] lg:h-[580px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,22,18,0.38)_0%,rgba(28,22,18,0.52)_100%)]" />

        <div className="absolute inset-0 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="max-w-4xl text-center text-white">
            <h1 className="font-display text-[3.1rem] font-semibold leading-[1.02] tracking-tight text-white [text-shadow:0_6px_24px_rgba(0,0,0,0.35)] sm:text-[4.4rem] lg:text-[5.9rem]">
              Design Your Perfect Room
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/95 [text-shadow:0_4px_18px_rgba(0,0,0,0.28)] sm:mt-5 sm:text-lg sm:leading-9">
              Create a space that reflects your style with our curated collection of modern
              Scandinavian furniture. Browse furniture, discover room design features, and preview how each piece fits your personal style.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="flex flex-col items-center gap-3">
                <Link
                  href={plannerHref}
                  className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-white px-9 py-4 text-base font-semibold text-charcoal shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-stone-50 sm:min-w-[210px] sm:text-lg"
                >
                  Explore More
                </Link>
                <ArrowDown className="h-6 w-6 text-white" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
