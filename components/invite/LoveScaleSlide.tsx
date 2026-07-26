"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onLoveALot: () => void;
}

type DecoyKey = "little" | "none";

const DECOY_CONFIG: { key: DecoyKey; label: string }[] = [
  { key: "little", label: "A little 😅" },
  { key: "none", label: "Not really 😶" },
];

export default function LoveScaleSlide({ onLoveALot }: Props) {
  const [burnCount, setBurnCount] = useState(0);
  const [burning, setBurning] = useState<Record<DecoyKey, boolean>>({
    little: false,
    none: false,
  });
  const [gone, setGone] = useState(false);

  const handleDecoyClick = (key: DecoyKey) => {
    if (gone || burning[key]) return;
    const nextCount = burnCount + 1;
    setBurnCount(nextCount);
    setBurning((b) => ({ ...b, [key]: true }));

    setTimeout(() => {
      setBurning((b) => ({ ...b, [key]: false }));
      if (nextCount >= 3) {
        setGone(true);
      }
    }, 550);
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="font-display text-2xl font-bold text-wine">
          One more thing... 🥺
        </h2>
        <p className="mt-1 text-sm text-wine/70">How much do you love me?</p>
      </div>

      <div className="flex flex-col items-center gap-3 layout">
        <motion.button
          layout
          onClick={onLoveALot}
          whileTap={{ scale: 0.96 }}
          className="w-full max-w-xs rounded-full bg-neon px-8 py-4 font-display text-lg font-bold text-white shadow-glow transition hover:scale-105"
        >
          Yes, so much 😍
        </motion.button>

        <AnimatePresence>
          {!gone && (
            <motion.div
              layout
              exit={{ opacity: 0, height: 0 }}
              className="flex w-full max-w-xs flex-col items-center gap-3 overflow-visible"
            >
              {DECOY_CONFIG.map(({ key, label }) => (
                <div key={key} className="relative w-full">
                  <AnimatePresence>
                    {burning[key] && (
                      <>
                        <motion.span
                          initial={{ opacity: 0, y: 0, scale: 0.6 }}
                          animate={{ opacity: 1, y: -30, scale: 1.2 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="pointer-events-none absolute left-1/3 top-0 z-10 text-xl"
                        >
                          🔥
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, y: 0, scale: 0.6 }}
                          animate={{ opacity: 1, y: -40, scale: 1.3 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, delay: 0.05 }}
                          className="pointer-events-none absolute left-1/2 top-0 z-10 text-2xl"
                        >
                          🔥
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, y: 0, scale: 0.6 }}
                          animate={{ opacity: 1, y: -25, scale: 1.1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="pointer-events-none absolute left-2/3 top-0 z-10 text-lg"
                        >
                          🔥
                        </motion.span>
                      </>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={() => handleDecoyClick(key)}
                    animate={
                      burning[key]
                        ? { opacity: 0, y: -70, rotate: 18, scale: 0.5 }
                        : { opacity: 1, y: 0, rotate: 0, scale: 1 }
                    }
                    initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                    className="w-full rounded-full border border-wine/30 bg-white px-6 py-3 text-sm font-semibold text-wine shadow-sm"
                  >
                    {label}
                  </motion.button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {gone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-wine/50"
          >
            Only the honest answer is left 😏
          </motion.p>
        )}
      </div>
    </div>
  );
}
