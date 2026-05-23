import COUNTRIES, { DEFAULT_DIAL, parsePhone } from "@/utils/countries";

// Unique dial codes (e.g. +1 belongs to US/Canada/DR; pick one entry per dial)
const DIAL_OPTIONS = (() => {
  const seen = new Set();
  const out = [];
  for (const c of COUNTRIES) {
    if (seen.has(c.dial)) continue;
    seen.add(c.dial);
    out.push(c);
  }
  return out.sort((a, b) => Number(a.dial.slice(1)) - Number(b.dial.slice(1)));
})();

const MAX_DIGITS = 11;

export default function PhoneInput({ id, value, onChange, required, placeholder = "3001234567" }) {
  const { dial, number } = parsePhone(value);

  function setDial(newDial) {
    onChange(`${newDial} ${number}`);
  }

  function setNumber(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, MAX_DIGITS);
    onChange(`${dial} ${digits}`);
  }

  return (
    <div className="mt-1 flex gap-2">
      <select
        value={dial}
        onChange={(e) => setDial(e.target.value)}
        aria-label="Country dial code"
        className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        {DIAL_OPTIONS.map((c) => (
          <option key={c.code} value={c.dial}>
            {c.flag} {c.dial}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        required={required}
        maxLength={MAX_DIGITS}
        minLength={required ? MAX_DIGITS : undefined}
        pattern={`\\d{${MAX_DIGITS}}`}
        title={`Enter exactly ${MAX_DIGITS} digits`}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}

function _defaultDial() {
  return DEFAULT_DIAL;
}
