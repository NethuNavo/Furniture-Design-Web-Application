"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]} message="Log in with an admin account to access the admin dashboard">
      {children}
    </RoleGuard>
  );
}
