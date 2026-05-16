import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

export default function NgoPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("ngos")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .maybeSingle();
      if (active) {
        setNgo(data || null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <>
      <Head>
        <title>{ngo ? `${ngo.org_name} · DonateLink` : "NGO · DonateLink"}</title>
      </Head>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg">
              <span className="text-xl">🌍</span>
              DonateLink
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {loading && <p className="text-sm text-zinc-500">Loading...</p>}

          {!loading && !ngo && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🔍</div>
              <h1 className="mt-3 text-lg font-bold text-zinc-900">NGO not found</h1>
              <p className="mt-1 text-sm text-zinc-600">
                This link is invalid, or the NGO has not been approved yet.
              </p>
              <Link
                href="/"
                className="mt-5 inline-block rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Back to home
              </Link>
            </div>
          )}

          {!loading && ngo && (
            <>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ Verified by DonateLink
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                    {ngo.category}
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">{ngo.org_name}</h1>
                <p className="mt-1 text-sm text-zinc-500">{ngo.country}</p>

                <p className="mt-4 text-sm leading-relaxed text-zinc-700">{ngo.description}</p>

                <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">Contact Person</dt>
                    <dd className="mt-0.5 text-sm font-medium text-zinc-800">{ngo.contact_person}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">Email</dt>
                    <dd className="mt-0.5 text-sm font-medium text-zinc-800">{ngo.email}</dd>
                  </div>
                  {ngo.website && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-zinc-400">Website</dt>
                      <dd className="mt-0.5 text-sm font-medium">
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {ngo.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <Link
                  href="/auth/login"
                  className="mt-6 block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Donate to {ngo.org_name}
                </Link>
              </div>

              <p className="mt-4 text-center text-xs text-zinc-400">
                Every donation to this NGO is tracked transparently on-chain.
              </p>
            </>
          )}
        </main>
      </div>
    </>
  );
}
