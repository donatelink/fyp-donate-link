import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DonationModal from "@/components/DonationModal";
import supabase from "@/utils/supabase";

const STAGES = ["Pending", "Confirmed", "Allocated", "Transferred", "Completed"];

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
              current ? "bg-emerald-500" : reached ? "bg-emerald-300" : "bg-zinc-200"
            }`}
          />
        );
      })}
      <span className="ml-2 text-xs font-semibold text-zinc-600">{STAGES[stage - 1]}</span>
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

export default function DonorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [modalNgo, setModalNgo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
        return;
      }
      const [ngoRes, donRes] = await Promise.all([
        supabase.from("ngos").select("*").eq("status", "approved").order("org_name"),
        supabase
          .from("donations")
          .select("*")
          .eq("donor_id", session.user.id)
          .order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      if (ngoRes.error) setErrorMsg(ngoRes.error.message);
      if (donRes.error) setErrorMsg(donRes.error.message);
      setNgos(ngoRes.data || []);
      setDonations(donRes.data || []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function reloadDonations() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from("donations")
      .select("*")
      .eq("donor_id", session.user.id)
      .order("created_at", { ascending: false });
    setDonations(data || []);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const completed = donations.filter((d) => d.stage === 5).length;

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
                onClick={handleSignOut}
                className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-400 sm:px-4 sm:text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <DonationModal
          open={!!modalNgo}
          ngo={modalNgo}
          onClose={() => setModalNgo(null)}
          onDonated={reloadDonations}
        />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">Your Impact</h1>
          <p className="mt-1 text-sm text-zinc-600">Donate to a verified NGO and track it on-chain.</p>

          {errorMsg && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {loading && <p className="mt-6 text-sm text-zinc-500">Loading…</p>}

          {!loading && (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
                <StatCard label="Total Donated" value={`$${total}`} />
                <StatCard label="Donations" value={donations.length} />
                <StatCard label="Completed" value={completed} accent />
              </div>

              {/* Browse NGOs */}
              <div className="mt-8">
                <h2 className="text-base font-semibold text-zinc-900">Donate to an NGO</h2>
                <p className="text-sm text-zinc-600">Choose a verified NGO to support.</p>

                {ngos.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
                    No verified NGOs available yet. Check back soon.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ngos.map((ngo) => (
                      <div
                        key={ngo.id}
                        className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-900">{ngo.org_name}</h3>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                            {ngo.category}
                          </span>
                        </div>
                        <p className="mt-1 flex-1 text-sm text-zinc-600 line-clamp-3">
                          {ngo.description}
                        </p>
                        <p className="mt-2 text-xs text-zinc-400">{ngo.country}</p>
                        <button
                          onClick={() => setModalNgo(ngo)}
                          className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Donate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Donation history */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
                  <h2 className="text-base font-semibold text-zinc-900">Your Donations</h2>
                </div>

                {donations.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-zinc-500">
                    You haven't donated yet. Pick an NGO above to get started.
                  </div>
                ) : (
                  <>
                    {/* Mobile: card list */}
                    <ul className="divide-y divide-zinc-100 md:hidden">
                      {donations.map((d) => (
                        <li key={d.id} className="px-4 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-zinc-900">{d.ngo_name}</div>
                              <div className="mt-0.5 text-xs text-zinc-500">
                                {d.donation_type} · {fmtDate(d.created_at)}
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
                            <th className="px-5 py-3">NGO</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Stage</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d) => (
                            <tr key={d.id} className="border-t border-zinc-100">
                              <td className="px-5 py-4 font-medium text-zinc-900">{d.ngo_name}</td>
                              <td className="px-5 py-4 text-zinc-600">{d.donation_type}</td>
                              <td className="px-5 py-4 font-semibold text-zinc-900">${d.amount}</td>
                              <td className="px-5 py-4">
                                <StageTracker stage={d.stage} />
                              </td>
                              <td className="px-5 py-4 text-zinc-500">{fmtDate(d.created_at)}</td>
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
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div
        className={`mt-2 text-2xl font-bold sm:text-3xl ${
          accent ? "text-emerald-600" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
