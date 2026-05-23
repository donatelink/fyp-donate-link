import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import CountrySelect from "@/components/CountrySelect";
import PasswordInput from "@/components/PasswordInput";
import PhoneInput from "@/components/PhoneInput";
import supabase from "@/utils/supabase";

const ROLES = [
  { value: "donor", label: "Donor", desc: "Give to causes worldwide" },
  { value: "ngo", label: "NGO", desc: "Receive verified funds" },
  { value: "beneficiary", label: "Beneficiary", desc: "Request help from an NGO" },
  { value: "admin", label: "Admin", desc: "Manage donation lifecycle" },
];

const pillInput =
  "mt-1 w-full rounded-full border border-zinc-300 px-5 py-3 text-sm text-black focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    orgName: "",
    regNumber: "",
    contactPerson: "",
    phone: "",
    country: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [applied, setApplied] = useState(false);

  const isNgo = form.role === "ngo";

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (isNgo) {
      const { error: insertError } = await supabase.from("ngos").insert({
        user_id: null,
        org_name: form.orgName,
        reg_number: form.regNumber,
        contact_person: form.contactPerson,
        phone: form.phone,
        email: form.email,
        country: form.country,
        website: form.website || null,
        category: "General",
        description: form.description,
      });

      if (insertError) {
        setErrorMsg(insertError.message);
        setLoading(false);
        return;
      }

      setApplied(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, role: form.role },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setErrorMsg(
        "Account created — please check your email to confirm before signing in."
      );
      setLoading(false);
      return;
    }

    const dest =
      form.role === "admin"
        ? "/admin/dashboard"
        : form.role === "beneficiary"
        ? "/beneficiary/dashboard"
        : "/donor/dashboard";
    router.push(dest);
  }

  return (
    <AuthLayout
      title="Create Account"
      imageUrl="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&h=1200&fit=crop&q=80&auto=format"
      imageGradient="from-blue-950 via-blue-800 to-indigo-700"
      outerGradient="from-blue-100 via-white to-indigo-50"
      tagline={{ eyebrow: "Join DonateLink", line: "Give, receive, and trace every step of the impact." }}
    >
      <Link
        href="/"
        aria-label="Back to home"
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="mt-6">
        {applied ? (
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✅
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Application submitted
            </h1>
            <p className="mt-3 text-sm text-zinc-600">
              Thanks for applying. Our team will review{" "}
              <span className="font-semibold text-zinc-900">{form.orgName}</span>. Once approved,
              you'll get an email to set your password and access your NGO dashboard.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block w-full rounded-full bg-zinc-900 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Create an Account</h1>
            <p className="mt-3 text-sm text-zinc-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-zinc-900 underline underline-offset-4">
                Log in
              </Link>
            </p>

            {errorMsg && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-900">I am a...</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update("role", r.value)}
                      className={`rounded-2xl border px-3 py-2.5 text-left text-xs transition ${
                        form.role === r.value
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <div className="font-semibold">{r.label}</div>
                      <div className={form.role === r.value ? "text-white/70" : "text-zinc-500"}>
                        {r.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {isNgo ? (
                <>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700">
                    NGO applications are verified by an admin. Once approved, we email you a link
                    to set your password — no password needed now.
                  </div>

                  <div>
                    <label htmlFor="orgName" className="block text-sm font-semibold text-zinc-900">
                      Organization Name
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      required
                      value={form.orgName}
                      onChange={(e) => update("orgName", e.target.value)}
                      className={pillInput}
                      placeholder="e.g. Helping Hands Foundation"
                    />
                  </div>

                  <div>
                    <label htmlFor="regNumber" className="block text-sm font-semibold text-zinc-900">
                      Registration / License Number
                    </label>
                    <input
                      id="regNumber"
                      type="text"
                      required
                      value={form.regNumber}
                      onChange={(e) => update("regNumber", e.target.value)}
                      className={pillInput}
                      placeholder="Official NGO registration no."
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-semibold text-zinc-900">
                      Contact Person
                    </label>
                    <input
                      id="contactPerson"
                      type="text"
                      required
                      value={form.contactPerson}
                      onChange={(e) => update("contactPerson", e.target.value)}
                      className={pillInput}
                      placeholder="Full name of representative"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-zinc-900">
                      Phone Number
                    </label>
                    <PhoneInput
                      id="phone"
                      required
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-zinc-900">
                      Country
                    </label>
                    <CountrySelect
                      id="country"
                      required
                      value={form.country}
                      onChange={(v) => update("country", v)}
                      className="rounded-full px-5 py-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-zinc-900">
                      Website <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      className={pillInput}
                      placeholder="https://example.org"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-zinc-900">
                      About the Organization
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      className="mt-1 w-full rounded-3xl border border-zinc-300 px-5 py-3 text-sm text-black focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                      placeholder="Briefly describe your mission and the work you do."
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-zinc-900">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={pillInput}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-900">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={pillInput}
                  placeholder="you@example.com"
                />
              </div>

              {!isNgo && (
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-zinc-900">
                    Password
                  </label>
                  <PasswordInput
                    id="password"
                    variant="pill"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 characters"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white hover:enabled:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? isNgo
                    ? "Submitting..."
                    : "Creating account..."
                  : isNgo
                  ? "Submit NGO Form"
                  : "Create Account"}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
