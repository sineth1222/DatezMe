"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Copy, Plus, LogOut, Heart, Clock, MailOpen } from "lucide-react";

interface DashboardRow {
  id: string;
  slug: string;
  invitationer_name: string;
  status: "sent" | "opened" | "accepted";
  created_at: string;
  accepted: boolean | null;
  selected_date: string | null;
  selected_time: string | null;
  chosen_vibe: string | null;
  chosen_date_spot: string | null;
  favorite_food: string | null;
  reply_message: string | null;
}

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/auth/login?next=/dashboard");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", userData.user.id)
        .single();
      setUserName(profile?.name || "");

      const { data } = await supabase
        .from("invitation_dashboard")
        .select("*")
        .order("created_at", { ascending: false });

      setRows((data as DashboardRow[]) || []);
      setLoading(false);
    })();
  }, [router, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <main className="min-h-screen font-display bg-vanilla bg-noise px-4 py-10">
      <div className="mx-auto max-w-3xl">
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-wine/50">
              Dashboard
            </p>
            <h1 className="font-display text-3xl font-bold text-wine">
              Hi {userName || "there"} 👋
            </h1>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1 rounded-full border border-rosegold/40 px-3 py-2 text-xs font-medium text-wine hover:bg-blush"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <Link
          href="/create"
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-wine px-6 py-3.5 font-display font-semibold text-vanilla shadow-glow"
        >
          <Plus size={18} /> Create a new invitation
        </Link>

        <div className="mt-8 space-y-4">
          {loading && <p className="text-center text-wine/60">Loading...</p>}
          {!loading && rows.length === 0 && (
            <p className="rounded-2xl border border-dashed border-rosegold/40 p-8 text-center text-sm text-wine/60">
              No invitations yet. Create your first one above 💌
            </p>
          )}
          {rows.map((r) => (
            <InvitationCard key={r.id} row={r} />
          ))}
        </div>
      </div>
    </main>
  );
}

function InvitationCard({ row }: { row: DashboardRow }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    (typeof window !== "undefined" ? window.location.origin : "") +
    `/invite/${row.slug}`;

  const copy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const statusBadge = {
    sent: {
      label: "Sent",
      icon: <Clock size={12} />,
      cls: "bg-blush text-wine",
    },
    opened: {
      label: "Opened",
      icon: <MailOpen size={12} />,
      cls: "bg-rosegold/40 text-wine",
    },
    accepted: {
      label: "Accepted",
      icon: <Heart size={12} />,
      cls: "bg-neon text-white",
    },
  }[row.status];

  return (
    <div className="rounded-2xl border border-rosegold/30 bg-white/60 p-5">
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
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-wine">
            {row.invitationer_name}
          </p>
          <p className="text-xs text-wine/50">
            {new Date(row.created_at).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.cls}`}
        >
          {statusBadge.icon} {statusBadge.label}
        </span>
      </div>

      {row.status === "accepted" && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {row.selected_date && (
            <Detail label="Date" value={row.selected_date} />
          )}
          {row.selected_time && (
            <Detail label="Time" value={row.selected_time} />
          )}
          {row.chosen_vibe && <Detail label="Vibe" value={row.chosen_vibe} />}
          {row.chosen_date_spot && (
            <Detail label="Spot" value={row.chosen_date_spot} />
          )}
          {row.favorite_food && (
            <Detail label="Food" value={row.favorite_food} />
          )}
        </dl>
      )}
      {row.reply_message && (
        <p className="mt-3 rounded-xl bg-blush px-3 py-2 font-script text-base text-wine">
          "{row.reply_message}"
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-rosegold/40 bg-vanilla px-3 py-2">
        <span className="flex-1 truncate text-xs text-ink/70">{inviteUrl}</span>
        <button
          onClick={copy}
          className="text-wine hover:text-neon"
          aria-label="Copy link"
        >
          <Copy size={14} />
        </button>
      </div>
      {copied && <p className="mt-1 text-xs text-neon">Copied!</p>}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-wine/50">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
