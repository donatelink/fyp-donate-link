import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const STAGES = [
  { num: 1, emoji: "⏳", title: "Pending", desc: "Donation initiated" },
  { num: 2, emoji: "✅", title: "Confirmed", desc: "Transaction hash on blockchain" },
  { num: 3, emoji: "📋", title: "Allocated", desc: "Admin assigns to verified cause" },
  { num: 4, emoji: "💸", title: "Transferred", desc: "Funds sent to beneficiary" },
  { num: 5, emoji: "🌟", title: "Completed", desc: "Impact proof uploaded" },
];

export default function TrackDonation() {
  const router = useRouter();
  const { id } = router.query;
  const currentStage = 4; // TODO: load from Supabase by id

  return (
    <>
      <Head>
        <title>Track Donation · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/donor/dashboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              ← Back to dashboard
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Donation ID</p>
          <h1 className="mt-1 font-mono text-lg text-zinc-900">{id || "..."}</h1>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-base font-semibold text-zinc-900">Lifecycle</h2>
            <ol className="mt-6 space-y-5">
              {STAGES.map((s) => {
                const reached = s.num <= currentStage;
                const current = s.num === currentStage;
                return (
                  <li key={s.num} className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                        reached
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-100 text-zinc-400"
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
        </main>
      </div>
    </>
  );
}
