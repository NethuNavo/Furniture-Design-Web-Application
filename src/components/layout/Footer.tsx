import Link from "next/link";
import { Armchair } from "lucide-react";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Furniture", href: "/shop" },
      { label: "New Arrivals", href: "/shop" },
      { label: "Best Sellers", href: "/shop" },
      { label: "Sale", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Customer Service", href: "/about#contact" },
      { label: "Shipping & Returns", href: "/shop" },
      { label: "Assembly Guide", href: "/room-designer" },
      { label: "FAQ", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/shop" },
      { label: "Sustainability", href: "/room-designer" },
      { label: "Contact", href: "/about#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#4b392f] text-stone-200">
      <div className="shell py-12 sm:py-14">
        <div className="grid gap-10 border-b border-white/12 pb-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8">
                <Armchair className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <span className="text-[1.35rem] font-semibold tracking-tight">Nord Living</span>
            </div>
            <p className="max-w-xs text-[0.95rem] leading-7 text-stone-200/78">
              Modern Scandinavian furniture for beautiful living spaces.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-semibold tracking-[0.01em] text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-stone-200/78">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
