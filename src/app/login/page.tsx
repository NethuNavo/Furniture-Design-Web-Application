import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <AuthForm mode="login" />
    </main>
  );
}
