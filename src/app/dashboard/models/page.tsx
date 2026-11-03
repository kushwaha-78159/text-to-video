"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, RefreshCw, ShieldCheck } from "lucide-react";

type Provider = { id: string; name: string; configured: boolean; capabilities: string[]; status: string };
export default function ModelsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/models", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load provider status.");
      setProviders(data.providers || []);
      setNote(data.note || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load providers.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  return <div className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Integrations</p><h1 className="mt-2 text-3xl font-bold text-white">AI models & providers</h1><p className="mt-2 text-sm text-slate-400">Server-side environment configuration status.</p></div><button onClick={load} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white"><RefreshCw size={15}/> Refresh</button></div>
    {error && <p className="rounded-xl border border-red-400/20 p-4 text-sm text-red-200">{error}</p>}
    {loading && <p className="text-sm text-slate-400">Checking configuration…</p>}
    <div className="grid gap-4 md:grid-cols-2">
      {providers.map((provider) => <div key={provider.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300"><Cpu size={20}/></div><span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${provider.configured ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-200" : "border-amber-400/20 bg-amber-400/5 text-amber-200"}`}>{provider.configured ? "KEY CONFIGURED" : "NOT CONFIGURED"}</span></div>
        <h2 className="mt-4 font-bold text-white">{provider.name}</h2><p className="mt-2 text-xs text-slate-400">Capabilities: {provider.capabilities.join(", ")}</p>
      </div>)}
    </div>
    <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-200"><Activity size={15}/> Important</div><p className="mt-2 text-xs leading-5 text-slate-400">{note} Only Runway text-to-video is currently wired into the generation submission API. Other configured keys are not automatically video-generation integrations.</p></div>
    <div className="rounded-2xl border border-white/10 p-5"><div className="flex items-center gap-2 text-sm font-bold text-white"><ShieldCheck size={16} className="text-violet-300"/> Credential safety</div><p className="mt-2 text-xs text-slate-400">Secret values are never returned by this endpoint. Keep credentials in server-side environment variables, not NEXT_PUBLIC variables.</p></div>
  </div>;
}
