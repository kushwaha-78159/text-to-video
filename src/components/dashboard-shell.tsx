"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Clapperboard, Clock3, Film, Gauge, LayoutDashboard, ShieldCheck,
  Menu, Settings2, Sparkles, WandSparkles, X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Create video", href: "/dashboard/create", icon: WandSparkles },
  { label: "My projects", href: "/dashboard/projects", icon: Film },
  { label: "History", href: "/dashboard/history", icon: Clock3 },
  { label: "AI models", href: "/dashboard/models", icon: Gauge },
  { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
  { label: "Admin", href: "/dashboard/admin", icon: ShieldCheck },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/30">
          <Clapperboard size={21} />
        </span>
        <span className="text-lg font-bold tracking-tight text-white">CineForge<span className="text-violet-400">.</span></span>
      </Link>

      <div className="px-4 pb-3 pt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Workspace</div>
      <nav className="space-y-1 px-3">
        {navigation.map((item) => {
          const active = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "border border-violet-400/20 bg-violet-500/15 font-semibold text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-violet-300" : ""} />
              {item.label}
              {item.label === "Create video" && <span className="ml-auto rounded-md bg-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-violet-300">AI</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={16} className="text-violet-300" /> AI Studio
          </div>
          <p className="text-xs leading-5 text-slate-400">Your creative workspace for AI-powered video production.</p>
          <Link href="/dashboard/create" className="mt-4 block rounded-lg bg-violet-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-violet-400">
            Start creating
          </Link>
        </div>
        <div className="mt-4 flex items-center gap-2 px-2 text-[11px] text-slate-600">
          <Activity size={13} /> CineForge AI · Preview
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070711] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.07] bg-[#0b0b17] lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/70" />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-white/10 bg-[#0b0b17]">
            <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 z-10 rounded-lg p-2 text-slate-400"><X size={20} /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#090914]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"><Menu size={19} /></button>
            <div>
              <p className="text-sm font-semibold text-white">Creative workspace</p>
              <p className="hidden text-[11px] text-slate-500 sm:block">Turn your ideas into cinematic videos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-semibold text-amber-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Preview mode
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/15 text-xs font-bold text-violet-200">CF</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
