"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserRole } from "@/lib/auth";

type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

type UpdateProfileInput = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isCustomer: boolean;
  isReady: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  updateProfile: (input: UpdateProfileInput) => Promise<AuthUser>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "nord-living-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  function persistUser(nextUser: AuthUser | null) {
    setUser(nextUser);

    if (nextUser) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  useEffect(() => {
    async function hydrateUser() {
      try {
        const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedValue) {
          return;
        }

        const storedUser = JSON.parse(storedValue) as AuthUser;

        const response = await fetch(`/api/users/profile?email=${encodeURIComponent(storedUser.email)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          persistUser(storedUser);
          return;
        }

        const data = (await response.json()) as { user: AuthUser };
        persistUser(data.user);
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsReady(true);
      }
    }

    hydrateUser();
  }, []);

  async function login(input: LoginInput) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "Could not log in."));
    }

    const data = (await response.json()) as { user: AuthUser };
    persistUser(data.user);
    return data.user;
  }

  async function signup(input: SignupInput) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "Could not create account."));
    }

    const data = (await response.json()) as { user: AuthUser };
    persistUser(data.user);
    return data.user;
  }

  async function updateProfile(input: UpdateProfileInput) {
    if (!user) {
      throw new Error("No active user found.");
    }

    const response = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentEmail: user.email,
        ...input,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "Could not update profile."));
    }

    const data = (await response.json()) as { user: AuthUser };
    persistUser(data.user);
    return data.user;
  }

  function logout() {
    persistUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      isAdmin: user?.role === "admin",
      isCustomer: user?.role === "customer",
      isReady,
      login,
      signup,
      updateProfile,
      logout,
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
