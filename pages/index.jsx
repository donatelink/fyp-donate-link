import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Baby,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  Globe,
  GraduationCap,
  HandHeart,
  Hash,
  Heart,
  Link2,
  Lock,
  Quote as QuoteIcon,
  Repeat,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Utensils,
} from "lucide-react";

const STAGES = [
  { num: 1, Icon: Clock, title: "Pending", desc: "Donation initiated by the donor" },
  { num: 2, Icon: CheckCircle2, title: "Confirmed", desc: "NGO confirms receipt — anchored on-chain" },
  { num: 3, Icon: FileText, title: "Allocated", desc: "Funds assigned to a verified cause" },
  { num: 4, Icon: Send, title: "Transferred", desc: "Money reaches the beneficiary" },
  { num: 5, Icon: Award, title: "Completed", desc: "Proof of impact uploaded" },
];

const ROLES = [
  {
    Icon: Heart,
    title: "Donors",
    points: [
      "Browse verified NGOs with logos, ratings & reviews",
      "Pay via Stripe (card) or MetaMask (Polygon / Ethereum)",
      "Track every donation across all 5 stages with proof",
      "Rate the NGOs you've supported and share reviews",
    ],
  },
  {
    Icon: HandHeart,
    title: "Beneficiaries",
    points: [
      "Sign up free, browse NGOs by category and rating",
      "Submit one funding request per month with your story",
      "NGO verifies your request and contacts you directly",
      "Follow your payout through the same 5-stage lifecycle",
    ],
  },
  {
    Icon: Building2,
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
    Icon: Link2,
    title: "Blockchain transparency",
    body: "Every stage of every donation is anchored on Polygon — anyone can verify the chain of custody from donor to beneficiary.",
  },
  {
    Icon: Camera,
    title: "Proof at every step",
    body: "NGOs upload a photo, receipt or PDF at each of the 5 stages — donors and beneficiaries see receipts, not promises.",
  },
  {
    Icon: Star,
    title: "Ratings & reviews",
    body: "Only people who've actually transacted can rate. Top-rated organizations earn a verified badge across the platform.",
  },
  {
    Icon: Globe,
    title: "Open to all",
    body: "Islamic causes (Zakat · Sadaqah · Waqf) and global causes (food, water, education, medical) — every faith, every nation.",
  },
];

const CAUSES = [
  { name: "Food & Water", raised: "$3,600", pct: 72, accent: "emerald", tag: "Sadaqah", Icon: Utensils },
  { name: "Orphan Care", raised: "$1,200", pct: 30, accent: "amber", tag: "Zakat", Icon: Baby },
  { name: "Education", raised: "$2,730", pct: 91, accent: "emerald", tag: "Sadaqah", Icon: GraduationCap },
  { name: "Medical Aid", raised: "$9,000", pct: 45, accent: "amber", tag: "Urgent", Icon: Stethoscope },
];

const VOICES = [
  {
    quote: "I finally know my Zakat actually arrived. The photo update made my week.",
    who: "Ayesha",
    role: "Donor",
  },
  {
    quote: "Setting up our NGO took an afternoon. Donors trust us more once they see the proofs going live.",
    who: "Hope Foundation",
    role: "NGO",
  },
  {
    quote: "I needed help with my rent and didn't know where to ask. The NGO replied within a day.",
    who: "Khalid",
    role: "Beneficiary",
  },
];

const TRUST = [
  { Icon: Repeat, value: "5-Stage", label: "Verified Lifecycle" },
  { Icon: Link2, value: "On-Chain", label: "Polygon Anchored" },
  { Icon: Globe, value: "All Faiths", label: "Open Platform" },
  { Icon: ShieldCheck, value: "AAOIFI 62", label: "Shariah Compliant" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <img
        src="/donatelink-logo.png"
        alt="DonateLink"
        className="h-9 w-auto"
      />
    </Link>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900">
            How it works
          </a>
          <a href="#features" className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900">
            Features
          </a>
          <a href="#causes" className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900">
            Causes
          </a>
          <a href="#chain" className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900">
            On-chain
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-zinc-700 transition hover:text-zinc-900"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Get Started
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pb-32 lg:pt-24">
        <div className="animate-page-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <Sparkles size={13} strokeWidth={2.5} /> Blockchain-verified · 5-stage lifecycle
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl">
            Give once.
            <br />
            Follow it the
            <br />
            <span className="text-emerald-600">whole way home.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Most donations vanish into a black box. DonateLink keeps the receipt — every stage,
            from your hands to the family who needed it, recorded on-chain and shown back to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99]"
            >
              Start giving <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-white px-7 py-3.5 text-base font-bold text-emerald-800 transition hover:border-emerald-300"
            >
              How it works
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Built for Zakat, Sadaqah &amp; Waqf — and open to every faith and nation.
          </p>
        </div>

        <div className="relative animate-page-in">
          <div className="rounded-3xl bg-emerald-600 p-7 text-white shadow-2xl">
            <p className="text-sm font-semibold text-emerald-200">This month, together</p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight">$48,260</p>
            <p className="mt-1 text-sm text-emerald-100">raised across 12 verified causes</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[Utensils, Droplets, GraduationCap, Stethoscope, Baby].map((Ic, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600 ring-2 ring-emerald-600"
                  >
                    <Ic size={16} strokeWidth={2.5} />
                  </span>
                ))}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900 ring-2 ring-emerald-600">
                  +9
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 w-56 rotate-[-4deg] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-amber-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} strokeWidth={2.5} /> Proof received
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              "School supplies delivered to 14 kids."
            </p>
          </div>

          <div className="absolute -right-3 -top-3 w-48 rotate-[4deg] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-emerald-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Donation #4193
            </p>
            <p className="mt-1 text-lg font-bold text-zinc-900">$120.00</p>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <Send size={12} strokeWidth={2.5} /> Stage 4 · Transferred
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {TRUST.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <Icon size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <div className="text-base font-extrabold leading-tight text-zinc-900">{value}</div>
              <div className="text-[11px] uppercase tracking-widest text-zinc-500">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
          <Repeat size={12} strokeWidth={2.5} /> Lifecycle
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          5 Stages. Fully Verified.
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Every donation passes through 5 transparent stages on-chain — with proof at every step.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-5">
        {STAGES.map((s) => {
          const I = s.Icon;
          return (
            <div
              key={s.num}
              className="card-hover relative rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <span className="absolute right-4 top-4 text-xs font-bold text-zinc-300">
                {String(s.num).padStart(2, "0")}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <I size={20} strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 text-base font-bold text-zinc-900">{s.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            <Sparkles size={12} strokeWidth={2.5} /> One platform · three sides
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Built for everyone in the chain of giving
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Donors give, beneficiaries request, NGOs run the work. Everyone sees the same proof.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => {
            const I = r.Icon;
            return (
              <div
                key={r.title}
                className="card-hover rounded-3xl border border-zinc-200 bg-white p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <I size={22} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-zinc-900">{r.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
          <ShieldCheck size={12} strokeWidth={2.5} /> Why we're different
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Trust, by design
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Built on blockchain, verified by proof, open to everyone.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const I = f.Icon;
          return (
            <div key={f.title} className="card-hover rounded-3xl border border-zinc-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <I size={22} strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Blockchain() {
  const rows = [
    { stage: "Pending", hash: "0x9a4f…3b21", status: "verified" },
    { stage: "Confirmed", hash: "0xb2c1…7d8e", status: "verified" },
    { stage: "Allocated", hash: "0xfe71…0a99", status: "verified" },
    { stage: "Transferred", hash: "0x3c08…ad22", status: "verified" },
    { stage: "Completed", hash: "—", status: "pending" },
  ];
  return (
    <section id="chain" className="bg-emerald-950">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <Link2 size={13} strokeWidth={2.5} /> On-chain transparency
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Every step,<br />
            written to <span className="text-amber-400">the blockchain.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-emerald-100/80">
            Donations are anchored on Polygon (cents in gas, no environmental cost) and Ethereum.
            Every stage transition produces a transaction hash you can verify yourself — in any
            block explorer, outside our platform.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-emerald-100">
            <li className="flex items-start gap-3">
              <Lock size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-amber-400" />
              <span>USDT stablecoin — no Gharar, fully Shariah-compliant</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-amber-400" />
              <span>Public chain — anyone can audit any donation, any time</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-amber-400" />
              <span>~$0.01 gas on Polygon — negligible cost per transaction</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-emerald-800 bg-emerald-900/30 p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-3 font-mono text-xs">
            <span className="flex items-center gap-2 text-emerald-300">
              <Hash size={14} strokeWidth={2.4} />
              Donation #4193 · audit trail
            </span>
            <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
              VERIFIED
            </span>
          </div>
          <div className="mt-4 space-y-3 font-mono text-xs">
            {rows.map((r) => (
              <div key={r.stage} className="flex items-center justify-between">
                <span className="text-emerald-200">{r.stage}</span>
                <span className="text-emerald-400">{r.hash}</span>
                <span
                  className={
                    r.status === "verified"
                      ? "flex items-center gap-1 font-bold text-emerald-300"
                      : "text-emerald-600"
                  }
                >
                  {r.status === "verified" ? (
                    <>
                      <CheckCircle2 size={12} strokeWidth={2.5} /> ok
                    </>
                  ) : (
                    "…"
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-emerald-800 pt-3 font-mono text-[10px] text-emerald-400">
            polygon mainnet · block 51,209,448
          </p>
        </div>
      </div>
    </section>
  );
}

function Causes() {
  return (
    <section id="causes" className="bg-amber-50/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Heart size={12} strokeWidth={2.5} /> Live causes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              Causes open right now
            </h2>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 underline-offset-4 hover:underline"
          >
            Browse all <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAUSES.map((c) => {
            const I = c.Icon;
            const bar = c.accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
            const iconBg = c.accent === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
            return (
              <div
                key={c.name}
                className="card-hover rounded-3xl bg-white p-6 ring-1 ring-emerald-100"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
                    <I size={20} strokeWidth={2.2} />
                  </span>
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                    {c.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-emerald-950">{c.name}</h3>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-50">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: `${c.pct}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-900/70">{c.raised} raised</span>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-0.5 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Give <ChevronRight size={14} strokeWidth={2.5} />
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
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Real people, real proof
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VOICES.map((v) => (
            <div
              key={v.who}
              className="card-hover rounded-3xl bg-emerald-600 p-7 text-white shadow-sm"
            >
              <QuoteIcon size={28} strokeWidth={2.2} className="text-emerald-300" />
              <p className="mt-3 text-base leading-relaxed">{v.quote}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-emerald-200">
                <span>{v.who}</span>
                <span className="rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] uppercase tracking-widest">
                  {v.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quran() {
  return (
    <section className="bg-emerald-700">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <QuoteIcon size={32} strokeWidth={2.2} className="mx-auto text-emerald-300" />
        <p className="mt-5 text-2xl font-semibold leading-relaxed text-emerald-50 sm:text-3xl">
          The example of those who spend their wealth in the way of Allah is like a seed that
          grows seven spikes — in each spike a hundred grains.
        </p>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
          Quran 2:261
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-amber-50">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-emerald-950 sm:text-5xl">
          Ready to give — the transparent way?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-emerald-900/70">
          Two minutes to your first donation. Watch it land. See the proof. Trust the rest.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            Get started — it's free <ArrowRight size={16} strokeWidth={2.5} />
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
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-zinc-600">
            <a href="#how" className="hover:text-zinc-900">How it works</a>
            <a href="#features" className="hover:text-zinc-900">Features</a>
            <a href="#chain" className="hover:text-zinc-900">On-chain</a>
            <a href="#causes" className="hover:text-zinc-900">Causes</a>
            <Link href="/auth/login" className="hover:text-zinc-900">Sign in</Link>
          </div>
          <p className="text-sm text-zinc-500">Iqra University · FYP 2026</p>
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
          content="A transparent donation platform built on blockchain. Track every donation across 5 verified stages with proof. Open to all faiths and nations."
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
          <Quran />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
