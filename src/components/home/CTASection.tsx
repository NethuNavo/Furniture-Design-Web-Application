"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CTASection() {
  const { isAuthenticated } = useAuth();
  const plannerHref = isAuthenticated ? "/room-designer" : "/room-designer";

  return (
    <section className="shell py-18 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl lg:text-[3.6rem]">
          Ready to Create Your Dream Space?
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-charcoal/66 sm:text-[1.18rem]">
          Start designing your perfect room today with our interactive 3D designer. See exactly
          how furniture will look in your space before you buy.
        </p>
        <Link href={plannerHref} className="button-pill mt-10">
          Start Room Design
          <ArrowRight className="h-5 w-5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
