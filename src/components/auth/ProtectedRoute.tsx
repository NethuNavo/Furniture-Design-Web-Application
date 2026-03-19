"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["customer"]} message="Log in to access your Nord Living workspace">
      {children}
    </RoleGuard>
  );
}
