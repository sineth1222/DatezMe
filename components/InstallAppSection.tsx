"use client";

import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppSection() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true,
    );

    // Chrome/Edge/Android fire this when the app is installable — Safari
    // never fires it, which is exactly how we tell the two cases apart.
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Already installed / running standalone — nothing to offer.
  if (isStandalone) return null;
  // Not iOS and the browser hasn't offered an install yet — don't show a
  // button that can't do anything.
  if (!isIOS && !deferredPrompt) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setDeferredPrompt(null);
  };

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md rounded-3xl border border-rosegold/30 bg-white/70 p-8 text-center shadow-xl backdrop-blur-md">
        <span className="text-4xl">💌</span>
        <h3 className="mt-3 font-display text-2xl font-bold text-wine">
          Get DatezMe as an app
        </h3>
        <p className="mt-2 font-scriptnew text-sm text-ink/70">
          Install it on your home screen for one-tap access no app store needed.
        </p>
        <button
          onClick={handleInstallClick}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3.5 font-display font-semibold text-vanilla shadow-glow transition hover:scale-105"
        >
          <Download size={18} /> Download App
        </button>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xl font-bold text-wine">
                Add to Home Screen
              </h4>
              <button
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close"
                className="text-wine/50 hover:text-wine"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-left text-sm text-ink/80">
              <div className="flex font-scriptnew items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
                  <Share size={14} />
                </span>
                <p>
                  Tap the <strong>Share</strong> button in Safari's toolbar (the
                  square with an arrow pointing up).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
                  <PlusSquare size={14} />
                </span>
                <p>
                  Scroll down the share sheet and tap{" "}
                  <strong>Add to Home Screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
                  <Check size={14} />
                </span>
                <p>
                  Tap <strong>Add</strong> — datezMe now opens full-screen from
                  your home screen, just like a normal app.
                </p>
              </div>
            </div>

            <p className="mt-4 font-scriptnew text-xs text-wine/50">
              This is an Apple/Safari limitation, not a datezMe one iOS doesn't
              allow websites to trigger the install prompt directly, so this is
              the official way to install any web app on iPhone.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
