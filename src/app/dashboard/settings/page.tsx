import { Bell, KeyRound, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";

const sections = [
  { title: "Profile", description: "Your account name and profile preferences.", icon: UserRound },
  { title: "API connections", description: "Secure server-side provider credentials and integration status.", icon: KeyRound },
  { title: "Preferences", description: "Default video format, resolution and creative preferences.", icon: SlidersHorizontal },
  { title: "Notifications", description: "Generation completion and project update notifications.", icon: Bell },
  { title: "Security", description: "Authentication, sessions and account security controls.", icon: ShieldCheck },
];

export default function SettingsPage() {
  return <div className="space-y-7">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Workspace</p><h1 className="mt-2 text-3xl font-bold text-white">Settings</h1><p className="mt-2 text-sm text-slate-400">Manage your CineForge AI workspace.</p></div>
    <div className="space-y-3">
      {sections.map((section) => {
        const Icon = section.icon;
        return <div key={section.title} className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300"><Icon size={20} /></div>
          <div className="min-w-0 flex-1"><h2 className="text-sm font-bold text-white">{section.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{section.description}</p></div>
          <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-slate-500">Coming next</span>
        </div>;
      })}
    </div>
    <p className="text-[11px] text-slate-600">Settings are currently a UI preview. Persistent account settings will be added with authentication and database integration.</p>
  </div>;
}
