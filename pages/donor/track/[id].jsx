import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

const STAGES = [
  { num: 1, emoji: "⏳", title: "Pending", desc: "Donation initiated" },
  { num: 2, emoji: "✅", title: "Confirmed", desc: "Payment confirmed" },
  { num: 3, emoji: "📋", title: "Allocated", desc: "NGO assigned the funds to a cause" },
  { num: 4, emoji: "💸", title: "Transferred", desc: "Funds sent to beneficiary" },
  { num: 5, emoji: "🌟", title: "Completed", desc: "Impact delivered" },
];

export default function TrackDonation() {
  const router = useRouter();
  const { id } = router.query;
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("donations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (active) {
        setDonation(data || null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const currentStage = donation?.stage || 0;

  return (
    <>
      <Head>
        <title>Track Donation · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/donor/dashboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              ← Back to dashboard
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          {loading && <p className="text-sm text-zinc-500">Loading…</p>}

          {!loading && !donation && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🔍</div>
              <h1 className="mt-3 text-lg font-bold text-zinc-900">Donation not found</h1>
              <p className="mt-1 text-sm text-zinc-600">
                This donation doesn't exist or you don't have access to it.
              </p>
            </div>
          )}

          {!loading && donation && (
            <>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Donation to</p>
                    <h1 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
                      {donation.ngo_name}
                    </h1>
                    <p className="mt-0.5 text-sm text-zinc-500">{donation.donation_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Amount</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">${donation.amount}</p>
                  </div>
                </div>
                <p className="mt-3 break-all font-mono text-xs text-zinc-400">ID: {donation.id}</p>
              </div>

              {donation.note && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Latest update from the NGO
                  </p>
                  <p className="mt-1 text-sm text-emerald-800">{donation.note}</p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
                <h2 className="text-base font-semibold text-zinc-900">Lifecycle</h2>
                <ol className="mt-6 space-y-5">
                  {STAGES.map((s) => {
                    const reached = s.num <= currentStage;
                    const current = s.num === currentStage;
                    return (
                      <li key={s.num} className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                            reached ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"
                          }`}
                        >
                          {s.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${reached ? "text-zinc-900" : "text-zinc-400"}`}>
                              Stage {s.num} — {s.title}
                            </h3>
                            {current && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                Current
                              </span>
                            )}
                          </div>
                          <p className={`mt-0.5 text-sm ${reached ? "text-zinc-600" : "text-zinc-400"}`}>
                            {s.desc}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
