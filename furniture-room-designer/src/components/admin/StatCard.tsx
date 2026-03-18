"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";

type StatCardProps = {
  icon: LucideIcon;
  iconBoxClassName: string;
  label: string;
  value: string;
  growth: string;
};

export function StatCard({ icon: Icon, iconBoxClassName, label, value, growth }: StatCardProps) {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <article
      className={[
        "rounded-[1.4rem] border p-5 backdrop-blur-xl shadow-soft",
        isDark
          ? "border-blue-700/70 bg-gradient-to-br from-blue-950/70 to-slate-900/50 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          : "glass-card border-blue-300/70",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBoxClassName}`}>
          <Icon className="h-7 w-7 text-white" strokeWidth={2.1} />
        </div>

        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4da861]">
          <TrendingUp className="h-4.5 w-4.5" />
          <span>{growth}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className={["text-[1.9rem] font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>{value}</p>
        <p className={["mt-1 text-sm", isDark ? "text-blue-200/72" : "text-stone-500"].join(" ")}>{label}</p>
      </div>
    </article>
  );
}
