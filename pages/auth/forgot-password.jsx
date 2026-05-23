import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import supabase from "@/utils/supabase";

const pillInput =
  "mt-1 w-full rounded-full border border-zinc-300 px-5 py-3 text-sm text-black focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200";

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
    <AuthLayout
      title="Forgot Password"
      imageUrl="https://images.unsplash.com/photo-1518608774889-b04d2abe7702?w=900&h=1200&fit=crop&q=80&auto=format"
      imageGradient="from-purple-900 via-violet-800 to-fuchsia-700"
      outerGradient="from-purple-100 via-white to-fuchsia-50"
      tagline={{ eyebrow: "Account recovery", line: "We'll get you back in, fast." }}
    >
      <Link
        href="/auth/login"
        aria-label="Back to sign in"
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="mt-8">
        {sent ? (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Check your email</h1>
            <p className="mt-3 text-sm text-zinc-600">
              We sent a password reset link to{" "}
              <span className="font-semibold text-zinc-900">{email}</span>.
              Click the link in the email to set a new password.
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Didn't get it? Check your spam folder, or{" "}
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="font-semibold text-zinc-900 underline underline-offset-4"
              >
                try a different email
              </button>
              .
            </p>
            <Link
              href="/auth/login"
              className="mt-8 inline-block w-full rounded-full bg-zinc-900 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Forgot Password</h1>
            <p className="mt-3 text-sm text-zinc-600">
              We'll send a verification link to your email address.
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white hover:enabled:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending link..." : "Send Verification Code"}
              </button>
            </form>

            <p className="mt-6 text-sm text-zinc-600">
              Remembered it?{" "}
              <Link href="/auth/login" className="font-bold text-zinc-900 underline underline-offset-4">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
