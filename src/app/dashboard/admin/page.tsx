"use client";

import { useEffect, useState } from "react";
import { Activity, Users, Film, FolderKanban, RefreshCw, ShieldCheck } from "lucide-react";

type Data = {
  stats: { users: number; projects: number; generations: number; completed: number; failed: number; totalCredits: number };
  users: { id: string; name: string | null; email: string; role: string; credits: number; createdAt: string }[];
  jobs: { id: string; prompt: string; status: string; createdAt: string; user: { email: string } }[];
};

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load admin dashboard.");
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId: string, role: string) {
    if (!confirm(`Change this user's role to ${role}?`)) return;
    const response = await fetch("/api/admin", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const result = await response.json();
    if (!response.ok) return alert(result.error || "Role update failed.");
    await load();
  }

  useEffect(() => { void load(); }, []);

  const stats = data?.stats;
  const cards = [
    { label: "Users", value: stats?.users ?? 0, icon: Users },
    { label: "Projects", value: stats?.projects ?? 0, icon: FolderKanban },
    { label: "Generations", value: stats?.generations ?? 0, icon: Film },
    { label: "Completed", value: stats?.completed ?? 0, icon: Activity },
  ];

  return <div className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Control center</p><h1 className="mt-2 text-3xl font-bold text-white">Admin dashboard</h1><p className="mt-2 text-sm text-slate-400">Platform usage, users and generation activity.</p></div>
      <button onClick={load} disabled={loading} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white"><RefreshCw size={15} /> Refresh</button>
    </div>
    {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
    {loading && !data && <p className="text-sm text-slate-400">Loading admin data…</p>}
    {data && <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><card.icon size={20} className="text-violet-300" /><p className="mt-4 text-xs text-slate-400">{card.label}</p><p className="mt-1 text-3xl font-bold text-white">{card.value.toLocaleString()}</p></div>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-slate-400">Failed jobs</p><p className="mt-2 text-2xl font-bold text-red-300">{stats?.failed}</p></div>
        <div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-slate-400">Total user credits</p><p className="mt-2 text-2xl font-bold text-white">{stats?.totalCredits}</p></div>
        <div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-slate-400">Completed jobs</p><p className="mt-2 text-2xl font-bold text-emerald-300">{stats?.completed}</p></div>
      </div>
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-white"><ShieldCheck size={18} className="text-violet-300" /> User management</h2>
        <div className="space-y-3">{data.users.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] py-3">
          <div><p className="text-sm font-semibold text-white">{user.name || "Unnamed user"}</p><p className="text-xs text-slate-400">{user.email} · {user.credits} credits</p></div>
          <div className="flex items-center gap-2"><span className="text-xs text-slate-400">{user.role}</span><button onClick={() => changeRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")} className="rounded-lg border border-violet-400/20 px-3 py-2 text-xs text-violet-200">{user.role === "ADMIN" ? "Make user" : "Make admin"}</button></div>
        </div>)}</div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-4 font-bold text-white">Recent generations</h2>
        <div className="space-y-3">{data.jobs.map((job) => <div key={job.id} className="border-b border-white/[0.06] py-3"><p className="line-clamp-2 text-sm text-white">{job.prompt}</p><p className="mt-1 text-xs text-slate-500">{job.user.email} · {job.status} · {new Date(job.createdAt).toLocaleString()}</p></div>)}</div>
      </section>
    </>}
  </div>;
}
