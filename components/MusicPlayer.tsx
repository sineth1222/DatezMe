"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  src?: string | null;
}

const DEFAULT_TRACK = "/audio/soft-lofi-romance.mp3";

export default function MusicPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const trackSrc = src || DEFAULT_TRACK;

  useEffect(() => {
    const hint = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(hint);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
        setShowHint(false);
      }
    } catch {
      // autoplay blocked until user gesture — the click itself is the gesture
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showHint && !playing && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="rounded-full bg-wine px-3 py-1.5 text-xs font-medium text-vanilla shadow-lg"
          >
            Play our song 🎶
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-wine text-vanilla shadow-glow"
      >
        {playing ? (
          <Pause size={20} />
        ) : (
          <Music2 size={20} className={playing ? "" : "animate-heartbeat"} />
        )}
      </motion.button>
      <audio ref={audioRef} src={trackSrc} loop preload="none" />
    </div>
  );
}
