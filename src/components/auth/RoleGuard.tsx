"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LockKeyhole, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  message: string;
};

export function RoleGuard({ children, allowedRoles, message }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady, role } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      const params = new URLSearchParams({
        redirect: pathname || "/",
        message,
      });

      router.replace(`/login?${params.toString()}`);
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      const fallbackRoute = role === "admin" ? "/admin" : "/";
      router.replace(fallbackRoute);
    }
  }, [allowedRoles, isAuthenticated, isReady, message, pathname, role, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6 text-charcoal">
        <div className="w-full max-w-md rounded-[2rem] border border-stone-300/80 bg-white/95 p-8 text-center shadow-soft-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-stone-50">
            <Shield className="h-6 w-6 text-charcoal/70" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Checking access</h1>
          <p className="mt-3 text-sm leading-7 text-charcoal/62">
            We are making sure your Nord Living access level is ready before opening this page.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6 text-charcoal">
        <div className="w-full max-w-md rounded-[2rem] border border-stone-300/80 bg-white/95 p-8 text-center shadow-soft-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-stone-50">
            <LockKeyhole className="h-6 w-6 text-charcoal/70" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Redirecting you</h1>
          <p className="mt-3 text-sm leading-7 text-charcoal/62">{message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
