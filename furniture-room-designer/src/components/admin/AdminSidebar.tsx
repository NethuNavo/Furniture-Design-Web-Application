"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Armchair,
  LayoutGrid,
  LogOut,
  Moon,
  Palette,
  Settings,
  Shield,
  Sofa,
  SunMedium,
  Users,
} from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Furniture", href: "/admin/furniture", icon: Sofa },
  { label: "Designs", href: "/admin/designs", icon: Palette },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useAdminPanel();
  const isDark = theme === "dark";

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside
      className={[
        "flex h-full flex-col border-b backdrop-blur-xl lg:border-b-0 lg:border-r",
        isDark
          ? "border-blue-700/70 bg-gradient-to-b from-blue-950/80 to-slate-900/60 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          : "glass-card-strong border-blue-300/70",
      ].join(" ")}
    >
      <div className={["border-b px-5 py-5 sm:px-6", isDark ? "border-blue-700/80" : "border-blue-300/80"].join(" ")}>
        <Link href="/admin" className={["flex items-center gap-3 transition hover:opacity-80", isDark ? "text-blue-300" : "text-blue-600"].join(" ")}>
          <span className={["flex h-9 w-9 items-center justify-center rounded-full border shadow-soft", isDark ? "border-blue-600 bg-blue-900" : "border-blue-300/80 bg-white"].join(" ")}>
            <Armchair className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="text-lg font-semibold tracking-[0.01em]">Nord Admin</span>
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 px-5 py-6 sm:px-6">
        <ul className="grid gap-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-base font-medium transition backdrop-blur-md",
                    active
                      ? isDark
                        ? "bg-blue-700/40 text-blue-100 shadow-soft border border-blue-600/50"
                        : "bg-blue-300/40 text-blue-900 shadow-soft border border-blue-400/60"
                      : isDark
                        ? "text-blue-300 hover:bg-blue-800/30 hover:text-blue-200"
                        : "text-blue-900 hover:bg-blue-100/50 hover:text-blue-900",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={["border-t px-5 py-5 sm:px-6", isDark ? "border-blue-700/80" : "border-blue-300/80"].join(" ")}>
        <Link
          href="/admin/settings"
          className={[
            "rounded-[1.2rem] border p-3 backdrop-blur-xl transition hover:opacity-85",
            isDark
              ? "border-blue-700/70 bg-gradient-to-b from-blue-950/70 to-slate-900/50 shadow-[0_14px_32px_rgba(0,0,0,0.18)] hover:bg-gradient-to-b hover:from-blue-900/80 hover:to-slate-800/60"
              : "glass-subcard border-blue-300/70 hover:bg-blue-50/90",
          ].join(" ")}
        >
          <div className="flex items-center gap-4 px-1 py-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
              {user?.name?.[0] || "A"}
            </span>
            <span className="min-w-0 flex-1">
              <span className={["block truncate text-sm font-semibold", isDark ? "text-blue-200" : "text-blue-900"].join(" ")}>{user?.name || "Admin User"}</span>
              <span className={["block truncate text-xs", isDark ? "text-blue-400/60" : "text-stone-500"].join(" ")}>{user?.email || "admin@nord.com"}</span>
            </span>
            <Shield className={["h-4 w-4", isDark ? "text-blue-400" : "text-blue-600"].join(" ")} />
          </div>
        </Link>

        <div className={["mt-3 grid gap-2 border-t pt-3", isDark ? "border-blue-700/80" : "border-blue-300/80"].join(" ")}>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={[
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              isDark ? "text-blue-300 hover:bg-blue-800/40 hover:text-blue-200" : "text-blue-900 hover:bg-blue-100/50 hover:text-blue-900",
            ].join(" ")}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={[
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              isDark ? "text-blue-300 hover:bg-blue-800/40 hover:text-blue-200" : "text-blue-900 hover:bg-blue-100/50 hover:text-blue-900",
            ].join(" ")}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
