import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

export default function AcceptInvite() {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | ready | invalid | done
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // The Supabase client auto-parses the invite token from the URL and
    // establishes a session, firing SIGNED_IN once it's ready.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setStatus("ready");
    });

    // Fallback in case the session was established before this listener attached.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setStatus((prev) => {
        if (prev !== "checking") return prev;
        return data.session ? "ready" : "invalid";
      });
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/ngo/dashboard"), 1200);
  }

  return (
    <>
      <Head>
        <title>Activate NGO Account · DonateLink</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-zinc-900">
            <span className="text-2xl">🌍</span>
            DonateLink
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            {status === "checking" && (
              <div className="py-8 text-center text-sm text-zinc-500">
                Verifying your invite…
              </div>
            )}

            {status === "invalid" && (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Link expired or invalid</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  This invite link is no longer valid. Please ask the DonateLink admin to
                  re-send your invitation.
                </p>
                <Link
                  href="/"
                  className="mt-6 block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Back to home
                </Link>
              </>
            )}

            {status === "done" && (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Account activated 🎉</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  Your NGO account is ready. Taking you to your dashboard…
                </p>
              </>
            )}

            {status === "ready" && (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Set your password</h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Your NGO application was approved. Create a password to access your dashboard.
                </p>

                {errorMsg && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Min. 8 characters"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-zinc-700">
                      Confirm password
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      required
                      minLength={8}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Re-enter password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Activating..." : "Activate Account"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
