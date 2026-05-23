import Head from "next/head";
import Link from "next/link";

const STAGES = [
  { num: 1, emoji: "⏳", title: "Pending", desc: "Donation initiated by the donor" },
  { num: 2, emoji: "✅", title: "Confirmed", desc: "NGO confirms receipt — blockchain-logged" },
  { num: 3, emoji: "📋", title: "Allocated", desc: "Funds assigned to a verified cause" },
  { num: 4, emoji: "💸", title: "Transferred", desc: "Money reaches the beneficiary" },
  { num: 5, emoji: "🌟", title: "Completed", desc: "Proof of impact uploaded" },
];

const ROLES = [
  {
    emoji: "❤️",
    title: "Donors",
    points: [
      "Browse verified NGOs with logos, ratings & reviews",
      "Donate via Stripe (card) or MetaMask (Polygon/Ethereum)",
      "Track every donation across all 5 stages with proof",
      "Rate the NGOs you've supported & share reviews",
    ],
  },
  {
    emoji: "🤝",
    title: "Beneficiaries",
    points: [
      "Sign up free, browse NGOs by category and rating",
      "Submit one funding request per month with your story",
      "NGO verifies your request and contacts you directly",
      "Follow your payout through the same 5-stage lifecycle",
    ],
  },
  {
    emoji: "🏛️",
    title: "NGOs",
    points: [
      "Apply with your registration — verified by our admin",
      "Get a public donation page with your branded logo",
      "Advance each donation stage and upload proof",
      "Review beneficiary requests and disburse funds",
    ],
  },
];

const FEATURES = [
  {
    emoji: "⛓️",
    title: "Blockchain transparency",
    body: "Every stage of every donation is anchored on Polygon — anyone can verify the chain of custody from donor to beneficiary.",
  },
  {
    emoji: "📷",
    title: "Proof at every step",
    body: "NGOs upload a photo, receipt or PDF at each of the 5 stages — donors and beneficiaries see receipts, not promises.",
  },
  {
    emoji: "⭐",
    title: "Ratings & reviews",
    body: "Only donors and beneficiaries who've actually transacted can rate an NGO. Top-rated organizations earn a badge.",
  },
  {
    emoji: "🌍",
    title: "Open to all",
    body: "Islamic causes (Zakat · Sadaqah · Waqf) and global causes (food, water, education, medical) — every faith, every nation.",
  },
];

const CAUSES = [
  { name: "Food & Water", raised: "$3,600", pct: 72, accent: "emerald", tag: "Sadaqah" },
  { name: "Orphan Care", raised: "$1,200", pct: 30, accent: "amber", tag: "Zakat" },
  { name: "Education", raised: "$2,730", pct: 91, accent: "emerald", tag: "Sadaqah" },
  { name: "Medical Aid", raised: "$9,000", pct: 45, accent: "amber", tag: "Urgent" },
];

const VOICES = [
  {
    quote: "I finally know my Zakat actually arrived. The photo update made my week.",
    who: "Ayesha · donor",
  },
  {
    quote: "Setting up our NGO took an afternoon. Donors trust us more once they see the proofs going live.",
    who: "Hope Foundation",
  },
  {
    quote: "I needed help with my rent and didn't know where to ask. The NGO replied within a day.",
    who: "Khalid · beneficiary",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <span className="text-2xl">🌍</span>
          <span>DonateLink</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            How it works
          </a>
          <a href="#features" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            Features
          </a>
          <a href="#causes" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            Causes
          </a>
          <a href="#trust" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            Trust
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-page-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <span>⛓️</span> Blockchain-verified · 5-stage lifecycle
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl">
            Give once.
            <br />
            Follow it the <span className="text-emerald-600">whole way home.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Most donations vanish into a black box. DonateLink keeps the receipt — every stage,
            from your hands to the family who needed it, recorded on-chain and shown back to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="rounded-full bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99]"
            >
              Start giving
            </Link>
            <a
              href="#how"
              className="rounded-full border-2 border-emerald-200 bg-white px-7 py-3.5 text-base font-bold text-emerald-800 transition hover:border-emerald-300"
            >
              How it works
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Built for Zakat, Sadaqah &amp; Waqf — and open to every faith and nation.
          </p>
        </div>

        <div className="relative animate-page-in">
          <div className="rounded-3xl bg-emerald-600 p-7 text-white shadow-xl">
            <p className="text-sm font-semibold text-emerald-200">This month, together</p>
            <p className="mt-1 text-4xl font-extrabold">$48,260</p>
            <p className="mt-1 text-sm text-emerald-100">raised across 12 verified causes</p>
            <div className="mt-5 flex -space-x-2">
              {["🌷", "☀️", "🌿", "💧", "📚"].map((e, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg ring-2 ring-emerald-600"
                >
                  {e}
                </span>
              ))}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900 ring-2 ring-emerald-600">
                +9
              </span>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 w-52 rotate-[-4deg] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-amber-100">
            <p className="text-xs font-semibold text-emerald-700">✓ Proof received</p>
            <p className="mt-1 text-xs text-zinc-600">
              &ldquo;School supplies delivered to 14 kids.&rdquo;
            </p>
          </div>

          <div className="absolute -right-3 -top-3 w-44 rotate-[4deg] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-emerald-100">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">Donation #4193</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">$120.00</p>
            <p className="mt-1 text-xs text-emerald-700">Stage 4 of 5 · Transferred</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { value: "5", label: "Stage Lifecycle", emoji: "🔁" },
    { value: "On-Chain", label: "Polygon Verified", emoji: "⛓️" },
    { value: "All Faiths", label: "Open Platform", emoji: "🌍" },
    { value: "AAOIFI 62", label: "Shariah Compliant", emoji: "🕌" },
  ];
  return (
    <section id="trust" className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl">{item.emoji}</div>
            <div className="mt-2 text-lg font-extrabold text-zinc-900">{item.value}</div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          5 Stages. Fully Verified.
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Every donation passes through 5 transparent stages on-chain — with proof at every step.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-5">
        {STAGES.map((s) => (
          <div
            key={s.num}
            className="card-hover rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              Stage {s.num}
            </span>
            <div className="mt-3 text-3xl">{s.emoji}</div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900">{s.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            One platform · three sides
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Donors give, beneficiaries request, NGOs run the work. Everyone sees the same proof.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.title}
              className="card-hover rounded-3xl border border-zinc-200 bg-white p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                {r.emoji}
              </div>
              <h3 className="mt-4 text-xl font-bold text-zinc-900">{r.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Why DonateLink is different
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Built on blockchain, designed for trust, and open to everyone.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="card-hover rounded-3xl border border-zinc-200 bg-white p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
              {f.emoji}
            </div>
            <h3 className="mt-4 text-xl font-bold text-zinc-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Blockchain() {
  return (
    <section className="bg-emerald-950">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            ⛓️ On-chain transparency
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Every step,<br />
            written to <span className="text-amber-400">the blockchain.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-emerald-100/80">
            Donations are anchored on Polygon (cents in gas, no greenhouse cost) and Ethereum.
            Every stage transition produces a transaction hash you can verify yourself — outside our
            platform, in any block explorer.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-emerald-100">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">◆</span>
              <span>USDT stablecoin · no Gharar, fully Shariah-compliant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">◆</span>
              <span>Public chain · anyone can audit any donation, any time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">◆</span>
              <span>~$0.01 gas on Polygon · negligible cost per transaction</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-emerald-800 bg-emerald-900/30 p-6 font-mono text-xs text-emerald-100 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
            <span className="text-emerald-300">Donation #4193 · audit trail</span>
            <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
              VERIFIED
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { stage: "Pending", hash: "0x9a4f…3b21", status: "✓" },
              { stage: "Confirmed", hash: "0xb2c1…7d8e", status: "✓" },
              { stage: "Allocated", hash: "0xfe71…0a99", status: "✓" },
              { stage: "Transferred", hash: "0x3c08…ad22", status: "✓" },
              { stage: "Completed", hash: "—", status: "…" },
            ].map((r) => (
              <div key={r.stage} className="flex items-center justify-between">
                <span className="text-emerald-200">{r.stage}</span>
                <span className="text-emerald-400">{r.hash}</span>
                <span
                  className={
                    r.status === "✓" ? "text-emerald-300 font-bold" : "text-emerald-600"
                  }
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-emerald-800 pt-3 text-[10px] text-emerald-400">
            polygon mainnet · block 51,209,448
          </p>
        </div>
      </div>
    </section>
  );
}

function Causes() {
  return (
    <section id="causes" className="bg-amber-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Causes open right now
          </h2>
          <Link
            href="/auth/register"
            className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline"
          >
            Browse all causes →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAUSES.map((c) => {
            const bar = c.accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div
                key={c.name}
                className="card-hover rounded-3xl bg-white p-6 ring-1 ring-emerald-100"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    {c.tag}
                  </span>
                  <span className="text-xs text-zinc-400">{c.pct}% funded</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-emerald-950">{c.name}</h3>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-50">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: `${c.pct}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-900/70">{c.raised} raised</span>
                  <Link
                    href="/auth/register"
                    className="font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Give →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Real people, real proof
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VOICES.map((v) => (
            <div key={v.who} className="rounded-3xl bg-emerald-600 p-7 text-white shadow-sm">
              <p className="text-base leading-relaxed">&ldquo;{v.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-emerald-200">{v.who}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="bg-emerald-700">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-2xl font-semibold leading-relaxed text-emerald-50 sm:text-3xl">
          &ldquo;The example of those who spend their wealth in the way of Allah is like a seed that
          grows seven spikes — in each spike a hundred grains.&rdquo;
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-200">
          Quran 2:261
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-amber-50">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-emerald-950">
          Ready to give — the transparent way?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-emerald-900/70">
          Two minutes to your first donation. Watch it land. See the proof. Trust the rest.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/register"
            className="rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            Get started — it's free
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border-2 border-emerald-200 bg-white px-8 py-4 text-base font-bold text-emerald-800 transition hover:border-emerald-300"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <span className="text-xl">🌍</span>
            DonateLink
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-zinc-600">
            <a href="#how" className="hover:text-zinc-900">How it works</a>
            <a href="#features" className="hover:text-zinc-900">Features</a>
            <a href="#causes" className="hover:text-zinc-900">Causes</a>
            <Link href="/auth/login" className="hover:text-zinc-900">Sign in</Link>
          </div>
          <p className="text-sm text-zinc-500">
            Iqra University · FYP 2026
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">
          Built by Hasnain Sher Ayoub · Syed Saqlain · Usman Ali
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>DonateLink — Transparent Donations, On the Blockchain</title>
        <meta
          name="description"
          content="A transparent donation platform built on blockchain. Track every donation across 5 verified stages. Open to all faiths and nations."
        />
      </Head>
      <div className="min-h-screen bg-white text-zinc-900">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <HowItWorks />
          <Roles />
          <Features />
          <Blockchain />
          <Causes />
          <Voices />
          <Quote />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
