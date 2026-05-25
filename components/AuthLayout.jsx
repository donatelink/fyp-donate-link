import Head from "next/head";
import { useEffect, useState } from "react";

// Full-screen auth layout: image/gradient on the left half, form column
// (capped at max-w-md, vertically scrollable) on the right.
//   imageUrl       — optional photo, falls back to imageGradient on error
//   imageGradient  — Tailwind classes for the gradient inside the image card
//   tagline        — hero text rendered over the image. `line` can include
//                    a trailing token from `rotatingWords` rendered via the
//                    {rot} placeholder for a cycling word effect.
//   rotatingWords  — optional array of words that cycle in place of {rot}
//   features       — optional bullet list rendered above the tagline
const DEFAULT_ROTATING = ["tracked", "verified", "delivered"];
const DEFAULT_FEATURES = [
  "Verified NGOs only",
  "End-to-end donation tracking",
  "Real-time photo & milestone updates",
];

export default function AuthLayout({
  title,
  imageUrl,
  imageGradient = "from-emerald-900 via-teal-700 to-cyan-500",
  tagline = { eyebrow: "Donate · Track · Trust", line: "Every donation, transparently {rot}." },
  rotatingWords = DEFAULT_ROTATING,
  features = DEFAULT_FEATURES,
  children,
}) {
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    if (!rotatingWords || rotatingWords.length < 2) return;
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(id);
  }, [rotatingWords]);

  const hasPlaceholder = tagline.line && tagline.line.includes("{rot}");
  const [beforeRot, afterRot] = hasPlaceholder ? tagline.line.split("{rot}") : [tagline.line, ""];

  return (
    <>
      <Head>
        <title>{title} · DonateLink</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-white md:flex-row">
        {/* Image side */}
        <div className={`relative hidden overflow-hidden bg-gradient-to-br md:block md:w-1/2 animate-auth-fade-in ${imageGradient}`}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </>
          ) : (
            <>
              {/* Animated decorative orbs */}
              <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl animate-orb-a" />
              <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl animate-orb-b" />
              <div className="pointer-events-none absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-teal-400/30 blur-3xl animate-orb-c" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          )}

          <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-16 animate-auth-slide-right">
            {/* Brand mark */}
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight">DonateLink</span>
            </div>

            <div>
              {features && features.length > 0 && (
                <ul className="mb-8 space-y-2.5 animate-stagger">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-white/90">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                {tagline.eyebrow}
              </p>
              <p className="mt-3 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
                {beforeRot}
                {hasPlaceholder && (
                  <span
                    key={wordIdx}
                    className="animate-word bg-gradient-to-r from-cyan-200 to-emerald-100 bg-clip-text text-transparent"
                  >
                    {rotatingWords[wordIdx]}
                  </span>
                )}
                {afterRot}
              </p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex min-h-screen w-full flex-1 flex-col overflow-y-auto bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto my-auto w-full max-w-xl animate-auth-fade-up">{children}</div>
        </div>
      </div>
    </>
  );
}
