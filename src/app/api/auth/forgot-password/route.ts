import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory OTP storage (in production, use a database)
const otpStore = new Map<string, { otp: string; expiresAt: number; email: string }>();

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (action === "send-otp") {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP in memory (in production, use a database)
      otpStore.set(normalizedEmail, { otp, expiresAt, email: normalizedEmail });

      // In production, send this OTP via email service
      // For now, we'll log it (in development only)
      console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);

      return NextResponse.json(
        { 
          message: "OTP sent to your email",
          // DEBUG: Remove in production
          debug_otp: process.env.NODE_ENV === "development" ? otp : undefined
        },
        { status: 200 }
      );
    }

    if (action === "verify-otp") {
      const { otp, newPassword } = await req.json();

      if (!otp || !newPassword) {
        return NextResponse.json(
          { error: "OTP and new password are required" },
          { status: 400 }
        );
      }

      const storedOtp = otpStore.get(normalizedEmail);

      if (!storedOtp) {
        return NextResponse.json(
          { error: "OTP not found. Please request a new one." },
          { status: 400 }
        );
      }

      // Check if OTP is expired
      if (Date.now() > storedOtp.expiresAt) {
        otpStore.delete(normalizedEmail);
        return NextResponse.json(
          { error: "OTP has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Check if OTP matches
      if (storedOtp.otp !== otp) {
        return NextResponse.json(
          { error: "Invalid OTP" },
          { status: 400 }
        );
      }

      // Clear the OTP
      otpStore.delete(normalizedEmail);

      // In production, update the password in the database
      // For now, we'll just return success
      console.log(`[DEV] Password reset for ${normalizedEmail}`);

      return NextResponse.json(
        { message: "Password reset successful" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
