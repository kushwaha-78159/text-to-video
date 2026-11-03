"use client";

import { useEffect, useState } from "react";
import { Bell, Save, UserRound, SlidersHorizontal, Loader2, ShieldCheck } from "lucide-react";

type SettingsData = {
  profile: { name: string | null; email: string; credits: number; createdAt: string };
  settings: { theme: string; defaultAspectRatio: string; notifications: boolean };
};

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [ratio, setRatio] = useState("16:9");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Could not load settings.");
        setData(d);
        setName(d.profile.name || "");
        setTheme(d.settings.theme);
        setRatio(d.settings.defaultAspectRatio);
        setNotifications(d.settings.notifications);
      })
      .catch(e => setMessage(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme, defaultAspectRatio: ratio, notifications }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setData(old => old ? { ...old, profile: { ...old.profile, name: result.profile.name } } : old);
      setMessage("Settings saved successfully.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20 text-violet-300"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your account and creative preferences.</p>
      </div>

      {message && <p role="status" className="rounded-xl border border-violet-400/20 bg-violet-500/5 p-3 text-sm text-violet-200">{message}</p>}

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center gap-3"><UserRound className="text-violet-300" /><h2 className="font-bold text-white">Profile</h2></div>
        <label className="block text-xs text-slate-400">Display name</label>
        <input value={name} onChange={e => setName(e.target.value)} maxLength={60}
          className="w-full rounded-xl border border-white/10 bg-[#090914] p-3 text-sm text-white outline-none focus:border-violet-400" />
        <div className="text-xs text-slate-500">Email: {data?.profile.email}</div>
        <div className="text-xs text-slate-500">Available credits: {data?.profile.credits}</div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center gap-3"><SlidersHorizontal className="text-violet-300" /><h2 className="font-bold text-white">Preferences</h2></div>
        <label className="block text-xs text-slate-400">Theme preference</label>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090914] p-3 text-sm text-white">
          <option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option>
        </select>
        <label className="block text-xs text-slate-400">Default aspect ratio</label>
        <select value={ratio} onChange={e => setRatio(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090914] p-3 text-sm text-white">
          <option value="16:9">Landscape · 16:9</option><option value="9:16">Portrait · 9:16</option><option value="1:1">Square · 1:1</option>
        </select>
      </section>

      <section className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center gap-3"><Bell className="text-violet-300" /><div><h2 className="font-bold text-white">Notifications</h2><p className="mt-1 text-xs text-slate-500">Save your notification preference.</p></div></div>
        <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="h-5 w-5 accent-violet-500" />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center gap-3"><ShieldCheck className="text-violet-300" /><h2 className="font-bold text-white">Security</h2></div>
        <p className="mt-2 text-xs leading-5 text-slate-400">Your account is protected by the current sign-in session. Password reset, email verification and session management are not implemented yet.</p>
      </section>

      <button onClick={() => void save()} disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-500 disabled:opacity-50">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save settings
      </button>
    </div>
  );
}
