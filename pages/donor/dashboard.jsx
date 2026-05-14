import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DonationModal from "@/components/DonationModal";
import supabase from "@/utils/supabase";

const STAGES = ["Pending", "Confirmed", "Allocated", "Transferred", "Completed"];

const MOCK_DONATIONS = [
  { id: "d_001", cause: "Medical Aid", amount: 50, type: "Sadaqah", stage: 4, date: "2026-05-08" },
  { id: "d_002", cause: "Clean Water", amount: 100, type: "One-Time", stage: 5, date: "2026-04-22" },
  { id: "d_003", cause: "Orphan Care", amount: 25, type: "Sadaqah", stage: 2, date: "2026-05-10" },
];

function StageTracker({ stage }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {STAGES.map((label, i) => {
        const reached = i < stage;
        const current = i === stage - 1;
        return (
          <div
            key={label}
            title={label}
            className={`h-2 w-5 rounded-full sm:w-6 ${
              current
                ? "bg-emerald-500"
                : reached
                ? "bg-emerald-300"
                : "bg-zinc-200"
            }`}
          />
        );
      })}
      <span className="ml-2 text-xs font-semibold text-zinc-600">
        {STAGES[stage - 1]}
      </span>
    </div>
  );
}

export default function DonorDashboard() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const total = MOCK_DONATIONS.reduce((sum, d) => sum + d.amount, 0);
  const completed = MOCK_DONATIONS.filter((d) => d.stage === 5).length;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Dashboard · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg">
              <span className="text-xl">🌍</span>
              DonateLink
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden text-sm text-zinc-600 sm:inline">Donor</span>
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">+ Donate</span>
                <span className="hidden sm:inline">New Donation</span>
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-400 sm:px-4 sm:text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <DonationModal open={modalOpen} onClose={() => setModalOpen(false)} />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">Your Impact</h1>
          <p className="mt-1 text-sm text-zinc-600">Track every donation on-chain.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Total Donated</div>
              <div className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">${total}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Donations</div>
              <div className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">{MOCK_DONATIONS.length}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Completed</div>
              <div className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">{completed}</div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
              <h2 className="text-base font-semibold text-zinc-900">Recent Donations</h2>
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-zinc-100 md:hidden">
              {MOCK_DONATIONS.map((d) => (
                <li key={d.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-zinc-900">{d.cause}</div>
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {d.type} · {d.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-900">${d.amount}</div>
                      <Link
                        href={`/donor/track/${d.id}`}
                        className="mt-1 inline-block text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StageTracker stage={d.stage} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">Cause</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DONATIONS.map((d) => (
                    <tr key={d.id} className="border-t border-zinc-100">
                      <td className="px-5 py-4 font-medium text-zinc-900">{d.cause}</td>
                      <td className="px-5 py-4 text-zinc-600">{d.type}</td>
                      <td className="px-5 py-4 font-semibold text-zinc-900">${d.amount}</td>
                      <td className="px-5 py-4"><StageTracker stage={d.stage} /></td>
                      <td className="px-5 py-4 text-zinc-500">{d.date}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/donor/track/${d.id}`}
                          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          Track →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
