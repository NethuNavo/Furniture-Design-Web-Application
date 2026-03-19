"use client";

import { AdminProvider, useAdminPanel } from "@/components/admin/AdminProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <div
      className={[
        "flex h-screen overflow-hidden",
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-blue-50"
          : "bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 text-slate-900",
      ].join(" ")}
    >
      <div className="h-screen w-64 shrink-0 overflow-hidden">
        <AdminSidebar />
      </div>
      <main
        className={[
          "min-w-0 flex-1 h-screen overflow-y-auto",
          isDark
            ? "bg-gradient-to-br from-slate-800 via-blue-800 to-slate-700"
            : "bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200",
        ].join(" ")}
      >
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">{children}</div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
