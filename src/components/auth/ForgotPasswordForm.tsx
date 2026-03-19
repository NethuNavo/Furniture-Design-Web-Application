"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ForgotPasswordStep = "email" | "otp-verification" | "reset-password" | "success";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "send-otp" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      // DEBUG: Show OTP in development
      if (data.debug_otp) {
        setDebugOtp(data.debug_otp);
      }

      setStep("otp-verification");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword,
          action: "verify-otp" 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setStep("success");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToLogin() {
    router.push("/login");
  }

  return (
    <section className="flex min-h-screen w-full items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 bg-stone-100">
      <div className="glass-card-strong mx-auto w-full max-w-md rounded-[1.45rem] p-6 sm:p-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {step === "email" && (
          <div>
            <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">
              Enter your email address and we'll send you a code to reset your password.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">Email Address</span>
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

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="button-pill mt-4 w-full py-2.5 text-sm disabled:opacity-70 sm:text-base"
              >
                {isLoading ? "Sending..." : "Send Code"}
              </button>
            </form>
          </div>
        )}

        {step === "otp-verification" && (
          <div>
            <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
              Verify Your Code
            </h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">
              Enter the code sent to {email} and your new password.
            </p>

            {debugOtp && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs text-blue-600">
                  <span className="font-semibold">Dev Mode:</span> Your OTP is <span className="font-mono font-bold">{debugOtp}</span>
                </p>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">Verification Code</span>
                <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                  <Mail className="h-4.5 w-4.5 text-charcoal/45" />
                  <input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/35 sm:text-base"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">New Password</span>
                <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                  <Lock className="h-4.5 w-4.5 text-charcoal/45" />
                  <input
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
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

              <label className="block space-y-2">
                <span className="text-sm font-medium text-charcoal/72">Confirm Password</span>
                <div className="flex items-center gap-3 rounded-[1rem] border border-stone-300 bg-stone-50 px-4 py-2.5">
                  <Lock className="h-4.5 w-4.5 text-charcoal/45" />
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
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

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="button-pill mt-4 w-full py-2.5 text-sm disabled:opacity-70 sm:text-base"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
              }}
              className="mt-4 w-full text-sm font-semibold text-charcoal/62 transition hover:text-charcoal"
            >
              Use different email
            </button>
          </div>
        )}

        {step === "success" && (
          <div>
            <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
              Password Reset Successfully
            </h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">
              Your password has been reset. You can now log in with your new password.
            </p>

            <button
              onClick={handleBackToLogin}
              className="button-pill mt-6 w-full py-2.5 text-sm sm:text-base"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
