"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Armchair, ArrowLeft, Eye, EyeOff, Home, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_EMAIL, ADMIN_PASSWORD, getRoleFromEmail } from "@/lib/auth";
import homePageCoverImage from "../../../image/home page cover 2.png";

type AuthFormMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthFormMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";
  const helperMessage = searchParams.get("message");
  const isLogin = mode === "login";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !fullName)) {
      setError("Please complete all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isLogin && normalizedEmail === ADMIN_EMAIL.toLowerCase() && password !== ADMIN_PASSWORD) {
      setError("Use the correct admin password to access the admin dashboard.");
      return;
    }

    if (!isLogin && normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      setError("The admin account is predefined. Please log in with the admin credentials.");
      return;
    }

    try {
      setIsSubmitting(true);

      const user = isLogin
        ? await login({ email, password })
        : await signup({ fullName, email, password });

      const redirectParam = searchParams.get("redirect");
      const role = getRoleFromEmail(user.email.trim().toLowerCase());
      const defaultDestination = role === "admin" ? "/admin" : "/";
      const destination = redirectParam || defaultDestination;

      router.push(destination);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-20px)] w-full items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="glass-card-strong mx-auto grid w-full max-w-[1260px] overflow-hidden rounded-[1.45rem] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="max-w-2xl">
            <Link
              href="/room-designer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            {helperMessage ? (
              <div className="mb-4 mt-4 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-charcoal/68">
                {helperMessage}
              </div>
            ) : null}

            <h1 className="mt-5 font-display text-[2.35rem] font-semibold tracking-tight text-charcoal sm:text-[2.7rem] lg:text-[2.95rem]">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/68 sm:text-[0.95rem]">
              {isLogin
                ? "Log in to continue designing your dream space"
                : "Sign up to save designs and start planning your room"}
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              {!isLogin ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-charcoal/72">Full Name</span>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                    <UserRound className="h-4.5 w-4.5 text-charcoal/45" />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 sm:text-base"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">Email</span>
                <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                  <Mail className="h-4.5 w-4.5 text-charcoal/45" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 sm:text-base"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">Password</span>
                <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                  <LockKeyhole className="h-4.5 w-4.5 text-charcoal/45" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-charcoal/45 hover:text-charcoal/70"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </label>

              {!isLogin ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-charcoal/72">Confirm Password</span>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                    <LockKeyhole className="h-4.5 w-4.5 text-charcoal/45" />
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-charcoal/45 hover:text-charcoal/70"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </label>
              ) : null}

              {isLogin && (
                <div className="pt-1 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-charcoal/62 transition hover:text-charcoal"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {error ? <p className="text-sm text-[#9b4b44]">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="button-pill mt-2 w-full py-2.5 text-sm disabled:opacity-70 sm:text-base">
                {isSubmitting ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>

            <p className="mt-6 text-sm text-charcoal/62">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={
                  isLogin
                    ? `/signup?redirect=${encodeURIComponent(redirectTo)}`
                    : `/login?redirect=${encodeURIComponent(redirectTo)}`
                }
                className="font-semibold text-charcoal transition hover:opacity-80"
              >
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden min-h-full overflow-hidden bg-stone-200 lg:block">
          <img
            src={homePageCoverImage.src}
            alt="Nord Living private designer preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,239,232,0.36)_0%,rgba(233,223,211,0.46)_100%)]" />
          <div className="relative flex h-full flex-col p-4 lg:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="w-fit rounded-full border border-white/60 bg-white/45 px-4 py-2 text-sm text-charcoal/62 shadow-soft backdrop-blur-sm">
                Private designer access
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-3 py-2 text-charcoal shadow-soft backdrop-blur-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-charcoal/70">Nord Living</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/75 shadow-soft">
                  <Armchair className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </div>
            </div>

            <div className="mt-auto mb-auto space-y-4">
              <div className="rounded-[1.25rem] border border-white/70 bg-white/58 p-5 shadow-soft-lg backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3 text-charcoal">
                  <Home className="h-5 w-5" />
                  <span className="text-base font-semibold">Plan your space with confidence</span>
                </div>
                <div className="grid gap-2.5">
                  {[
                    "Lay out furniture in a 2D room planner",
                    "Save private room concepts to revisit later",
                    "Switch to a future 3D preview experience",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1rem] bg-white/75 px-4 py-2.5 text-sm text-charcoal/70 shadow-soft"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <p className="max-w-lg text-sm leading-6 text-charcoal/72">
                Nord Living members can move from inspiration to planning in one calm, connected workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
