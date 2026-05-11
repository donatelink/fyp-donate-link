import Head from "next/head";
import Link from "next/link";

const ISLAMIC_CAUSES = [
  { emoji: "🍚", name: "Food & Water", goal: 5000, progress: 72 },
  { emoji: "📚", name: "Education", goal: 3000, progress: 91 },
  { emoji: "🏥", name: "Medical Aid", goal: 20000, progress: 45 },
  { emoji: "👶", name: "Orphan Care", goal: 4000, progress: 30 },
  { emoji: "🕌", name: "Masjid Building", goal: 20000, progress: 60 },
  { emoji: "⛑️", name: "Disaster Relief", goal: 40000, progress: 55 },
];

const GLOBAL_CAUSES = [
  { emoji: "🌱", name: "Climate & Environment", goal: 50000, progress: 28 },
  { emoji: "💧", name: "Clean Water & Sanitation", goal: 30000, progress: 41 },
  { emoji: "🎓", name: "Children Education", goal: 25000, progress: 63 },
  { emoji: "🌾", name: "Hunger & Food Crisis", goal: 45000, progress: 37 },
  { emoji: "💉", name: "Medical & Healthcare", goal: 60000, progress: 52 },
  { emoji: "🆘", name: "Disaster Relief (Global)", goal: 100000, progress: 44 },
];

const STAGES = [
  { num: 1, emoji: "⏳", title: "Pending", desc: "Donation initiated by donor" },
  { num: 2, emoji: "✅", title: "Confirmed", desc: "Transaction hash on blockchain" },
  { num: 3, emoji: "📋", title: "Allocated", desc: "Admin assigns to verified cause" },
  { num: 4, emoji: "💸", title: "Transferred", desc: "Funds sent to beneficiary" },
  { num: 5, emoji: "🌟", title: "Completed", desc: "Impact proof uploaded" },
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
          <a href="#causes" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Causes</a>
          <a href="#how" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">How It Works</a>
          <a href="#trust" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Trust</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
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
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <span>⛓️</span>
            <span>Powered by Polygon + Ethereum</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Do Good. <span className="text-emerald-600">On Chain.</span> With Trust.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 sm:text-xl">
            The world's first transparent donation platform built on blockchain.
            Track every dollar from donor to beneficiary across <strong>5 verified stages</strong> — open to all
            faiths, all nations, all people.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Donate Now
            </Link>
            <a
              href="#how"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-semibold text-zinc-700 hover:border-zinc-400"
            >
              How It Works →
            </a>
          </div>
          <p className="mt-8 text-sm italic text-zinc-500">
            "The example of those who spend their wealth in the way of Allah is like a seed that grows seven spikes..."
            <span className="block not-italic">— Quran 2:261</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { label: "Shariah Compliant", value: "AAOIFI 62", emoji: "🕌" },
    { label: "Open to Everyone", value: "All Faiths", emoji: "🌍" },
    { label: "Average Gas Fee", value: "~$0.01", emoji: "⛽" },
    { label: "Verification Stages", value: "5 Live", emoji: "✅" },
  ];
  return (
    <section id="trust" className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl">{item.emoji}</div>
            <div className="mt-2 text-lg font-bold text-zinc-900">{item.value}</div>
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
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          5 Stages. Fully Verified.
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Every donation passes through 5 transparent stages on-chain. Email notifications at each step.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-5">
        {STAGES.map((s) => (
          <div
            key={s.num}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Stage {s.num}
              </span>
            </div>
            <div className="text-3xl">{s.emoji}</div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900">{s.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CauseCard({ cause }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-3xl">{cause.emoji}</span>
        <span className="text-xs font-semibold text-zinc-500">${cause.goal.toLocaleString()} goal</span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-zinc-900">{cause.name}</h3>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${cause.progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
        <span>{cause.progress}% funded</span>
        <Link href="/auth/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
          Donate →
        </Link>
      </div>
    </div>
  );
}

function Causes() {
  return (
    <section id="causes" className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Choose Your Cause
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            From Islamic causes (Sadaqah, Zakat, Waqf) to global initiatives — every donation makes impact.
          </p>
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <h3 className="text-xl font-bold text-zinc-900">Islamic Causes</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ISLAMIC_CAUSES.map((c) => <CauseCard key={c.name} cause={c} />)}
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <h3 className="text-xl font-bold text-zinc-900">Global Causes</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOBAL_CAUSES.map((c) => <CauseCard key={c.name} cause={c} />)}
          </div>
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
          <p className="text-sm text-zinc-500">
            Iqra University · Final Year Project · Batch 2026
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">
          Built with ❤️ by Hasnain Sher Ayoub · Syed Saqlain · Usman Ali
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>DonateLink — Transparent Blockchain Donations</title>
        <meta
          name="description"
          content="Blockchain-based donation platform. Do Good. On Chain. With Trust. Open to everyone."
        />
      </Head>
      <div className="min-h-screen bg-white text-zinc-900">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <HowItWorks />
          <Causes />
        </main>
        <Footer />
      </div>
    </>
  );
}
