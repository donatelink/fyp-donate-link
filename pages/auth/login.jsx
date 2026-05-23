import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";
import supabase from "@/utils/supabase";

const pillInput =
  "mt-1 w-full rounded-full border border-zinc-300 px-5 py-3 text-sm text-black focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const dest =
      profile?.role === "admin"
        ? "/admin/dashboard"
        : profile?.role === "ngo"
        ? "/ngo/dashboard"
        : profile?.role === "beneficiary"
        ? "/beneficiary/dashboard"
        : "/donor/dashboard";
    router.push(dest);
  }

  return (
    <AuthLayout
      title="Sign In"
      imageUrl="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=900&h=1200&fit=crop&q=80&auto=format"
      imageGradient="from-rose-900 via-red-700 to-orange-600"
      outerGradient="from-rose-100 via-white to-orange-100"
      tagline={{ eyebrow: "Welcome back", line: "Pick up where your impact left off." }}
    >
      <Link
        href="/"
        aria-label="Back to home"
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Log in</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-bold text-zinc-900 underline underline-offset-4">
            Create an Account
          </Link>
        </p>

        {errorMsg && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-zinc-900">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={pillInput}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-zinc-900">
              Password
            </label>
            <PasswordInput
              id="password"
              variant="pill"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="mt-2 flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-bold text-zinc-900 underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white hover:enabled:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
