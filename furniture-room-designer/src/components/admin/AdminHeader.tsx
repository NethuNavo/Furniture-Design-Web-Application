"use client";

import { Search } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";

type AdminHeaderProps = {
  title: string;
  subtitle: string;
};

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <header className={["border-b pb-4", isDark ? "border-blue-700/50" : "border-blue-300/50"].join(" ")}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className={["text-[2rem] font-semibold tracking-tight", isDark ? "text-blue-50" : "text-blue-900"].join(" ")}>{title}</h1>
          <p className={["mt-1.5 text-sm", isDark ? "text-blue-200/75" : "text-stone-500"].join(" ")}>{subtitle}</p>
        </div>

        <label
          className={[
            "flex h-11 w-full items-center gap-3 rounded-[1rem] border px-4 shadow-soft lg:max-w-[250px]",
            isDark
              ? "border-blue-600 bg-blue-900/60 text-blue-200"
              : "border-blue-300 bg-blue-50/90 text-blue-700",
          ].join(" ")}
        >
          <Search className="h-4.5 w-4.5" />
          <input
            type="search"
            placeholder="Search..."
            className={[
              "w-full bg-transparent text-sm outline-none",
              isDark ? "text-blue-50 placeholder:text-blue-300" : "text-blue-900 placeholder:text-blue-500",
            ].join(" ")}
          />
        </label>
      </div>
    </header>
  );
}
