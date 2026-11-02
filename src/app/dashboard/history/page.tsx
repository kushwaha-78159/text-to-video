import { Clock3, Film } from "lucide-react";

export default function HistoryPage() {
  return <div className="space-y-7">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Activity</p><h1 className="mt-2 text-3xl font-bold text-white">Generation history</h1><p className="mt-2 text-sm text-slate-400">Track your submitted video generation jobs.</p></div>
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="flex items-center gap-2 border-b border-white/[0.07] pb-4"><Clock3 size={17} className="text-violet-300" /><h2 className="text-sm font-bold text-white">Recent generations</h2></div>
      <div className="flex flex-col items-center py-16 text-center"><Film size={28} className="text-slate-600" /><p className="mt-4 text-sm font-semibold text-slate-300">No generation history</p><p className="mt-2 text-xs text-slate-500">When real generation jobs are connected, their status will appear here.</p></div>
    </div>
  </div>;
}
