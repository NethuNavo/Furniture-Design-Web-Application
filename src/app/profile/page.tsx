"use client";

import { useEffect, useState } from "react";
import { Camera, Heart, Mail, Save, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import aboutUsImage from "../../../image/about us page.png";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatar);
  }, [user]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      await updateProfile({
        name: name.trim() || "Nord Living Member",
        email: email.trim() || user?.email || "",
        avatar,
      });
      window.alert("Your profile details were updated.");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-stone-100 text-charcoal">
        <Navbar />
        <section className="relative w-full overflow-hidden px-5 py-8 sm:px-7 lg:px-8 lg:py-9">
          <div className="absolute inset-0 opacity-[0.14]">
            <img src={aboutUsImage.src} alt="Nord Living profile background" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,236,0.96)_0%,rgba(247,243,236,0.9)_100%)]" />

          <div className="relative mx-auto w-full max-w-[1520px] space-y-6">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#476255]/70">Customer Profile</p>
              <h1 className="mt-2 font-display text-[2.2rem] font-semibold tracking-tight text-[#2f4b40] sm:text-[2.6rem] lg:text-[2.9rem]">
                Your Nord Living account
              </h1>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-[#4c6459] sm:text-[1.02rem]">
                Edit your personal details, add a profile image, and keep your room-planning experience connected across saved spaces.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="glass-card rounded-[1.8rem] p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border border-stone-300 bg-white shadow-soft">
                    {avatar ? (
                      <img src={avatar} alt={name || "Profile"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-charcoal text-white">
                        <UserRound className="h-10 w-10" />
                      </div>
                    )}

                    <label className="absolute bottom-1 right-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-charcoal text-white shadow-soft transition hover:opacity-90">
                      <Camera className="h-4.5 w-4.5" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[1.7rem] font-semibold text-[#2f4b40]">Edit your details</h2>
                    <p className="mt-1.5 text-sm leading-6 text-[#4c6459] sm:text-[0.98rem]">
                      Update the name and email shown across your Nord Living customer account.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#476255]/75">Full Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-[1.05rem] border border-white/60 bg-white/68 px-4 py-3 text-[0.98rem] text-charcoal outline-none shadow-[0_14px_30px_rgba(58,49,44,0.08)] backdrop-blur-md"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#476255]/75">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-[1.05rem] border border-white/60 bg-white/68 px-4 py-3 text-[0.98rem] text-charcoal outline-none shadow-[0_14px_30px_rgba(58,49,44,0.08)] backdrop-blur-md"
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <button type="button" onClick={handleSaveProfile} disabled={isSaving} className="button-pill gap-3 px-6 py-3 text-[0.98rem] disabled:opacity-70">
                    <Save className="h-4.5 w-4.5" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </section>

              <section className="glass-card rounded-[1.8rem] p-6 sm:p-7">
                <div className="flex items-center gap-3 text-[#2f4b40]">
                  <Heart className="h-5 w-5" />
                  <h2 className="text-[1.7rem] font-semibold">Membership benefits</h2>
                </div>

                <div className="mt-5 grid gap-3.5">
                  {[
                    "Access the private 2D room designer workspace",
                    "Save layouts and revisit design ideas later",
                    "Keep your room-planning workflow connected to shopping",
                  ].map((item) => (
                    <div key={item} className="glass-subcard rounded-[1.15rem] px-4 py-3.5 text-[0.97rem] leading-6 text-[#4c6459]">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3.5">
                  <div className="glass-subcard rounded-[1.15rem] px-4 py-4">
                    <div className="flex items-center gap-3 text-[#476255]/80">
                      <UserRound className="h-5 w-5" />
                      <span className="text-xs uppercase tracking-[0.24em]">Profile Name</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-[#2f4b40]">{name || "Nord Living Member"}</p>
                  </div>

                  <div className="glass-subcard rounded-[1.15rem] px-4 py-4">
                    <div className="flex items-center gap-3 text-[#476255]/80">
                      <Mail className="h-5 w-5" />
                      <span className="text-xs uppercase tracking-[0.24em]">Email Address</span>
                    </div>
                    <p className="mt-2 break-all text-lg font-semibold text-[#2f4b40]">{email || "member@nord.com"}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
