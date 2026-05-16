import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StageAdvanceModal from "@/components/StageAdvanceModal";
import supabase from "@/utils/supabase";

const STAGE_LABEL = { 1: "Pending", 2: "Confirmed", 3: "Allocated", 4: "Transferred", 5: "Completed" };

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const MENU = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "approvals", label: "NGO Approvals", icon: "✅" },
  { id: "donations", label: "Donations", icon: "💸" },
  { id: "ngos", label: "NGOs", icon: "🏢" },
  { id: "donors", label: "Donors", icon: "🧑" },
];

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState("overview");

  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actingId, setActingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [advanceDon, setAdvanceDon] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    const [ngoRes, donRes] = await Promise.all([
      supabase.from("ngos").select("*").order("created_at", { ascending: false }),
      supabase.from("donations").select("*").order("created_at", { ascending: false }),
    ]);
    if (ngoRes.error) setError(ngoRes.error.message);
    if (donRes.error) setError(donRes.error.message);
    setNgos(ngoRes.data || []);
    setDonations(donRes.data || []);
    setLoading(false);
  }

  async function loadDonations() {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    setDonations(data || []);
  }

  async function approve(ngo) {
    setActingId(ngo.id);
    setError("");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("Your admin session expired — please sign in again.");
      setActingId(null);
      return;
    }
    const res = await fetch("/api/approve-ngo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ngoId: ngo.id }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json.error || "Approval failed.");
    else await loadAll();
    setActingId(null);
  }

  async function reject(ngo) {
    setActingId(ngo.id);
    const { error: e } = await supabase
      .from("ngos")
      .update({ status: "rejected" })
      .eq("id", ngo.id);
    if (e) setError(e.message);
    else await loadAll();
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
      setError("Couldn't copy — copy the link manually.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const pendingCount = ngos.filter((n) => n.status === "pending").length;

  // Derived: per-NGO stats
  const ngoStats = ngos.map((n) => {
    const list = donations.filter((d) => d.ngo_id === n.id);
    return {
      ...n,
      donCount: list.length,
      raised: list.reduce((s, d) => s + Number(d.amount), 0),
    };
  });

  // Derived: donor directory aggregated from donations
  const donorMap = {};
  for (const d of donations) {
    const key = d.donor_id || d.donor_email || d.donor_name;
    if (!donorMap[key]) {
      donorMap[key] = { name: d.donor_name, email: d.donor_email, count: 0, total: 0 };
    }
    donorMap[key].count += 1;
    donorMap[key].total += Number(d.amount);
  }
  const donors = Object.values(donorMap).sort((a, b) => b.total - a.total);

  const totalVolume = donations.reduce((s, d) => s + Number(d.amount), 0);

  const activeMenu = MENU.find((m) => m.id === view);

  return (
    <>
      <Head>
        <title>Admin · DonateLink</title>
      </Head>

      <StageAdvanceModal
        open={!!advanceDon}
        donation={advanceDon}
        onClose={() => setAdvanceDon(null)}
        onAdvanced={loadDonations}
      />

      <div className="min-h-screen bg-zinc-50 md:flex">
        {/* Sidebar */}
        <aside className="border-b border-zinc-200 bg-white md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <span className="text-xl">🌍</span>
              DonateLink
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-400 md:hidden"
            >
              Sign Out
            </button>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-1 md:overflow-visible">
            {MENU.map((m) => {
              const active = view === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setView(m.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                  {m.id === "approvals" && pendingCount > 0 && (
                    <span className="ml-auto rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden px-3 pb-4 md:block">
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeMenu?.icon}</span>
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">{activeMenu?.label}</h1>
              <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Admin
              </span>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <p className="mt-6 text-sm text-zinc-500">Loading…</p>
            ) : (
              <div className="mt-6">
                {view === "overview" && (
                  <OverviewView
                    ngos={ngos}
                    donations={donations}
                    pendingCount={pendingCount}
                    totalVolume={totalVolume}
                  />
                )}
                {view === "approvals" && (
                  <ApprovalsView
                    ngos={ngos}
                    actingId={actingId}
                    approve={approve}
                    reject={reject}
                    ngoLink={ngoLink}
                    copyLink={copyLink}
                    copiedId={copiedId}
                  />
                )}
                {view === "donations" && (
                  <DonationsView donations={donations} onAdvance={setAdvanceDon} />
                )}
                {view === "ngos" && <NgosView ngoStats={ngoStats} ngoLink={ngoLink} />}
                {view === "donors" && <DonorsView donors={donors} />}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* ---------- Overview ---------- */
function OverviewView({ ngos, donations, pendingCount, totalVolume }) {
  const approved = ngos.filter((n) => n.status === "approved").length;
  const completed = donations.filter((d) => d.stage === 5).length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total NGOs" value={ngos.length} />
        <StatCard label="Pending" value={pendingCount} accent="amber" />
        <StatCard label="Approved NGOs" value={approved} />
        <StatCard label="Donations" value={donations.length} />
        <StatCard label="Completed" value={completed} accent="emerald" />
        <StatCard label="Total Volume" value={`$${totalVolume}`} />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <h2 className="text-base font-semibold text-zinc-900">Donations by Stage</h2>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4, 5].map((st) => {
            const count = donations.filter((d) => d.stage === st).length;
            const pct = donations.length ? (count / donations.length) * 100 : 0;
            return (
              <div key={st}>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>
                    Stage {st} · {STAGE_LABEL[st]}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {donations.length === 0 && (
            <p className="text-sm text-zinc-500">No donations yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- NGO Approvals ---------- */
function ApprovalsView({ ngos, actingId, approve, reject, ngoLink, copyLink, copiedId }) {
  if (ngos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        No NGO applications yet.
      </div>
    );
  }
  return (
    <div className="space-y-3">
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
  );
}

/* ---------- Donations ---------- */
function DonationsView({ donations, onAdvance }) {
  if (donations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        No donations yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {/* Mobile cards */}
      <ul className="divide-y divide-zinc-100 md:hidden">
        {donations.map((d) => (
          <li key={d.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-zinc-900">{d.donor_name}</div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  → {d.ngo_name} · {fmtDate(d.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-zinc-900">${d.amount}</div>
                <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                  {d.stage} · {STAGE_LABEL[d.stage]}
                </span>
              </div>
            </div>
            {d.stage < 5 ? (
              <button
                onClick={() => onAdvance(d)}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Advance Stage →
              </button>
            ) : (
              <p className="mt-3 text-center text-xs font-semibold text-emerald-600">✓ Completed</p>
            )}
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Donor</th>
              <th className="px-5 py-3">NGO</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-zinc-100">
                <td className="px-5 py-4 font-medium text-zinc-900">{d.donor_name}</td>
                <td className="px-5 py-4 text-zinc-700">{d.ngo_name}</td>
                <td className="px-5 py-4 font-semibold text-zinc-900">${d.amount}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                    {d.stage} · {STAGE_LABEL[d.stage]}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-500">{fmtDate(d.created_at)}</td>
                <td className="px-5 py-4 text-right">
                  {d.stage < 5 ? (
                    <button
                      onClick={() => onAdvance(d)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Advance Stage →
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">✓ Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- NGOs ---------- */
function NgosView({ ngoStats, ngoLink }) {
  if (ngoStats.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        No NGOs yet.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {ngoStats.map((n) => (
        <div key={n.id} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-zinc-900">{n.org_name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                    STATUS_BADGE[n.status] || "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {n.status}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                  {n.category}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Donations</div>
                <div className="font-bold text-zinc-900">{n.donCount}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400">Raised</div>
                <div className="font-bold text-emerald-600">${n.raised}</div>
              </div>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
            <Detail label="Contact" value={n.contact_person} />
            <Detail label="Email" value={n.email} />
            <Detail label="Phone" value={n.phone} />
            <Detail label="Country" value={n.country} />
          </dl>
          {n.status === "approved" && n.slug && (
            <p className="mt-2 break-all text-xs text-emerald-700">{ngoLink(n.slug)}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Donors ---------- */
function DonorsView({ donors }) {
  if (donors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        No donors yet — no donations have been made.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {/* Mobile cards */}
      <ul className="divide-y divide-zinc-100 md:hidden">
        {donors.map((d, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-4">
            <div className="min-w-0">
              <div className="font-semibold text-zinc-900">{d.name}</div>
              <div className="truncate text-xs text-zinc-500">{d.email}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-600">${d.total}</div>
              <div className="text-xs text-zinc-500">{d.count} donation(s)</div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Donor</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Donations</th>
              <th className="px-5 py-3 text-right">Total Donated</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={i} className="border-t border-zinc-100">
                <td className="px-5 py-4 font-medium text-zinc-900">{d.name}</td>
                <td className="px-5 py-4 text-zinc-600">{d.email}</td>
                <td className="px-5 py-4 text-zinc-700">{d.count}</td>
                <td className="px-5 py-4 text-right font-semibold text-emerald-600">${d.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- shared ---------- */
function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="truncate font-medium text-zinc-700">{value}</dd>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const color =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "amber"
      ? "text-amber-600"
      : "text-zinc-900";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className={`mt-2 text-xl font-bold sm:text-2xl ${color}`}>{value}</div>
    </div>
  );
}
