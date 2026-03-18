"use client";

import { FormEvent, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminUsersPage() {
  const { accounts, addAccount, removeAccount, theme } = useAdminPanel();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "customer">("customer");

  const admins = useMemo(() => accounts.filter((account) => account.role === "admin"), [accounts]);
  const customers = useMemo(() => accounts.filter((account) => account.role === "customer"), [accounts]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name || !email) {
      return;
    }

    addAccount({
      name,
      email,
      role,
      status: "Active",
    });

    setName("");
    setEmail("");
    setRole("customer");
  }

  return (
    <div className="space-y-7">
      <AdminHeader title="Users" subtitle="Add admins, manage customers, and remove accounts when needed." />

      <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark
              ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]"
              : "glass-card border-stone-300/70",
          ].join(" ")}
        >
          <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>Create account</h2>
          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")} />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")} />
            <select value={role} onChange={(event) => setRole(event.target.value as "admin" | "customer")} className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="button-pill w-full justify-center py-3 text-sm">Add Account</button>
          </form>
        </article>

        <div className="grid gap-4">
          <article
            className={[
              "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
              isDark
                ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]"
                : "glass-card border-stone-300/70",
            ].join(" ")}
          >
            <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>Admin accounts</h2>
            <div className="mt-4 space-y-3">
              {admins.map((account) => (
                <div key={account.id} className={["flex items-center justify-between rounded-[1rem] border px-4 py-3 backdrop-blur-md", isDark ? "border-stone-700/70 bg-stone-900/45" : "border-stone-200/80 bg-white/45"].join(" ")}>
                  <div>
                    <p className={["text-sm font-semibold", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>{account.name}</p>
                    <p className={["text-xs", isDark ? "text-stone-400" : "text-charcoal/55"].join(" ")}>{account.email}</p>
                  </div>
                  {account.email === "admin@nord.com" ? (
                    <span className={["text-xs font-medium", isDark ? "text-stone-400" : "text-charcoal/50"].join(" ")}>Primary admin</span>
                  ) : (
                    <button type="button" onClick={() => removeAccount(account.id)} className={["inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-soft transition", isDark ? "border-stone-600 bg-stone-900/75 text-stone-100 hover:bg-stone-800" : "border-stone-300 bg-white/85 text-charcoal hover:bg-stone-50"].join(" ")}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article
            className={[
              "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
              isDark
                ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]"
                : "glass-card border-stone-300/70",
            ].join(" ")}
          >
            <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>Customer accounts</h2>
            <div className="mt-4 space-y-3">
              {customers.map((account) => (
                <div key={account.id} className={["flex items-center justify-between rounded-[1rem] border px-4 py-3 backdrop-blur-md", isDark ? "border-stone-700/70 bg-stone-900/45" : "border-stone-200/80 bg-white/45"].join(" ")}>
                  <div>
                    <p className={["text-sm font-semibold", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>{account.name}</p>
                    <p className={["text-xs", isDark ? "text-stone-400" : "text-charcoal/55"].join(" ")}>{account.email}</p>
                  </div>
                  <button type="button" onClick={() => removeAccount(account.id)} className={["inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-soft transition", isDark ? "border-stone-600 bg-stone-900/75 text-stone-100 hover:bg-stone-800" : "border-stone-300 bg-white/85 text-charcoal hover:bg-stone-50"].join(" ")}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
