import { useEffect, useState } from "react";
import FeeBreakdown, { calculateFees } from "./FeeBreakdown";

const DONATION_TYPES = [
  { id: "sadaqah", emoji: "🤲", name: "Sadaqah", desc: "Voluntary charity", group: "islamic" },
  { id: "sadaqah-jariyah", emoji: "🌱", name: "Sadaqah Jariyah", desc: "Ongoing impact", group: "islamic" },
  { id: "fitrana", emoji: "🌙", name: "Fitrana", desc: "$10 per family member", group: "islamic" },
  { id: "waqf", emoji: "🏛️", name: "Waqf", desc: "Permanent endowment", group: "islamic" },
  { id: "one-time", emoji: "💳", name: "One-Time", desc: "Single donation", group: "general" },
  { id: "monthly", emoji: "🔄", name: "Monthly", desc: "Auto recurring", group: "general" },
  { id: "campaign", emoji: "🎯", name: "Campaign", desc: "Specific goal", group: "general" },
  { id: "emergency", emoji: "🆘", name: "Emergency", desc: "Urgent relief", group: "general" },
];

const CAUSES = [
  "Food & Water", "Education", "Medical Aid", "Orphan Care",
  "Masjid Building", "Disaster Relief", "Climate & Environment",
  "Clean Water", "Children Education", "Hunger Crisis",
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 500];

const PAYMENT_METHODS = [
  { id: "stripe", emoji: "💳", label: "Card", desc: "Stripe → USDT" },
  { id: "polygon", emoji: "⛓️", label: "Polygon", desc: "MetaMask · ~$0.01 gas" },
  { id: "ethereum", emoji: "🔷", label: "Ethereum", desc: "MetaMask · variable gas" },
];

const STEPS = ["Type", "Amount", "Payment", "Confirm"];

export default function DonationModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(null);
  const [cause, setCause] = useState(null);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("polygon");

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setType(null);
    setCause(null);
    setAmount(50);
    setCustomAmount("");
    setMethod("polygon");
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const canNext =
    (step === 0 && type && cause) ||
    (step === 1 && finalAmount > 0) ||
    (step === 2 && method) ||
    step === 3;

  function handleNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  }

  function handleSubmit() {
    // TODO: wire to backend + Stripe/MetaMask
    console.log("DONATE", { type, cause, amount: finalAmount, method });
    alert(`Donation submitted (mock):\n${type} → ${cause}\n$${finalAmount} via ${method}`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Header step={step} onClose={onClose} />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && (
            <StepType
              type={type}
              setType={setType}
              cause={cause}
              setCause={setCause}
            />
          )}
          {step === 1 && (
            <StepAmount
              amount={amount}
              setAmount={setAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
            />
          )}
          {step === 2 && (
            <StepPayment
              method={method}
              setMethod={setMethod}
              amount={finalAmount}
            />
          )}
          {step === 3 && (
            <StepConfirm
              type={type}
              cause={cause}
              amount={finalAmount}
              method={method}
            />
          )}
        </div>
        <Footer
          step={step}
          canNext={canNext}
          onBack={() => setStep(Math.max(0, step - 1))}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

function Header({ step, onClose }) {
  return (
    <div className="border-b border-zinc-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">New Donation</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium ${i <= step ? "text-zinc-900" : "text-zinc-400"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${i < step ? "bg-emerald-600" : "bg-zinc-200"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer({ step, canNext, onBack, onNext }) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:border-zinc-400"
      >
        Back
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {step === STEPS.length - 1 ? "Donate Now" : "Continue →"}
      </button>
    </div>
  );
}

function StepType({ type, setType, cause, setCause }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">Donation Type</h3>
        <p className="text-xs text-zinc-500">Choose what kind of donation you want to give.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DONATION_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`rounded-xl border p-3 text-left transition ${
                type === t.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="text-xl">{t.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">{t.name}</div>
              <div className="text-xs text-zinc-500">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-900">Cause</h3>
        <p className="text-xs text-zinc-500">Where should your donation go?</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CAUSES.map((c) => (
            <button
              key={c}
              onClick={() => setCause(c)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                cause === c
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepAmount({ amount, setAmount, customAmount, setCustomAmount }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">Amount (USD)</h3>
      <p className="text-xs text-zinc-500">Pick a preset or enter a custom amount.</p>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAmount(a);
              setCustomAmount("");
            }}
            className={`rounded-lg border py-3 text-sm font-semibold transition ${
              !customAmount && amount === a
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-zinc-700">Custom amount</label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-lg border border-zinc-300 py-2 pl-7 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>
    </div>
  );
}

function StepPayment({ method, setMethod, amount }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">Payment Method</h3>
        <p className="text-xs text-zinc-500">All methods settle in USDT (stable, Shariah compliant — no Gharar).</p>
        <div className="mt-3 space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                method === m.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">{m.label}</div>
                <div className="text-xs text-zinc-500">{m.desc}</div>
              </div>
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  method === m.id ? "border-emerald-600 bg-emerald-600" : "border-zinc-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <FeeBreakdown amount={amount} method={method} />
    </div>
  );
}

function StepConfirm({ type, cause, amount, method }) {
  const typeLabel = DONATION_TYPES.find((t) => t.id === type)?.name || type;
  const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label || method;
  const { total } = calculateFees(amount, method);

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">Review your donation</h3>
      <p className="text-xs text-zinc-500">Verify everything before confirming on-chain.</p>

      <dl className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        <Summary label="Type" value={typeLabel} />
        <Summary label="Cause" value={cause} />
        <Summary label="Amount" value={`$${amount.toFixed(2)}`} />
        <Summary label="Payment" value={methodLabel} />
        <Summary label="Total charge" value={`$${total.toFixed(2)}`} highlight />
      </dl>

      <p className="mt-4 text-xs text-zinc-500">
        By clicking <strong>Donate Now</strong>, your donation enters <strong>Stage 1: Pending</strong> and
        you'll get an email at every step.
      </p>
    </div>
  );
}

function Summary({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={`tabular-nums ${highlight ? "font-bold text-emerald-700" : "font-medium text-zinc-900"}`}>
        {value || "—"}
      </dd>
    </div>
  );
}
