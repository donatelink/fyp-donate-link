import Head from "next/head";

// Full-screen auth layout: image/gradient on the left half, form column
// (capped at max-w-md, vertically scrollable) on the right.
//   imageUrl       — optional photo, falls back to imageGradient on error
//   imageGradient  — Tailwind classes for the gradient inside the image card
//   tagline        — hero text rendered over the image
export default function AuthLayout({
  title,
  imageUrl,
  imageGradient = "from-emerald-900 via-emerald-700 to-emerald-500",
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

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
