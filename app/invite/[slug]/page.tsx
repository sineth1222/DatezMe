"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InvitationRecord } from "@/lib/types";
import { findSpotByName, findVibeByLabel } from "@/lib/datePresets";
import EnvelopeIntro from "@/components/invite/EnvelopeIntro";
import LoveScaleSlide from "@/components/invite/LoveScaleSlide";
import EvasiveNoButton from "@/components/EvasiveNoButton";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingHearts from "@/components/FloatingHearts";
import ProgressDots from "@/components/create/ProgressDots";

type Phase =
  | "loading"
  | "notfound"
  | "envelope"
  | "question"
  | "details"
  | "letter"
  | "celebrate";
type DetailSlide = "date" | "time" | "vibe" | "spot" | "food" | "love";

export default function InvitePage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const noBtnContainerRef = useRef<HTMLDivElement>(null);

  const [invitation, setInvitation] = useState<InvitationRecord | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [detailIndex, setDetailIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [chosenVibe, setChosenVibe] = useState("");
  const [chosenSpot, setChosenSpot] = useState("");
  const [favoriteFood, setFavoriteFood] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setPhase("notfound");
        return;
      }
      setInvitation(data as InvitationRecord);
      setPhase("envelope");

      if (data.status === "sent") {
        await supabase
          .from("invitations")
          .update({ status: "opened", opened_at: new Date().toISOString() })
          .eq("slug", slug);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const offeredSpots = (invitation?.date_spot_presets || [])
    .map((name) => findSpotByName(name))
    .filter(Boolean) as NonNullable<ReturnType<typeof findSpotByName>>[];

  //const offeredVibes = invitation?.vibe_options || [];
  const offeredVibes = (invitation?.vibe_options || [])
    .map((label: string) => findVibeByLabel(label))
    .filter(Boolean) as NonNullable<ReturnType<typeof findVibeByLabel>>[];

  // One question per slide — built dynamically so we skip vibe/spot slides
  // entirely if the Invitater didn't offer any.
  const detailSlides = useMemo<DetailSlide[]>(() => {
    const slides: DetailSlide[] = ["date", "time"];
    if (offeredVibes.length > 0) slides.push("vibe");
    if (offeredSpots.length > 0) slides.push("spot");
    slides.push("food", "love");
    return slides;
  }, [offeredVibes.length, offeredSpots.length]);

  const currentSlide = detailSlides[detailIndex];

  const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ["#FF5C8A", "#D9A6A0", "#6B1E3C", "#FFF3E4"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ["#FF5C8A", "#D9A6A0", "#6B1E3C", "#FFF3E4"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleYes = () => {
    fireConfetti();
    setDetailIndex(0);
    setPhase("details");
  };

  const goNextDetail = () => {
    if (detailIndex < detailSlides.length - 1) {
      setDetailIndex((i) => i + 1);
    } else {
      setPhase("letter");
    }
  };
  const goBackDetail = () => setDetailIndex((i) => Math.max(0, i - 1));

  const submitResponse = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          accepted: true,
          selectedDate,
          selectedTime,
          chosenVibe,
          chosenDateSpot: chosenSpot,
          favoriteFood,
          replyMessage,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      fireConfetti();
      setPhase("celebrate");
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vanilla">
        <p className="font-display text-wine">Opening your invitation...</p>
      </div>
    );
  }

  if (phase === "notfound" || !invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-vanilla px-4 text-center">
        <span className="text-4xl">💔</span>
        <p className="font-display text-xl text-wine">
          This invitation doesn't exist anymore.
        </p>
        <p className="text-sm text-wine/60">
          Double-check the link and try again.
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-vanilla bg-wine-glow bg-noise px-4 py-10">
      <FloatingHearts />
      <MusicPlayer src={invitation.music_url} />

      {invitation.has_watermark && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
          <span className="rounded-full bg-black/20 px-3 py-1 text-[10px] tracking-wide text-white/90 backdrop-blur-sm">
            Made with 💗 on DatezMe
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-lg">
        <AnimatePresence mode="wait">
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
          {phase === "envelope" && (
            <motion.div key="envelope" exit={{ opacity: 0 }}>
              <EnvelopeIntro
                invitationerName={invitation.invitationer_name}
                introMessage={invitation.intro_message}
                coverPhotoUrl={invitation.cover_photo_url}
                onOpen={() => setPhase("question")}
              />
            </motion.div>
          )}

          {phase === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-rosegold/30 bg-white/60 p-8 text-center shadow-xl backdrop-blur-md"
            >
              <p className="font-display text-2xl font-bold text-wine">
                Will you go on a date with me?
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleYes}
                  className="rounded-full font-scriptnew bg-neon px-10 py-5 text-xl font-bold text-white shadow-glow transition hover:scale-105"
                >
                  YES 💖
                </button>
              </div>
              <EvasiveNoButton containerRef={noBtnContainerRef} />
            </motion.div>
          )}

          {phase === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-rosegold/30 bg-white/60 p-8 shadow-xl backdrop-blur-md"
            >
              <ProgressDots total={detailSlides.length} current={detailIndex} />

              <div className="mt-6 min-h-[16rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentSlide === "date" && (
                      <div className="space-y-5 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          Yay! Let's plan it 🎉
                        </h2>
                        <p className="text-sm text-wine/70">
                          What date works for you?
                        </p>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full font-scriptnew rounded-xl border border-rosegold/50 bg-white px-4 py-3 text-center text-ink focus:border-neon focus:outline-none"
                        />
                        <NextButton
                          disabled={!selectedDate}
                          onClick={goNextDetail}
                        />
                      </div>
                    )}

                    {currentSlide === "time" && (
                      <div className="space-y-5 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          What time? ⏰
                        </h2>
                        <p className="text-sm text-wine/70">
                          Pick a time that suits you.
                        </p>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full font-scriptnew rounded-xl border border-rosegold/50 bg-white px-4 py-3 text-center text-ink focus:border-neon focus:outline-none"
                        />
                        <NextButton
                          disabled={!selectedTime}
                          onClick={goNextDetail}
                        />
                      </div>
                    )}

                    {/*currentSlide === "vibe" && (
                      <div className="space-y-5 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          What's the vibe? ✨
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2">
                          {offeredVibes.map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                setChosenVibe(v);
                                setTimeout(goNextDetail, 220);
                              }}
                              className={`rounded-full font-scriptnew border px-4 py-2.5 text-sm font-medium transition ${
                                chosenVibe === v
                                  ? "border-neon bg-blush text-wine"
                                  : "border-rosegold/40 bg-white text-ink/70 hover:border-rosegold"
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    )*/}

                    {currentSlide === "vibe" && (
                      <div className="space-y-5 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          What's the vibe? ✨
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2">
                          {offeredVibes.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setChosenVibe(v.label);
                                setTimeout(goNextDetail, 220);
                              }}
                              className={`flex items-center gap-2 rounded-full font-scriptnew border px-4 py-2.5 text-sm font-medium transition ${
                                chosenVibe === v.label
                                  ? "border-neon bg-blush text-wine"
                                  : "border-rosegold/40 bg-white text-ink/70 hover:border-rosegold"
                              }`}
                            >
                              <span className="text-base">{v.emoji}</span>
                              <span>{v.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentSlide === "spot" && (
                      <div className="space-y-4 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          Where should we go? 📍
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {offeredSpots.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setChosenSpot(s.name);
                                setTimeout(goNextDetail, 260);
                              }}
                              className={`relative min-h-[9.5rem] overflow-hidden rounded-2xl border text-left transition ${
                                chosenSpot === s.name
                                  ? "border-neon shadow-glow"
                                  : "border-rosegold/40 hover:border-rosegold"
                              }`}
                            >
                              {s.imageUrl ? (
                                <img
                                  src={s.imageUrl}
                                  alt=""
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-rosegold/70 to-wine/70" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                              <div className="relative flex h-full flex-col justify-end p-3.5">
                                <span className="text-lg">{s.emoji}</span>
                                <p className="mt-0.5 font-display text-sm font-semibold text-white drop-shadow-sm">
                                  {s.name}
                                </p>
                                <p className="mt-1 text-[11px] leading-snug text-white/85">
                                  {s.blurb}
                                </p>
                                <p className="mt-1 text-[11px] text-white/70">
                                  · {s.activities[0]}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentSlide === "food" && (
                      <div className="space-y-5 text-center">
                        <h2 className="font-display text-2xl font-bold text-wine">
                          Any favorite food? 🍜
                        </h2>
                        <p className="text-sm text-wine/70">
                          Optional just curious.
                        </p>
                        <input
                          value={favoriteFood}
                          onChange={(e) => setFavoriteFood(e.target.value)}
                          placeholder="Kottu, ice cream, anything spicy..."
                          className="w-full rounded-xl border border-rosegold/50 bg-white px-4 py-3 text-center text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
                        />
                        <NextButton disabled={false} onClick={goNextDetail} />
                      </div>
                    )}

                    {currentSlide === "love" && (
                      <LoveScaleSlide onLoveALot={goNextDetail} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {detailIndex > 0 && currentSlide !== "love" && (
                <button
                  type="button"
                  onClick={goBackDetail}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-wine/60 hover:text-wine"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
            </motion.div>
          )}

          {phase === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5 rounded-3xl border border-rosegold/30 bg-white/60 p-8 shadow-xl backdrop-blur-md"
            >
              {invitation.secret_message && (
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-wine/50">
                    A note for you
                  </p>
                  <p className="rounded-2xl bg-blush p-4 font-script text-lg leading-relaxed text-wine">
                    {invitation.secret_message}
                  </p>
                </div>
              )}
              {invitation.memory_photos?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {invitation.memory_photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="h-28 w-28 shrink-0 rounded-xl object-cover shadow-md"
                    />
                  ))}
                </div>
              )}

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-wine">
                  Write something back (optional)
                </span>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={3}
                  placeholder="I'd love to..."
                  className="w-full resize-none rounded-2xl border border-rosegold/50 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-neon focus:outline-none"
                />
              </label>

              {submitError && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <button
                onClick={submitResponse}
                disabled={submitting}
                className="w-full rounded-full bg-neon px-6 py-4 font-display text-lg font-bold text-white shadow-glow disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Confirm It's a Date! 💖"}
              </button>
            </motion.div>
          )}

          {phase === "celebrate" && (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-rosegold/30 bg-white/60 p-10 text-center shadow-xl backdrop-blur-md"
            >
              <span className="text-5xl">💖</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-wine">
                It's a Date!
              </h2>
              <p className="mt-2 text-ink/70">
                See you {selectedDate || "soon"}{" "}
                {selectedTime && `at ${selectedTime}`} 💫
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function NextButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-full bg-wine px-6 py-3.5 font-display font-semibold text-vanilla shadow-glow transition disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  );
}
