
"use client";

import { useState } from "react";
import { CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: {
        error?: { description?: string };
      }) => void) => void;
    };
  }
}

const packages = [
  { id: "starter", name: "Starter", price: "₹199", credits: 200 },
  { id: "creator", name: "Creator", price: "₹499", credits: 600, popular: true },
  { id: "studio", name: "Studio", price: "₹999", credits: 1500 },
];

export default function BillingPage() {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function buy(packageId: string) {
    setBusy(packageId);
    setMessage("");

    try {
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
          document.body.appendChild(script);
        });
      }

      const response = await fetch("/api/billing/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "Could not create order.");

      if (!window.Razorpay) throw new Error("Razorpay checkout unavailable.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "CineForge AI",
        description: `${order.credits} generation credits`,
        order_id: order.orderId,
        handler: async (result: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verify = await fetch("/api/billing/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(result),
            });
            const data = await verify.json();
            if (!verify.ok) throw new Error(data.error || "Payment verification failed.");
            setMessage(data.alreadyPaid ? "Payment was already applied." : `${data.credits} credits added successfully!`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Payment verification failed. Contact support with your payment ID.");
          } finally {
            setBusy("");
          }
        },
        theme: { color: "#8b5cf6" },
      });

      checkout.on("payment.failed", (event) => {
        setMessage(event.error?.description || "Payment failed. Please try again.");
        setBusy("");
      });
      checkout.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start checkout.");
      setBusy("");
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
          <CreditCard size={15} /> Billing & Credits
        </div>
        <h1 className="mt-3 text-3xl font-bold text-white">Power your next creation.</h1>
        <p className="mt-2 text-sm text-slate-400">Purchase generation credits securely with Razorpay.</p>
      </header>

      {message && (
        <div role="status" className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm text-violet-100">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((item) => (
          <section key={item.id} className={`rounded-2xl border p-6 ${item.popular ? "border-violet-400/50 bg-violet-500/[0.08]" : "border-white/10 bg-white/[0.025]"}`}>
            {item.popular && <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">Popular</span>}
            <h2 className="mt-3 text-xl font-bold text-white">{item.name}</h2>
            <p className="mt-4 text-4xl font-black text-white">{item.price}</p>
            <p className="mt-2 text-sm text-slate-400">{item.credits.toLocaleString()} credits</p>
            <button
              disabled={!!busy}
              onClick={() => buy(item.id)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {busy === item.id ? "Opening checkout..." : <><Sparkles size={16} /> Buy credits</>}
            </button>
          </section>
        ))}
      </div>

      <p className="text-xs leading-6 text-slate-500">
        Payments are credited only after server-side signature and captured-payment verification.
        These are one-time credit purchases, not recurring subscriptions.
      </p>
    </main>
  );
}
