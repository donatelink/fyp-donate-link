import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";

const MOCK_PENDING = [
  { id: "d_003", donor: "Ayesha K.", cause: "Orphan Care", amount: 25, stage: 2, txHash: "0x4a2f..." },
  { id: "d_004", donor: "John D.", cause: "Climate", amount: 500, stage: 2, txHash: "0x8d11..." },
  { id: "d_005", donor: "Hassan M.", cause: "Medical Aid", amount: 200, stage: 3, txHash: "0x2c91..." },
];

const STAGE_LABEL = { 1: "Pending", 2: "Confirmed", 3: "Allocated", 4: "Transferred", 5: "Completed" };

export default function AdminDashboard() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Admin · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg">
              <span className="text-xl">🌍</span>
              DonateLink
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 sm:px-3">
                Admin
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-400 sm:px-4 sm:text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">Donation Lifecycle</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Advance donations through their stages and upload proof of allocation.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard label="Awaiting Action" value="3" />
            <StatCard label="In Allocation" value="1" />
            <StatCard label="Completed Today" value="12" />
            <StatCard label="Total Volume" value="$48,290" />
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
              <h2 className="text-base font-semibold text-zinc-900">Pending Donations</h2>
              <input
                type="search"
                placeholder="Search donor or cause..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:w-auto"
              />
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-zinc-100 md:hidden">
              {MOCK_PENDING.map((d) => (
                <li key={d.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-900">{d.donor}</div>
                      <div className="mt-0.5 text-xs text-zinc-500">{d.cause}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-900">${d.amount}</div>
                      <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                        {d.stage} · {STAGE_LABEL[d.stage]}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 truncate font-mono text-xs text-zinc-500">
                    TX: {d.txHash}
                  </div>
                  <button className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                    Advance Stage →
                  </button>
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">Donor</th>
                    <th className="px-5 py-3">Cause</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">TX Hash</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PENDING.map((d) => (
                    <tr key={d.id} className="border-t border-zinc-100">
                      <td className="px-5 py-4 font-medium text-zinc-900">{d.donor}</td>
                      <td className="px-5 py-4 text-zinc-700">{d.cause}</td>
                      <td className="px-5 py-4 font-semibold text-zinc-900">${d.amount}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                          {d.stage} · {STAGE_LABEL[d.stage]}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">{d.txHash}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                          Advance Stage →
                        </button>
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 text-xl font-bold text-zinc-900 sm:text-2xl">{value}</div>
    </div>
  );
}
