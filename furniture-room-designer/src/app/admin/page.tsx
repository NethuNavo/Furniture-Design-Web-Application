"use client";

import { LayoutGrid, Palette, Plus, Shield, Sofa, Users } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { StatCard } from "@/components/admin/StatCard";

const quickActions = [
  { label: "Add New Furniture", href: "/admin/furniture", icon: Plus },
  { label: "View Designs", href: "/admin/designs", icon: Palette },
  { label: "Manage Users", href: "/admin/users", icon: Users },
];

export default function AdminDashboardPage() {
  const { accounts, furniture, theme } = useAdminPanel();
  const isDark = theme === "dark";

  const statCards = [
    {
      label: "Furniture Items",
      value: String(furniture.length),
      growth: "Live catalog",
      icon: Sofa,
      iconBoxClassName: "bg-[#2f6f5c]",
    },
    {
      label: "Categories",
      value: String(new Set(furniture.map((item) => item.category)).size),
      growth: "Organized",
      icon: LayoutGrid,
      iconBoxClassName: "bg-[#547d6f]",
    },
    {
      label: "Customer Accounts",
      value: String(accounts.filter((account) => account.role === "customer").length),
      growth: "User access",
      icon: Users,
      iconBoxClassName: "bg-[#8ca67b]",
    },
    {
      label: "Admin Accounts",
      value: String(accounts.filter((account) => account.role === "admin").length),
      growth: "Team access",
      icon: Shield,
      iconBoxClassName: "bg-[#b48b5f]",
    },
  ];

  return (
    <div className="space-y-7">
      <AdminHeader title="Dashboard" subtitle="Focus on furniture, users, admin accounts, and workspace settings." />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBoxClassName={card.iconBoxClassName}
            label={card.label}
            value={card.value}
            growth={card.growth}
          />
        ))}
      </section>

      <section
        className={[
          "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl sm:p-6",
          isDark
            ? "border-blue-700/70 bg-[rgba(30,24,21,0.74)]"
            : "glass-card-strong border-blue-300/70",
        ].join(" ")}
      >
        <h2 className={["text-[1.45rem] font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>Quick Actions</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} icon={action.icon} label={action.label} href={action.href} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark
              ? "border-blue-700/70 bg-[rgba(30,24,21,0.74)]"
              : "glass-card border-blue-300/70",
          ].join(" ")}
        >
          <p className={["text-xs uppercase tracking-[0.24em]", isDark ? "text-blue-200" : "text-stone-500"].join(" ")}>Main Priorities</p>
          <h2 className={["mt-3 text-[1.25rem] font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>Core admin actions</h2>
          <ul className={["mt-4 space-y-3 text-sm leading-7", isDark ? "text-blue-200/72" : "text-stone-500"].join(" ")}>
            <li>Add new furniture to the visible catalog.</li>
            <li>Delete existing furniture that is no longer needed.</li>
            <li>Create new admin accounts for your team.</li>
            <li>Manage customer accounts from one place.</li>
          </ul>
        </article>

        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark
              ? "border-blue-700/70 bg-[rgba(30,24,21,0.74)]"
              : "glass-card border-blue-300/70",
          ].join(" ")}
        >
          <p className={["text-xs uppercase tracking-[0.24em]", isDark ? "text-blue-200" : "text-stone-500"].join(" ")}>Workspace</p>
          <h2 className={["mt-3 text-[1.25rem] font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>Personalize the admin panel</h2>
          <p className={["mt-4 text-sm leading-7", isDark ? "text-blue-200/72" : "text-stone-500"].join(" ")}>
            Update the main admin account from Settings and switch the dashboard between light and dark mode using the sidebar toggle.
          </p>
        </article>
      </section>
    </div>
  );
}
