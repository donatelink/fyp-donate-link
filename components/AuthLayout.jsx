import Head from "next/head";
import Link from "next/link";

// Auth pages share a split-screen card: image/gradient on the left, form on the right.
//   imageUrl       — optional photo (hidden on error, gradient stays visible)
//   imageGradient  — Tailwind classes for the gradient inside the image card
//   outerGradient  — Tailwind classes for the page background gradient
//   tagline        — short hero text rendered over the image card
export default function AuthLayout({
  title,
  imageUrl,
  imageGradient = "from-emerald-900 via-emerald-700 to-emerald-500",
  outerGradient = "from-emerald-50 via-white to-amber-50",
  tagline = { eyebrow: "Donate · Track · Trust", line: "Every donation, transparently followed end to end." },
  children,
}) {
  return (
    <>
      <Head>
        <title>{title} · DonateLink</title>
      </Head>
      <div className={`min-h-screen bg-gradient-to-br ${outerGradient} p-3 sm:p-6 lg:p-10`}>
        <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:min-h-[680px] md:flex-row">
          {/* Image / gradient side */}
          <div className={`relative hidden md:block md:w-1/2 bg-gradient-to-br ${imageGradient}`}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30" />

            <div className="relative z-10 flex h-full flex-col p-8 lg:p-10">
              <Link
                href="/"
                className="flex w-fit items-center gap-2 text-lg font-bold text-white drop-shadow-lg"
              >
                <span className="text-2xl">🌍</span>
                DonateLink
              </Link>

              <div className="mt-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                  {tagline.eyebrow}
                </p>
                <p className="mt-3 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                  {tagline.line}
                </p>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="flex flex-1 flex-col p-6 sm:p-10 lg:p-14">{children}</div>
        </div>
      </div>
    </>
  );
}
