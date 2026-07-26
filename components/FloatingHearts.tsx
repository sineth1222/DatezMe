"use client";

const HEARTS = Array.from({ length: 10 }, (_, i) => i);

export default function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {HEARTS.map((i) => {
        const left = (i * 97) % 100;
        const size = 14 + ((i * 13) % 22);
        const delay = (i % 5) * 1.3;
        const duration = 8 + (i % 6);
        const opacity = 0.15 + ((i % 4) * 0.05);
        return (
          <span
            key={i}
            className="absolute animate-rise"
            style={{
              left: `${left}%`,
              bottom: "-40px",
              fontSize: `${size}px`,
              opacity,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            💗
          </span>
        );
      })}
    </div>
  );
}
