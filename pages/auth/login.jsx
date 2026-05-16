import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import supabase from "@/utils/supabase";

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
        : "/donor/dashboard";
    router.push(dest);
  }

  return (
    <>
      <Head>
        <title>Sign In · DonateLink</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-zinc-900">
            <span className="text-2xl">🌍</span>
            DonateLink
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
            <p className="mt-1 text-sm text-zinc-600">Sign in to continue your impact.</p>

            {errorMsg && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
