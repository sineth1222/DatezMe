"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { SiteWatermark } from "@/components/SiteWatermark";

declare global {
  interface Window {
    payhere?: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

interface PlanSelectModalProps {
  invitationId: string;
  invitationerName: string;
  senderEmail: string;
  onFree: () => void;
  onPaidSuccess: () => void;
  onClose: () => void;
}

const FEATURES = [
  { label: "The full animated invitation", free: true, pro: true },
  { label: "Photos, message & music", free: true, pro: true },
  { label: "Private secret link", free: true, pro: true },
  { label: "DatezMe watermark", free: true, pro: false },
];

export default function PlanSelectModal({
  invitationId,
  invitationerName,
  senderEmail,
  onFree,
  onPaidSuccess,
  onClose,
}: PlanSelectModalProps) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.payhere) return;
    window.payhere.onCompleted = () => {
      setPaying(false);
      onPaidSuccess();
    };
    window.payhere.onDismissed = () => setPaying(false);
    window.payhere.onError = (msg) => {
      setPaying(false);
      setError(msg || "Payment failed. Try again.");
    };
  }, [onPaidSuccess]);

  const startPayment = async () => {
    setError(null);
    setPaying(true);
    try {
      const res = await fetch("/api/payment/payhere/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment.");

      window.payhere?.startPayment({
        sandbox: true, // set to false once you have live PayHere credentials
        merchant_id: data.merchantId,
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
        notify_url: data.notifyUrl,
        order_id: data.orderId,
        items: `Remove watermark - ${invitationerName} invitation`,
        amount: data.amount.toFixed(2),
        currency: data.currency,
        hash: data.hash,
        first_name: "DatezMe",
        last_name: "Customer",
        email: senderEmail || "customer@example.com",
        phone: "0000000000",
        address: "N/A",
        city: "Colombo",
        country: "Sri Lanka",
      });
    } catch (e: any) {
      setPaying(false);
      setError(e.message ?? "Could not start payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Script
        src="https://www.payhere.lk/lib/payhere.js"
        strategy="afterInteractive"
      />
      <SiteWatermark />
      <div className="w-full max-w-md rounded-3xl border border-rosegold/30 bg-white p-6 shadow-xl">
        <h2 className="text-center font-display text-xl font-bold text-wine">
          Choose how to send your invitation
        </h2>
        <p className="mt-1 text-center text-xs text-wine/60">
          For {invitationerName}
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-rosegold/30">
          <div className="grid grid-cols-3 gap-2 border-b border-rosegold/20 bg-blush/50 px-3 py-2 text-[11px] font-medium text-wine">
            <span></span>
            <span className="text-center">Free</span>
            <span className="text-center">Pro</span>
          </div>
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-3 gap-2 border-b border-rosegold/10 px-3 py-2 text-xs last:border-b-0"
            >
              <span className="text-ink">{f.label}</span>
              <span className="text-center">{f.free ? "✓" : "—"}</span>
              <span className="text-center">{f.pro ? "✓" : "—"}</span>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-center text-xs text-red-600">{error}</p>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={onFree}
            disabled={paying}
            className="rounded-full border border-rosegold/40 px-5 py-3 text-sm font-medium text-ink hover:bg-blush"
          >
            Continue Free (with watermark)
          </button>
          <button
            onClick={startPayment}
            disabled={paying}
            className="rounded-full bg-wine px-5 py-3 text-sm font-semibold text-vanilla shadow-glow disabled:opacity-60"
          >
            {paying ? "Opening payment..." : "Remove Watermark — Rs. 300 🔓"}
          </button>
          <button onClick={onClose} className="text-xs text-wine/50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
