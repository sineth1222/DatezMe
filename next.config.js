const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Service workers can make local dev confusing (stale caches), so we
  // only generate/register one in production builds.
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
  },
};

module.exports = withPWA(nextConfig);
