import { Activity, Cpu, ExternalLink, Sparkles } from "lucide-react";

const providers = [
  { name: "Runway", type: "Video generation", detail: "Video generation API connection", state: "Not configured" },
  { name: "Google", type: "Video & language models", detail: "Gemini / Veo provider connection", state: "Not configured" },
  { name: "OpenAI", type: "Language & video models", detail: "OpenAI API connection", state: "Not configured" },
  { name: "Anthropic", type: "Language models", detail: "Claude API connection", state: "Not configured" },
  { name: "DeepSeek", type: "Language models", detail: "DeepSeek API connection", state: "Not configured" },
  { name: "Groq", type: "Fast language inference", detail: "Groq API connection", state: "Not configured" },
];

export default function ModelsPage() {
  return <div className="space-y-7">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Integrations</p><h1 className="mt-2 text-3xl font-bold text-white">AI models & providers</h1><p className="mt-2 text-sm text-slate-400">Manage the AI services that power your creative workflow.</p></div>
    <div className="flex gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4"><Activity size={18} className="mt-0.5 shrink-0 text-amber-300" /><p className="text-xs leading-5 text-slate-400"><strong className="text-amber-200">No providers connected.</strong> These are integration targets, not active connections. Add API credentials securely on the server before using them.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      {providers.map((provider) => <div key={provider.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300"><Cpu size={20} /></div><span className="rounded-full border border-amber-400/20 bg-amber-400/[0.05] px-2.5 py-1 text-[9px] font-semibold text-amber-200">{provider.state}</span></div>
        <h2 className="mt-4 font-bold text-white">{provider.name}</h2><p className="mt-1 text-xs text-violet-300">{provider.type}</p><p className="mt-3 text-xs text-slate-500">{provider.detail}</p>
      </div>)}
    </div>
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"><div className="flex items-center gap-2 text-sm font-bold text-white"><Sparkles size={16} className="text-violet-300" /> Smart model routing</div><p className="mt-2 text-xs leading-5 text-slate-400">Automatic routing by capability, cost, latency and availability will activate after provider adapters and health checks are implemented.</p></div>
  </div>;
}
