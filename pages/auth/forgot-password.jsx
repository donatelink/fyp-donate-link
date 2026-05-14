import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import supabase from "@/utils/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <>
      <Head>
        <title>Forgot Password · DonateLink</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-zinc-900">
            <span className="text-2xl">🌍</span>
            DonateLink
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            {sent ? (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Check your email</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  We sent a password reset link to <span className="font-semibold text-zinc-900">{email}</span>.
                  Click the link in the email to set a new password.
                </p>
                <p className="mt-4 text-xs text-zinc-500">
                  Didn't get it? Check your spam folder, or{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    try a different email
                  </button>
                  .
                </p>
                <Link
                  href="/auth/login"
                  className="mt-6 block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Back to Sign In
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Forgot your password?</h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Enter your email and we'll send you a link to reset it.
                </p>

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
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending link..." : "Send Reset Link"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600">
                  Remembered it?{" "}
                  <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                    Back to sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
