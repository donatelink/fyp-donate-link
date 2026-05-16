import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StageAdvanceModal from "@/components/StageAdvanceModal";
import supabase from "@/utils/supabase";

const STAGE_LABELS = ["Pending", "Confirmed", "Allocated", "Transferred", "Completed"];

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

function StageBadge({ stage }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      Stage {stage} · {STAGE_LABELS[stage - 1]}
    </span>
  );
}

export default function NgoDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ngo, setNgo] = useState(null);
  const [donations, setDonations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [advanceDon, setAdvanceDon] = useState(null);

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

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      if (profile?.role !== "ngo") {
        router.replace("/donor/dashboard");
        return;
      }

      const { data: ngoRow, error } = await supabase
        .from("ngos")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      setNgo(ngoRow || null);

      if (ngoRow) {
        const { data: donRows } = await supabase
          .from("donations")
          .select("*")
          .eq("ngo_id", ngoRow.id)
          .order("created_at", { ascending: false });
        if (active) setDonations(donRows || []);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  async function loadDonations() {
    if (!ngo) return;
    const { data } = await supabase
      .from("donations")
      .select("*")
      .eq("ngo_id", ngo.id)
      .order("created_at", { ascending: false });
    setDonations(data || []);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const donationLink =
    ngo?.slug && typeof window !== "undefined"
      ? `${window.location.origin}/ngo/${ngo.slug}`
      : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(donationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const completed = donations.filter((d) => d.stage === 5).length;

  return (
    <>
      <Head>
        <title>NGO Dashboard · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg">
              <span className="text-xl">🌍</span>
              DonateLink
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:px-3">
                NGO
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

        <StageAdvanceModal
          open={!!advanceDon}
          donation={advanceDon}
          onClose={() => setAdvanceDon(null)}
          onAdvanced={loadDonations}
        />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {loading && <p className="text-sm text-zinc-500">Loading your dashboard…</p>}

          {!loading && errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {!loading && !ngo && !errorMsg && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🗂️</div>
              <h1 className="mt-3 text-lg font-bold text-zinc-900">No NGO profile linked</h1>
              <p className="mt-1 text-sm text-zinc-600">
                We couldn't find an NGO application for this account. Contact the DonateLink admin.
              </p>
            </div>
          )}

          {!loading && ngo && (
            <>
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">{ngo.org_name}</h1>
              <p className="mt-1 text-sm text-zinc-600">
                Manage donations to your NGO and keep donors updated on every stage.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <StatCard label="Total Raised" value={`$${totalRaised}`} />
                <StatCard label="Donations" value={donations.length} />
                <StatCard label="Completed" value={completed} accent />
                <StatCard label="In Progress" value={donations.length - completed} />
              </div>

              {/* Public donation link */}
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Your public donation link
                </div>
                <p className="mt-1 text-xs text-emerald-700">
                  Share this link anywhere — donors use it to give directly to your NGO.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <code className="break-all rounded-md bg-white px-3 py-2 text-xs text-emerald-800">
                    {donationLink || "Link unavailable"}
                  </code>
                  {donationLink && (
                    <button
                      onClick={copyLink}
                      className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  )}
                </div>
              </div>

              {/* Donations */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
                  <h2 className="text-base font-semibold text-zinc-900">Donations to your NGO</h2>
                  <p className="text-xs text-zinc-500">
                    Advance each donation through the 5 stages so donors can track their impact.
                  </p>
                </div>

                {donations.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-zinc-500">
                    No donations yet. Share your donation link to start receiving support.
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {donations.map((d) => (
                      <li key={d.id} className="px-4 py-4 sm:px-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900">{d.donor_name}</div>
                            <div className="mt-0.5 text-xs text-zinc-500">
                              {d.donor_email} · {d.donation_type} · {fmtDate(d.created_at)}
                            </div>
                            <div className="mt-2">
                              <StageBadge stage={d.stage} />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-zinc-900">${d.amount}</div>
                            {d.stage < 5 ? (
                              <button
                                onClick={() => setAdvanceDon(d)}
                                className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                              >
                                Advance → {STAGE_LABELS[d.stage]}
                              </button>
                            ) : (
                              <span className="mt-2 inline-block text-xs font-semibold text-emerald-600">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                        </div>
                        {d.note && (
                          <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                            Note to donor: {d.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
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
        className={`mt-2 text-xl font-bold sm:text-2xl ${
          accent ? "text-emerald-600" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
