import Head from "next/head";

// Full-screen auth layout: image/gradient on the left half, form column
// (capped at max-w-md, vertically scrollable) on the right.
//   imageUrl       — optional photo, falls back to imageGradient on error
//   imageGradient  — Tailwind classes for the gradient inside the image card
//   tagline        — hero text rendered over the image
export default function AuthLayout({
  title,
  imageUrl,
  imageGradient = "from-emerald-900 via-teal-700 to-cyan-500",
  tagline = { eyebrow: "Donate · Track · Trust", line: "Every donation, transparently followed end to end." },
  children,
}) {
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
              {/* Modern decorative orbs */}
              <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl" />
              <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-teal-400/30 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          )}

          <div className="relative z-10 flex h-full flex-col justify-end p-10 lg:p-16 animate-auth-slide-right">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              {tagline.eyebrow}
            </p>
            <p className="mt-3 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
              {tagline.line}
            </p>
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
