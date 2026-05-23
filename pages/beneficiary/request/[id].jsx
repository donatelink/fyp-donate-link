import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

const STEPS = [
  { key: "pending", emoji: "⏳", title: "Pending review", desc: "Submitted — awaiting NGO verification" },
  { key: "verified", emoji: "✅", title: "Verified", desc: "NGO confirmed your request and will contact you" },
  { key: "funded", emoji: "💸", title: "Funded", desc: "Funds disbursed to you from donor money" },
];

function statusToStep(status) {
  if (status === "funded") return 3;
  if (status === "verified") return 2;
  if (status === "pending") return 1;
  return 0;
}

function isPdf(url) {
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString();
}

export default function TrackRequest() {
  const router = useRouter();
  const { id } = router.query;
  const [request, setRequest] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data: req } = await supabase
        .from("beneficiary_requests")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      let ngoRow = null;
      let donRows = [];
      if (req) {
        const [n, d] = await Promise.all([
          supabase.from("ngos").select("*").eq("id", req.ngo_id).maybeSingle(),
          supabase
            .from("donations")
            .select("id, amount, donor_name, created_at, stage")
            .eq("beneficiary_request_id", req.id),
        ]);
        ngoRow = n.data;
        donRows = d.data || [];
      }
      if (active) {
        setRequest(req || null);
        setNgo(ngoRow);
        setDonations(donRows);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const step = request ? statusToStep(request.status) : 0;
  const rejected = request?.status === "rejected";
  const totalReceived = donations.reduce((s, d) => s + Number(d.amount), 0);

  return (
    <>
      <Head>
        <title>Track Request · DonateLink</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link
              href="/beneficiary/dashboard"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              ← Back to dashboard
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          {loading && <p className="text-sm text-zinc-500">Loading…</p>}

          {!loading && !request && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🔍</div>
              <h1 className="mt-3 text-lg font-bold text-zinc-900">Request not found</h1>
              <p className="mt-1 text-sm text-zinc-600">
                This request doesn't exist or you don't have access to it.
              </p>
            </div>
          )}

          {!loading && request && (
            <>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Request to</p>
                    <h1 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
                      {request.ngo_name}
                    </h1>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      Submitted {fmtDate(request.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Asked for</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">${request.amount}</p>
                  </div>
                </div>
              </div>

              {rejected && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6">
                  <h2 className="text-base font-semibold text-red-800">Request rejected</h2>
                  {request.ngo_note && (
                    <p className="mt-2 text-sm text-red-700">{request.ngo_note}</p>
                  )}
                  <p className="mt-3 text-xs text-red-700">
                    You can submit a new request to a different NGO next month.
                  </p>
                </div>
              )}

              {!rejected && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
                  <h2 className="text-base font-semibold text-zinc-900">Status</h2>
                  <ol className="mt-6 space-y-5">
                    {STEPS.map((s, i) => {
                      const num = i + 1;
                      const reached = num <= step;
                      const current = num === step;
                      return (
                        <li key={s.key} className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                              reached ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"
                            }`}
                          >
                            {s.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`font-semibold ${
                                  reached ? "text-zinc-900" : "text-zinc-400"
                                }`}
                              >
                                {s.title}
                              </h3>
                              {current && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                  Current
                                </span>
                              )}
                            </div>
                            <p
                              className={`mt-0.5 text-sm ${
                                reached ? "text-zinc-600" : "text-zinc-400"
                              }`}
                            >
                              {s.desc}
                            </p>

                            {s.key === "verified" && reached && ngo && (
                              <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                <div className="font-semibold">The NGO will contact you at:</div>
                                <div className="mt-1">{request.beneficiary_email}</div>
                                <div className="mt-2 text-xs">
                                  NGO contact: {ngo.contact_person} · {ngo.phone} · {ngo.email}
                                </div>
                                {request.ngo_note && (
                                  <p className="mt-2 text-sm">Note: {request.ngo_note}</p>
                                )}
                              </div>
                            )}

                            {s.key === "funded" && reached && (
                              <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                <div className="font-semibold">
                                  Total received: ${totalReceived}
                                </div>
                                <div className="mt-1 text-xs">
                                  From {donations.length} donor donation(s).
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
                <h2 className="text-base font-semibold text-zinc-900">Your story</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{request.reason}</p>

                {request.proof_url && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-zinc-500">Attached proof</div>
                    {isPdf(request.proof_url) ? (
                      <a
                        href={request.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline"
                      >
                        📄 View document
                      </a>
                    ) : (
                      <a href={request.proof_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={request.proof_url}
                          alt="Proof"
                          className="mt-2 max-h-56 w-full rounded-lg border border-zinc-200 object-cover"
                        />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
