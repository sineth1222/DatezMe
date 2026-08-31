"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { emptyDraft, InvitationDraft } from "@/lib/types";
import { makeSlug } from "@/lib/slug";
import { DISTRICTS, VIBE_OPTIONS } from "@/lib/datePresets";
import ProgressDots from "@/components/create/ProgressDots";
import Step1Intro from "@/components/create/Step1Intro";
import Step2Question from "@/components/create/Step2Question";
import Step3DateSpots from "@/components/create/Step3DateSpots";
import Step4Vibe from "@/components/create/Step4Vibe";
import Step5SecretMessage from "@/components/create/Step5SecretMessage";
import Step6Summary from "@/components/create/Step6Summary";
import PlanSelectModal from "./PlanSelectModal";
//import PlanSelectModal from "@/components/create/PlanSelectModal";

const TOTAL_STEPS = 6;

export default function CreatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<InvitationDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [createdInvitation, setCreatedInvitation] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSenderEmail(data.user?.email ?? "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/auth/login?next=/create");
      } else {
        setCheckingAuth(false);
      }
    });
  }, [router, supabase]);

  const update = (patch: Partial<InvitationDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canAdvance = () => {
    if (step === 0) return draft.invitationerName.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Please log in again.");

      const slug = makeSlug(draft.invitationerName);
      const vibeLabels = draft.offeredVibes
        .map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label)
        .filter(Boolean);

      const { data: created, error: insertError } = await supabase
        .from("invitations")
        .insert({
          invitater_id: userData.user.id,
          slug,
          invitationer_name: draft.invitationerName,
          cover_photo_url: draft.coverPhotoUrl || null,
          intro_message: draft.introMessage || null,
          music_url: draft.musicUrl || null,
          vibe_options: vibeLabels.length ? vibeLabels : undefined,
          date_spot_presets: draft.selectedDateSpots,
          secret_message: draft.secretMessage || null,
          memory_photos: draft.memoryPhotos.filter(Boolean),
          has_watermark: true,
        })
        .select("id, slug")
        .single();

      if (insertError) throw insertError;

      setCreatedInvitation({ id: created.id, slug: created.slug });
      setShowPlanModal(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vanilla">
        <p className="font-display text-wine">Loading your studio...</p>
      </div>
    );
  }

  const steps = [
    <Step1Intro key="1" draft={draft} update={update} />,
    <Step2Question key="2" draft={draft} />,
    <Step3DateSpots key="3" draft={draft} update={update} />,
    <Step4Vibe key="4" draft={draft} update={update} />,
    <Step5SecretMessage key="5" draft={draft} update={update} />,
    <Step6Summary
      key="6"
      draft={draft}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    />,
  ];

  return (
    <main className="min-h-screen bg-vanilla bg-wine-glow bg-noise px-4 py-10">
      <div className="mx-auto max-w-xl">
        <ProgressDots total={TOTAL_STEPS} current={step} />
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

        <div className="mt-8 rounded-3xl border border-rosegold/30 bg-white/50 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          {step < TOTAL_STEPS - 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-wine disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance()}
                className="flex items-center gap-1 rounded-full bg-wine px-6 py-2.5 text-sm font-semibold text-vanilla shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showPlanModal && createdInvitation && (
        <PlanSelectModal
          invitationId={createdInvitation.id}
          invitationerName={draft.invitationerName}
          senderEmail={senderEmail}
          onFree={() =>
            router.push(
              `/create/success?slug=${encodeURIComponent(createdInvitation.slug)}`,
            )
          }
          onPaidSuccess={() =>
            router.push(
              `/create/success?slug=${encodeURIComponent(createdInvitation.slug)}`,
            )
          }
          onClose={() => setShowPlanModal(false)}
        />
      )}
    </main>
  );
}

/*"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { emptyDraft, InvitationDraft } from "@/lib/types";
import { makeSlug } from "@/lib/slug";
import { DISTRICTS, VIBE_OPTIONS } from "@/lib/datePresets";
import ProgressDots from "@/components/create/ProgressDots";
import Step1Intro from "@/components/create/Step1Intro";
import Step2Question from "@/components/create/Step2Question";
import Step3DateSpots from "@/components/create/Step3DateSpots";
import Step4Vibe from "@/components/create/Step4Vibe";
import Step5SecretMessage from "@/components/create/Step5SecretMessage";
import Step6Summary from "@/components/create/Step6Summary";

const TOTAL_STEPS = 6;

export default function CreatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<InvitationDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
 const [createdInvitation, setCreatedInvitation] = useState<{ id: string; slug: string } | null>(null);
 const [senderEmail, setSenderEmail] = useState("");

 useEffect(() => {
   supabase.auth.getUser().then(({ data }) => {
     setSenderEmail(data.user?.email ?? "");
   });
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/auth/login?next=/create");
      } else {
        setCheckingAuth(false);
      }
    });
  }, [router, supabase]);

  const update = (patch: Partial<InvitationDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canAdvance = () => {
    if (step === 0) return draft.invitationerName.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Please log in again.");

      const slug = makeSlug(draft.invitationerName);
      const vibeLabels = draft.offeredVibes
        .map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label)
        .filter(Boolean);

      const { error: insertError } = await supabase.from("invitations").insert({
        invitater_id: userData.user.id,
        slug,
        invitationer_name: draft.invitationerName,
        cover_photo_url: draft.coverPhotoUrl || null,
        intro_message: draft.introMessage || null,
        music_url: draft.musicUrl || null,
        vibe_options: vibeLabels.length ? vibeLabels : undefined,
        date_spot_presets: draft.selectedDateSpots,
        secret_message: draft.secretMessage || null,
        memory_photos: draft.memoryPhotos.filter(Boolean),
      });

      if (insertError) throw insertError;

      router.push(`/create/success?slug=${encodeURIComponent(slug)}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vanilla">
        <p className="font-display text-wine">Loading your studio...</p>
      </div>
    );
  }

  const steps = [
    <Step1Intro key="1" draft={draft} update={update} />,
    <Step2Question key="2" draft={draft} />,
    <Step3DateSpots key="3" draft={draft} update={update} />,
    <Step4Vibe key="4" draft={draft} update={update} />,
    <Step5SecretMessage key="5" draft={draft} update={update} />,
    <Step6Summary
      key="6"
      draft={draft}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    />,
  ];

  return (
    <main className="min-h-screen bg-vanilla bg-wine-glow bg-noise px-4 py-10">
      <div className="mx-auto max-w-xl">
        <ProgressDots total={TOTAL_STEPS} current={step} />
        {/* ── Background logo watermark ── /}
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

        <div className="mt-8 rounded-3xl border border-rosegold/30 bg-white/50 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          {step < TOTAL_STEPS - 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-wine disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance()}
                className="flex items-center gap-1 rounded-full bg-wine px-6 py-2.5 text-sm font-semibold text-vanilla shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}*/
