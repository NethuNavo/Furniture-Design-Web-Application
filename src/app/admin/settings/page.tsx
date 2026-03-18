"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit, Eye, EyeOff, Key, Moon, SunMedium, User, X } from "lucide-react";
import { useAdminPanel } from "@/components/admin/AdminProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  const { accounts, theme, setTheme, updateAccount } = useAdminPanel();
  const isDark = theme === "dark";
  const mainAdmin = useMemo(
    () => accounts.find((account) => account.email === "admin@nord.com") ?? accounts.find((account) => account.role === "admin"),
    [accounts],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (mainAdmin) {
      setName(mainAdmin.name ?? "Admin User");
      setEmail(mainAdmin.email ?? "admin@nord.com");
      setAvatarUrl(mainAdmin.avatarUrl ?? "");
    }
  }, [mainAdmin]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mainAdmin || !name || !email) {
      return;
    }

    updateAccount(mainAdmin.id, {
      name,
      email,
      avatarUrl,
    });

    setIsEditing(false);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Mock validation - in real app, verify old password
    if (oldPassword !== "admin123") { // Assuming default admin password
      alert("Old password is incorrect.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    // Update password
    updateAccount(mainAdmin!.id, {
      passwordHash: newPassword,
    });

    setIsPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    alert("Password changed successfully!");
  }

  return (
    <div className="space-y-7">
      <AdminHeader title="Settings" subtitle="Manage your admin account and dashboard preferences." />

      {/* Admin Account Details Card */}
      <section className="space-y-4">
        <article
          className={[
            "rounded-[1.5rem] border p-6 shadow-soft backdrop-blur-xl",
            isDark
              ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]"
              : "glass-card border-stone-300/70",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>
              Admin Account Details
            </h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-600 bg-stone-800 px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-stone-700"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-stone-600">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Admin Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h3 className={["text-lg font-semibold", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>{name}</h3>
                  <p className={["text-sm", isDark ? "text-stone-300" : "text-charcoal/70"].join(" ")}>{email}</p>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-200 text-stone-600">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Admin Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-stone-300">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-stone-300 file:mr-4 file:rounded-full file:border-0 file:bg-stone-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-stone-100 hover:file:bg-stone-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300">Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Admin name"
                  className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none mt-1", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="Admin email"
                  className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none mt-1", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex-1 rounded-[1rem] border border-stone-600 bg-stone-800 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-700"
                >
                  <Key className="mr-2 inline h-4 w-4" />
                  Change Password
                </button>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="button-pill flex-1 justify-center py-3 text-sm">Save Changes</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(mainAdmin?.name ?? "Admin User");
                    setEmail(mainAdmin?.email ?? "admin@nord.com");
                    setAvatarUrl(mainAdmin?.avatarUrl ?? "");
                  }}
                  className="flex-1 rounded-[1rem] border border-stone-600 bg-stone-800 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </article>

        {/* Theme Mode Card */}
        <article
          className={[
            "rounded-[1.5rem] border p-5 shadow-soft backdrop-blur-xl",
            isDark
              ? "border-stone-700/70 bg-[rgba(30,24,21,0.74)]"
              : "glass-card border-stone-300/70",
          ].join(" ")}
        >
          <h2 className={["text-[1.25rem] font-semibold tracking-tight", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>Theme mode</h2>
          <p className={["mt-2 text-sm leading-7", isDark ? "text-stone-300/72" : "text-charcoal/65"].join(" ")}>Switch the admin workspace between a light and dark interface.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-[1rem] border px-4 py-4 text-left text-sm font-medium shadow-soft transition ${
                theme === "light" ? "border-charcoal bg-charcoal text-white" : isDark ? "border-stone-600 bg-stone-900/70 text-stone-100" : "border-stone-300 bg-white/75 text-charcoal"
              }`}
            >
              <SunMedium className="h-4 w-4" />
              Light mode
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-[1rem] border px-4 py-4 text-left text-sm font-medium shadow-soft transition ${
                theme === "dark" ? "border-charcoal bg-charcoal text-white" : isDark ? "border-stone-600 bg-stone-900/70 text-stone-100" : "border-stone-300 bg-white/75 text-charcoal"
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark mode
            </button>
          </div>
        </article>
      </section>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={["w-full max-w-md rounded-[1.5rem] border p-6 shadow-soft", isDark ? "border-stone-700/70 bg-[rgba(30,24,21,0.95)]" : "border-stone-300/70 bg-white"].join(" ")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={["text-lg font-semibold", isDark ? "text-stone-100" : "text-charcoal"].join(" ")}>Change Password</h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300">Current Password</label>
                <div className="relative mt-1">
                  <input
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300">New Password</label>
                <div className="relative mt-1">
                  <input
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300">Confirm New Password</label>
                <div className="relative mt-1">
                  <input
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={["w-full rounded-[1rem] border px-4 py-3 text-sm outline-none", isDark ? "border-stone-600 bg-stone-900/70 text-stone-100 placeholder:text-stone-400" : "border-stone-300 bg-white/75 text-charcoal"].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="button-pill flex-1 justify-center py-3 text-sm">Change Password</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="flex-1 rounded-[1rem] border border-stone-600 bg-stone-800 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
