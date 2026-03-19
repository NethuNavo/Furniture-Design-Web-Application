import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <AuthForm mode="signup" />
    </main>
  );
}
