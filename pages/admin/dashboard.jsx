import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

const MOCK_PENDING = [
  { id: "d_003", donor: "Ayesha K.", cause: "Orphan Care", amount: 25, stage: 2, txHash: "0x4a2f..." },
  { id: "d_004", donor: "John D.", cause: "Climate", amount: 500, stage: 2, txHash: "0x8d11..." },
  { id: "d_005", donor: "Hassan M.", cause: "Medical Aid", amount: 200, stage: 3, txHash: "0x2c91..." },
];

const STAGE_LABEL = { 1: "Pending", 2: "Confirmed", 3: "Allocated", 4: "Transferred", 5: "Completed" };

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

function makeSlug(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "ngo"}-${suffix}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [ngos, setNgos] = useState([]);
  const [ngoLoading, setNgoLoading] = useState(true);
  const [ngoError, setNgoError] = useState("");
  const [actingId, setActingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadNgos();
  }, []);

  async function loadNgos() {
    setNgoLoading(true);
    setNgoError("");
    const { data, error } = await supabase
      .from("ngos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setNgoError(error.message);
    else setNgos(data || []);
    setNgoLoading(false);
  }

  async function approve(ngo) {
    setActingId(ngo.id);
    const slug = ngo.slug || makeSlug(ngo.org_name);
    const { error } = await supabase
      .from("ngos")
      .update({ status: "approved", slug })
      .eq("id", ngo.id);
    if (error) setNgoError(error.message);
    else await loadNgos();
    setActingId(null);
  }

  async function reject(ngo) {
    setActingId(ngo.id);
    const { error } = await supabase
      .from("ngos")
      .update({ status: "rejected" })
      .eq("id", ngo.id);
    if (error) setNgoError(error.message);
    else await loadNgos();
    setActingId(null);
  }

  function ngoLink(slug) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/ngo/${slug}`;
  }

  async function copyLink(ngo) {
    try {
      await navigator.clipboard.writeText(ngoLink(ngo.slug));
      setCopiedId(ngo.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setNgoError("Couldn't copy — copy the link manually.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const pendingCount = ngos.filter((n) => n.status === "pending").length;

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
          {/* NGO Applications */}
          <section>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">NGO Applications</h1>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Review applications. Approving generates a unique public donation link for the NGO.
            </p>

            {ngoError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {ngoError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              {ngoLoading && <p className="text-sm text-zinc-500">Loading applications...</p>}

              {!ngoLoading && ngos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
                  No NGO applications yet.
                </div>
              )}

              {ngos.map((ngo) => (
                <div key={ngo.id} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-zinc-900">{ngo.org_name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                            STATUS_BADGE[ngo.status] || "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {ngo.status}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                          {ngo.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600">{ngo.description}</p>
                    </div>

                    {ngo.status === "pending" && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => approve(ngo)}
                          disabled={actingId === ngo.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:enabled:bg-emerald-700 disabled:opacity-60"
                        >
                          {actingId === ngo.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => reject(ngo)}
                          disabled={actingId === ngo.id}
                          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:enabled:bg-red-50 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                    <Detail label="Reg. No." value={ngo.reg_number} />
                    <Detail label="Contact" value={ngo.contact_person} />
                    <Detail label="Phone" value={ngo.phone} />
                    <Detail label="Email" value={ngo.email} />
                    <Detail label="Country" value={ngo.country} />
                    <Detail label="Website" value={ngo.website || "—"} />
                  </dl>

                  {ngo.status === "approved" && ngo.slug && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <span className="text-xs font-semibold text-emerald-700">Donation link:</span>
                      <code className="break-all text-xs text-emerald-800">{ngoLink(ngo.slug)}</code>
                      <button
                        onClick={() => copyLink(ngo)}
                        className="ml-auto rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        {copiedId === ngo.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Donation Lifecycle */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">Donation Lifecycle</h2>
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
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:w-auto"
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
          </section>
        </main>
      </div>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="truncate font-medium text-zinc-700">{value}</dd>
    </div>
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
