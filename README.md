# HithaLink 💌 — Romantic Date Invitation Platform

A Next.js + Supabase web app for creating secret, playful date-invitation
links. Built for a Sri Lankan audience: local date-spot presets, WhatsApp
sharing, an "impossible to click No" button, and email alerts when your
partner responds.

## Roles

- **Invitater** — signs up, customizes the invitation, sends the link.
- **Invitationer** — opens the link, plays through it, responds.

## Tech stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Framer Motion (animations) + canvas-confetti
- Supabase (Auth, Postgres, Row Level Security)
- Nodemailer (response + optional invite emails)

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run the contents of `supabase/schema.sql`. It creates:
   - `profiles` (auto-filled on signup via a trigger)
   - `invitations` (one row per invite, RLS-protected per Invitater)
   - `invitation_responses` (public insert, Invitater-only read)
   - `invitation_dashboard` (a view the dashboard reads from)
3. Enable **Email** magic-link sign-in: Authentication → Providers → Email (on by default).

### Enabling Google Sign-In (step by step)

This is the part people usually get stuck on — here's the exact order:

1. **In Supabase first, grab the callback URL.**
   Go to your Supabase project → **Authentication → Providers → Google** →
   toggle it on. Supabase shows you a **Callback URL (for OAuth)** that looks
   like `https://<your-project-ref>.supabase.co/auth/v1/callback`. Copy it —
   you'll paste it into Google in the next step. Leave this Supabase tab open.
2. **In Google Cloud Console, create OAuth credentials.**
   - Go to https://console.cloud.google.com → create a project (or pick an existing one).
   - Go to **APIs & Services → OAuth consent screen**. Choose **External**,
     fill in the app name (e.g. "HithaLink") and your email, and save.
   - Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Under **Authorized JavaScript origins**, add your site URL, e.g.
     `http://localhost:3000` (and later your live domain).
   - Under **Authorized redirect URIs**, paste the Supabase callback URL you
     copied in step 1 — e.g. `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - Click Create. Google shows you a **Client ID** and **Client Secret**.
3. **Back in Supabase, paste the credentials.**
   Still on Authentication → Providers → Google, paste the Client ID and
   Client Secret from Google, then Save.
4. **Set your app's own URLs in Supabase.**
   Go to Authentication → URL Configuration:
   - **Site URL** → `http://localhost:3000` (or your live domain).
   - **Redirect URLs** → add `http://localhost:3000/**` (and your live
     domain's `/**` too). This is what lets Supabase send the user back to
     `/auth/callback` in this app after they approve on Google.
5. **Test it.** Run the app, go to `/auth/login`, click "Continue with
   Google". If you see a redirect URI mismatch error, double-check the
   URI in Google Cloud matches the Supabase callback URL _exactly_
   (no trailing slash differences).
6. **Going live:** once you deploy, add your production domain to both
   Google's Authorized origins/redirect URIs and Supabase's Site
   URL/Redirect URLs, then in Google's OAuth consent screen click
   **Publish App** so it's not stuck in testing mode for outside users.
   {"web":{"client_id":"1010258931080-vkbcm7rhj1m8d0vcnugjdjbbk4q47dd0.apps.googleusercontent.com","project_id":"hithalink","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://vmwewomxjbydgtdfyxjz.supabase.co/auth/v1/callback"],"javascript_origins":["http://localhost:3000"]}}

## 3. Set up ImageKit (photo + music uploads)

This app uses [ImageKit](https://imagekit.io) for every upload — cover
photos, memory photos, **and** the background music track. ImageKit isn't
just for images: any file type (including `.mp3`) can be uploaded and
delivered through it, so you don't need a separate service for audio.

1. Create a free account at https://imagekit.io and a "Media Library".
2. Go to **Developer options** in the dashboard and copy:
   - **URL-endpoint** → `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
   - **Public key** → `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
   - **Private key** → `IMAGEKIT_PRIVATE_KEY` (server-only, never exposed to the browser)
3. That's it — no extra SDK install needed. This app talks to ImageKit
   directly: `app/api/imagekit-auth/route.ts` signs a short-lived upload
   token on the server, and `components/UploadField.tsx` uploads the file
   straight from the browser using that token.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in the Supabase, ImageKit, and
SMTP values from steps 2 and 3:

```bash
cp .env.example .env.local
```

## 5. Run locally

```bash
npm run dev
```

Visit http://localhost:3000.

## 6. Deploy

- Push to GitHub, import into **Vercel**, add the same env vars there.
- Point your domain (e.g. via Namecheap, like you did for pradha.xyz) to the
  Vercel project, and update the Supabase redirect URLs to your live domain.

## Folder guide

```
app/
  page.tsx                    → landing page (heart-photo hero + sections)
  auth/login                   → one-click sign in (Google + magic link)
  auth/callback                 → session exchange route
  create/                      → 6-step Invitater customizer wizard
  create/success                → generated link + WhatsApp/email share
  dashboard/                    → Invitater's list of invitations + responses
  invite/[slug]/                 → the Invitationer's full interactive journey
  api/respond                   → saves the response + emails the Invitater
  api/send-invite               → optional direct email send
  api/imagekit-auth             → signs short-lived upload tokens for ImageKit
components/
  EvasiveNoButton.tsx           → the signature "un-clickable No" button
  MusicPlayer.tsx               → floating play/pause for background music
  WhatsappShareButton.tsx       → wa.me deep link with a pre-filled message
  FloatingHearts.tsx            → ambient background hearts
  HeroHeart.tsx                 → heart-clipped hero photo with red filter
  UploadField.tsx               → drag/tap-to-upload field (photos + audio)
  create/                       → wizard step components (Step1–Step6)
  invite/EnvelopeIntro.tsx      → the opening envelope animation
lib/
  datePresets.ts                → district → date-spot data (real, researched)
  imagekit.ts                   → browser-side ImageKit upload helper
  supabase/                     → browser/server/service Supabase clients
  email.ts                      → styled HTML response-notification email
supabase/schema.sql             → full DB schema + RLS policies
```

## Notes

- The "No" button only ever _moves_ — it never blocks the page or disables
  itself, so it stays playful rather than broken-feeling.
- Photos and the music track are uploaded directly to ImageKit from the
  browser (`UploadField.tsx`) — no more pasting URLs by hand.
- `lib/datePresets.ts` currently covers 15 districts (Colombo, Gampaha,
  Kalutara, Kandy, Nuwara Eliya, Matale, Galle, Matara, Hambantota, Badulla,
  Trincomalee, Jaffna, Anuradhapura, Ampara, Ratnapura) with real spots and
  couple activities researched for each. To add the remaining ~10 districts,
  follow the same `District` / `DateSpot` shape.
- `invitation_responses` uses `upsert` on `invitation_id`, so if someone
  resubmits, it updates rather than duplicating.
