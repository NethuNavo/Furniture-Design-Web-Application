"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Armchair, ArrowRight, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user, isCustomer } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const getStartedHref = "/signup?redirect=%2Froom-designer";
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Room Designer", href: "/room-designer" },
    ...(isCustomer ? [{ label: "Saved Designs", href: "/saved-designs" }] : []),
    { label: "About & Contact", href: "/about" },
  ];

function handleLogout() {
    setIsProfileOpen(false);
    logout();
    router.push("/");
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/60 bg-stone-100/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1360px] items-center justify-between px-1 sm:px-2 lg:h-22 lg:px-2">
        <Link href="/" className="flex items-center gap-3 text-charcoal transition hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white shadow-soft">
            <Armchair className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
          <span className="text-lg font-semibold tracking-[0.01em] sm:text-xl">Nord Living</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "relative px-1 py-1.5 text-base font-medium transition",
                isActive(item.href)
                  ? "text-charcoal after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-charcoal"
                  : "text-charcoal/72 hover:text-charcoal",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="inline-flex items-center gap-3 rounded-full border border-white/45 bg-white/35 px-2.5 py-2 pr-3 text-charcoal shadow-[0_10px_30px_rgba(58,49,44,0.12)] backdrop-blur-md transition hover:bg-white/50"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-charcoal/92 text-white shadow-[0_8px_16px_rgba(58,49,44,0.22)]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-4.5 w-4.5" />
                  )}
                </span>
                <span className="text-sm font-semibold text-charcoal">{user?.name || "Profile"}</span>
                <ChevronDown className="h-4 w-4 text-charcoal/55" />
              </button>

              {isProfileOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] w-56 rounded-[1.15rem] border border-stone-300 bg-white p-2 shadow-soft-lg">
                  <div className="border-b border-stone-200 px-3 py-2.5">
                    <p className="text-sm font-semibold text-charcoal">{user?.name || "Nord Living User"}</p>
                    <p className="text-xs text-charcoal/55">{user?.email || "member@nordliving.com"}</p>
                  </div>

                  <div className="mt-1 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-[0.9rem] px-3 py-2.5 text-sm font-medium text-charcoal transition hover:bg-stone-50"
                    >
                      <UserRound className="h-4 w-4 text-charcoal/60" />
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-[0.9rem] px-3 py-2.5 text-left text-sm font-medium text-charcoal transition hover:bg-stone-50"
                    >
                      <LogOut className="h-4 w-4 text-charcoal/60" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-stone-50"
              >
                Login
              </Link>
              <Link
                href={getStartedHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-5 py-2.5 text-sm font-semibold text-charcoal shadow-[0_10px_30px_rgba(58,49,44,0.14)] backdrop-blur-md transition hover:bg-white/50 sm:px-6 sm:py-3 sm:text-base"
              >
                Get Started
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
