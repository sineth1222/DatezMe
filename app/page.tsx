import Link from "next/link";
import FloatingHearts from "@/components/FloatingHearts";
import HeroHeart from "@/components/HeroHeart";
import { DISTRICTS } from "@/lib/datePresets";
import SpotPreviewCard from "@/components/SpotPreviewCard";
import FlyingDoves from "@/components/FlyingDoves";
import FallingPetals from "@/components/FallingPetals";
import InstallAppSection from "@/components/InstallAppSection";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-vanilla bg-noise">
      {/* Hero */}
      <section className="relative overflow-hidden bg-wine-glow px-4 py-16 sm:py-20 md:py-28">
        <FloatingHearts />
        <FlyingDoves />
        <FallingPetals />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 text-center md:flex-row md:gap-14 md:text-left">
          <HeroHeart />

          <div className="flex-1 px-6">
            <p className="mb-4 inline-block font-script rounded-full border border-rosegold/50 bg-white/50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-wine">
              Made for couples
            </p>

            {/* ── Background logo watermark ── */}
            <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
              <div
                style={{
                  width: "380px",
                  height: "380px",
                  opacity: 0.12, // 👈 0.035 වෙනුවට 0.10 - 0.15 අතර අගයක් දාලා බලන්න
                  filter: "blur(0.5px)",
                  transition: "all 0.9s ease",
                }}
              >
                <img
                  src="/images/logo1.png"
                  alt="Icon"
                  style={{
                    width: "380px",
                    height: "380px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-wine sm:text-5xl">
              DatezMe.
            </h1>
            <p className="mt-1 font-scriptnew text-2xl text-neon">
              Plan Less. Love More.
            </p>
            <p className="mx-auto font-scriptnew mt-4 max-w-md text-lg text-ink/80 md:mx-0">
              Design a secret, playful date invitation complete with an
              impossible to click <span className="text-red-500">"No"</span>{" "}
              button and send it straight to their WhatsApp.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/auth/login"
                className="w-full rounded-full bg-wine px-8 py-4 font-display text-lg font-semibold text-vanilla shadow-glow transition hover:scale-105 sm:w-auto"
              >
                Create Your Invitation 💌
              </Link>
            </div>
            <p className="mt-3 font-display text-xs text-wine/50">
              One click to sign in just your name and email.
            </p>
          </div>
        </div>
      </section>

      {/* Signature: the evasive No button teaser, described */}
      <section className="border-y border-rosegold/30 bg-blush/40 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-wine">
            The button that never gets caught
          </h2>
          <p className="mx-auto font-scriptnew mt-3 max-w-md text-ink/70">
            The moment their cursor gets close, "No" slips away with a playful
            little dodge. "Yes" just sits there, waiting.
          </p>
          <div className="relative font-scriptnew mx-auto mt-8 flex h-24 max-w-xs items-center justify-center gap-4 rounded-3xl border border-rosegold/40 bg-white/70 px-6">
            <span className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-white shadow-glow">
              YES 💖
            </span>
            <span className="rounded-full border border-wine/30 bg-white px-5 py-2.5 text-sm font-semibold text-wine">
              No 😅
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          <Feature
            emoji="🎵"
            title="Soft background music"
            desc="A lofi or acoustic track plays as they open your invitation."
          />
          <Feature
            emoji="🌅"
            title="Sri Lankan date spots"
            desc="Galle Face sunsets, Mirissa beach walks, Nuwara Eliya cafés — built in."
          />
          <Feature
            emoji="📲"
            title="Straight to WhatsApp"
            desc="Share the link with one tap, romantic caption included."
          />
        </div>
      </section>

      {/* Sri Lanka spots preview /}
      <section className="bg-white/40 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-center font-display text-2xl font-bold text-wine">
            A few spots to choose from
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["colombo", "matara", "nuwara-eliya"].map((id) => {
              const d = DISTRICTS.find((x) => x.id === id)!;
              const s = d.spots[0];
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-rosegold/30 bg-vanilla p-5 text-left"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="mt-2 font-display font-semibold text-wine">
                    {s.name}
                  </p>
                  <p className="text-xs text-wine/50">{d.name} District</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>*/}

      {/* Sri Lanka spots preview */}
      <section className="bg-white/40 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-center font-display text-2xl font-bold text-wine">
            A few spots to choose from
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["colombo", "matara", "nuwara-eliya"].map((id) => {
              const d = DISTRICTS.find((x) => x.id === id)!;
              const s = d.spots[0];
              return (
                <SpotPreviewCard
                  key={s.id}
                  imageSrc={`/images/spots/${id}.jpg`}
                  emoji={s.emoji}
                  name={s.name}
                  districtName={d.name}
                />
              );
            })}
          </div>
        </div>
      </section>

      <InstallAppSection />

      <footer className="px-4 py-10 text-center text-xs text-wine/40">
        DatezMe · Made with 💗 in Sri Lanka
      </footer>
    </main>
  );
}

function Feature({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-rosegold/30 bg-white/60 p-6 text-center">
      <span className="text-3xl">{emoji}</span>
      <p className="mt-3 font-display font-semibold text-wine">{title}</p>
      <p className="mt-1 text-sm font-scriptnew text-ink/70">{desc}</p>
    </div>
  );
}
