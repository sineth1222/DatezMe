"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  invitationerName: string;
  introMessage: string | null;
  coverPhotoUrl: string | null;
  onOpen: () => void;
}

export default function EnvelopeIntro({
  invitationerName,
  introMessage,
  coverPhotoUrl,
  onOpen,
}: Props) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onOpen, 900);
  };

  return (
    <div className="flex min-h-[70vh] font-display flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button
            key="envelope"
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleOpen}
            className="group flex flex-col items-center gap-5"
            aria-label="Open your secret invitation"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-7xl drop-shadow-lg"
            >
              💌
            </motion.div>
            <p className="font-display text-2xl font-semibold text-wine">
              A secret invitation for you
            </p>
            <span className="rounded-full bg-wine px-6 py-3 text-sm font-semibold text-vanilla shadow-glow transition group-hover:scale-105">
              Tap to open
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="opening"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            {coverPhotoUrl && (
              <img
                src={coverPhotoUrl}
                alt=""
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-glow"
              />
            )}
            <h1 className="font-display text-3xl font-bold text-wine">
              Hi {invitationerName} ❤️
            </h1>
            {introMessage && (
              <p className="max-w-sm text-ink/80">{introMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
