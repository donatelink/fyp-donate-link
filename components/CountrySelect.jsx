import COUNTRIES from "@/utils/countries";

export default function CountrySelect({ id, value, onChange, required, className = "" }) {
  return (
    <select
      id={id}
      required={required}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${className}`}
    >
      <option value="" disabled>
        Select a country…
      </option>
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.name}>
          {c.flag} {c.name}
        </option>
      ))}
    </select>
  );
}
