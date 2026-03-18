"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";

type QuickActionCardProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export function QuickActionCard({ icon: Icon, label, href }: QuickActionCardProps) {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-4 rounded-[1.2rem] border px-5 py-5 text-base font-medium backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-soft",
        isDark
          ? "border-blue-700/70 bg-gradient-to-br from-blue-950/70 to-slate-900/50 text-blue-100 hover:bg-gradient-to-br hover:from-blue-900/80 hover:to-slate-800/60"
          : "glass-subcard border-blue-300/70 text-blue-900 hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-white/60",
      ].join(" ")}
    >
      <Icon className={["h-5 w-5", isDark ? "text-blue-100/85" : "text-blue-700"].join(" ")} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );
}
