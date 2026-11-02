import Link from "next/link";
import { Film, Plus, Search } from "lucide-react";

export default function ProjectsPage() {
  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Workspace</p><h1 className="mt-2 text-3xl font-bold text-white">My projects</h1><p className="mt-2 text-sm text-slate-400">Manage your video projects and creative work.</p></div>
      <Link href="/dashboard/create" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white hover:bg-violet-500"><Plus size={16} /> New project</Link>
    </div>
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-slate-500"><Search size={16} /><span className="text-xs">Project search will be available when project storage is connected.</span></div>
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300"><Film size={25} /></div>
      <h2 className="mt-4 font-bold text-white">No projects yet</h2><p className="mt-2 text-xs text-slate-500">Your saved projects will appear here.</p>
      <Link href="/dashboard/create" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white">Create your first video <Plus size={14} /></Link>
    </div>
  </div>;
}
