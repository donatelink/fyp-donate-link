import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import supabase from "@/utils/supabase";

const ROLES = [
  { value: "donor", label: "Donor", desc: "Give to causes worldwide" },
  { value: "ngo", label: "NGO", desc: "Receive verified funds" },
  { value: "admin", label: "Admin", desc: "Manage donation lifecycle" },
];

const NGO_CATEGORIES = [
  "Education",
  "Health",
  "Relief & Emergency",
  "Food & Water",
  "Orphan Care",
  "Environment",
  "Other",
];

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-black focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

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
    category: "Education",
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
      // NGO applications create no account here — the admin reviews the
      // application, and an account is created (via email invite) on approval.
      const { error: insertError } = await supabase.from("ngos").insert({
        user_id: null,
        org_name: form.orgName,
        reg_number: form.regNumber,
        contact_person: form.contactPerson,
        phone: form.phone,
        email: form.email,
        country: form.country,
        website: form.website || null,
        category: form.category,
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

    // Donor / Admin — standard sign-up
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

    const dest = form.role === "admin" ? "/admin/dashboard" : "/donor/dashboard";
    router.push(dest);
  }

  return (
    <>
      <Head>
        <title>Create Account · DonateLink</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-zinc-900">
            <span className="text-2xl">🌍</span>
            DonateLink
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            {applied ? (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  ✅
                </div>
                <h1 className="mt-4 text-2xl font-bold text-zinc-900">Application submitted</h1>
                <p className="mt-2 text-sm text-zinc-600">
                  Thanks for applying. Our team will review{" "}
                  <span className="font-semibold">{form.orgName}</span>. Once approved, you'll get an
                  email to set your password and access your NGO dashboard.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Back to home
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-zinc-900">Create your account</h1>
                <p className="mt-1 text-sm text-zinc-600">Open to everyone — all faiths, all nations.</p>

                {errorMsg && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">I am a...</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => update("role", r.value)}
                          className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                            form.role === r.value
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                          }`}
                        >
                          <div className="font-semibold">{r.label}</div>
                          <div className="text-zinc-500">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isNgo ? (
                    <>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        NGO applications are verified by an admin. Once approved, we email you a link
                        to set your password — no password needed now.
                      </div>

                      <div>
                        <label htmlFor="orgName" className="block text-sm font-medium text-zinc-700">
                          Organization Name
                        </label>
                        <input
                          id="orgName"
                          type="text"
                          required
                          value={form.orgName}
                          onChange={(e) => update("orgName", e.target.value)}
                          className={inputClass}
                          placeholder="e.g. Helping Hands Foundation"
                        />
                      </div>

                      <div>
                        <label htmlFor="regNumber" className="block text-sm font-medium text-zinc-700">
                          Registration / License Number
                        </label>
                        <input
                          id="regNumber"
                          type="text"
                          required
                          value={form.regNumber}
                          onChange={(e) => update("regNumber", e.target.value)}
                          className={inputClass}
                          placeholder="Official NGO registration no."
                        />
                      </div>

                      <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-zinc-700">
                          Contact Person
                        </label>
                        <input
                          id="contactPerson"
                          type="text"
                          required
                          value={form.contactPerson}
                          onChange={(e) => update("contactPerson", e.target.value)}
                          className={inputClass}
                          placeholder="Full name of representative"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className={inputClass}
                          placeholder="+92 300 1234567"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-zinc-700">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          required
                          value={form.country}
                          onChange={(e) => update("country", e.target.value)}
                          className={inputClass}
                          placeholder="Country of operation"
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
                          Category
                        </label>
                        <select
                          id="category"
                          value={form.category}
                          onChange={(e) => update("category", e.target.value)}
                          className={inputClass}
                        >
                          {NGO_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-zinc-700">
                          Website <span className="text-zinc-400">(optional)</span>
                        </label>
                        <input
                          id="website"
                          type="url"
                          value={form.website}
                          onChange={(e) => update("website", e.target.value)}
                          className={inputClass}
                          placeholder="https://example.org"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
                          About the Organization
                        </label>
                        <textarea
                          id="description"
                          required
                          rows={3}
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          className={inputClass}
                          placeholder="Briefly describe your mission and the work you do."
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>

                  {!isNgo && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                        Password
                      </label>
                      <PasswordInput
                        id="password"
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
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:enabled:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? isNgo
                        ? "Submitting application..."
                        : "Creating account..."
                      : isNgo
                      ? "Submit NGO Application"
                      : "Create Account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
