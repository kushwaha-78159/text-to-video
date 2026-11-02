import Link from "next/link";
import {
  ArrowUpRight, Clock3, Film, FolderOpen, Plus, Sparkles,
  Video, WandSparkles, Zap
} from "lucide-react";

const stats = [
  { label: "Total projects", value: "0", note: "Your projects will appear here", icon: FolderOpen },
  { label: "Videos generated", value: "0", note: "No generations yet", icon: Video },
  { label: "AI credits used", value: "0", note: "Usage tracking not connected", icon: Zap },
];

const quickActions = [
  { title: "Text to video", desc: "Transform a written idea into a cinematic video.", icon: WandSparkles, href: "/dashboard/create", tag: "Popular" },
  { title: "Image to video", desc: "Bring your still images to life with motion.", icon: Film, href: "/dashboard/create", tag: "Creative" },
  { title: "Script to video", desc: "Turn a complete script into a visual story.", icon: Sparkles, href: "/dashboard/create", tag: "AI Director" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-9">
      <section className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#24134c] via-[#15112d] to-[#0c1930] p-7 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
            <Sparkles size={13} /> Your AI creative studio
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">Imagine it.<br /><span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">Forge it into reality.</span></h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">Create cinematic videos from text, images and scripts. Your next story starts with one idea.</p>
          <Link href="/dashboard/create" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#171127] transition hover:bg-violet-100">
            <Plus size={17} /> Create a video <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-400">{stat.label}</span><Icon size={18} className="text-violet-300" /></div>
            <div className="mt-4 text-3xl font-bold text-white">{stat.value}</div>
            <p className="mt-1 text-[11px] text-slate-500">{stat.note}</p>
          </div>;
        })}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Get started</p><h2 className="mt-2 text-2xl font-bold text-white">What will you create today?</h2></div>
          <Link href="/dashboard/create" className="hidden items-center gap-1 text-xs font-semibold text-violet-300 hover:text-white sm:flex">Open studio <ArrowUpRight size={14} /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return <Link key={item.title} href={item.href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/[0.06]">
              <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={21} /></div><span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-slate-400">{item.tag}</span></div>
              <h3 className="mt-5 font-bold text-white">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{item.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-violet-300">Start creating <ArrowUpRight size={14} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
            </Link>;
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <div className="flex items-center gap-3"><Clock3 size={18} className="text-slate-400" /><h2 className="font-bold text-white">Recent activity</h2></div>
        <div className="flex flex-col items-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500"><Film size={24} /></div>
          <p className="mt-4 text-sm font-semibold text-slate-300">Your creative timeline is empty</p>
          <p className="mt-1 text-xs text-slate-500">Generated videos and projects will show up here.</p>
        </div>
      </section>
    </div>
  );
}
