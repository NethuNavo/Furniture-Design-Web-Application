export const ADMIN_EMAIL = "admin@nord.com";
export const ADMIN_PASSWORD = "admin123";

export type UserRole = "customer" | "admin";

export function getRoleFromEmail(email: string): UserRole {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";
}
