"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/lib/products";

export type AdminTheme = "light" | "dark";

export type AdminFurniture = {
  id: string;
  name: string;
  category: string;
  material: string;
  color: string;
  price: number;
  image?: string;
  status: "Published" | "Draft";
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "Active" | "Pending";
};

type AdminPanelState = {
  furniture: AdminFurniture[];
  accounts: AdminAccount[];
};

type AdminContextValue = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  furniture: AdminFurniture[];
  accounts: AdminAccount[];
  addFurniture: (item: Omit<AdminFurniture, "id" | "status">) => void;
  removeFurniture: (id: string) => void;
  addAccount: (account: Omit<AdminAccount, "id">) => void;
  updateAccount: (id: string, patch: Partial<AdminAccount>) => void;
  removeAccount: (id: string) => void;
};

const ADMIN_THEME_KEY = "nord-admin-theme";
const ADMIN_STATE_KEY = "nord-admin-state";

const defaultState: AdminPanelState = {
  furniture: products.map((product) => ({
    id: `product-${product.id}`,
    name: product.name,
    category: product.category,
    material: product.material,
    color: product.color,
    price: product.price,
    image: product.image,
    status: "Published",
  })),
  accounts: [
    {
      id: "admin-1",
      name: "Admin User",
      email: "admin@nord.com",
      role: "admin",
      status: "Active",
    },
    {
      id: "customer-1",
      name: "Janani Upeksha",
      email: "janani@example.com",
      role: "customer",
      status: "Active",
    },
    {
      id: "customer-2",
      name: "Kavinda Perera",
      email: "kavinda@example.com",
      role: "customer",
      status: "Pending",
    },
  ],
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

function readTheme(): AdminTheme {
  try {
    const stored = window.localStorage.getItem(ADMIN_THEME_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function readState(): AdminPanelState {
  try {
    const stored = window.localStorage.getItem(ADMIN_STATE_KEY);
    if (!stored) {
      return defaultState;
    }

    return JSON.parse(stored) as AdminPanelState;
  } catch {
    return defaultState;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("light");
  const [state, setState] = useState<AdminPanelState>(defaultState);

  useEffect(() => {
    setThemeState(readTheme());
    setState(readState());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
  }, [state]);

  function setTheme(nextTheme: AdminTheme) {
    setThemeState(nextTheme);
  }

  function addFurniture(item: Omit<AdminFurniture, "id" | "status">) {
    setState((current) => ({
      ...current,
      furniture: [
        {
          ...item,
          id: `furniture-${Date.now()}`,
          status: "Published",
        },
        ...current.furniture,
      ],
    }));
  }

  function removeFurniture(id: string) {
    setState((current) => ({
      ...current,
      furniture: current.furniture.filter((item) => item.id !== id),
    }));
  }

  function addAccount(account: Omit<AdminAccount, "id">) {
    setState((current) => ({
      ...current,
      accounts: [
        {
          ...account,
          id: `account-${Date.now()}`,
        },
        ...current.accounts,
      ],
    }));
  }

  function updateAccount(id: string, patch: Partial<AdminAccount>) {
    setState((current) => ({
      ...current,
      accounts: current.accounts.map((account) => (account.id === id ? { ...account, ...patch } : account)),
    }));
  }

  function removeAccount(id: string) {
    setState((current) => ({
      ...current,
      accounts: current.accounts.filter((account) => account.id !== id),
    }));
  }

  const value = useMemo<AdminContextValue>(
    () => ({
      theme,
      setTheme,
      furniture: state.furniture,
      accounts: state.accounts,
      addFurniture,
      removeFurniture,
      addAccount,
      updateAccount,
      removeAccount,
    }),
    [state.accounts, state.furniture, theme],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminPanel() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminPanel must be used within AdminProvider");
  }

  return context;
}
