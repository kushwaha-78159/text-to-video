"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Film, Plus, Search, Trash2, Archive, RotateCcw, Pencil, Loader2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED";
  updatedAt: string;
  _count: { generations: number };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load projects.");
      setProjects(data.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Create failed.");
      setName("");
      setDescription("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed.");
    } finally {
      setSaving(false);
    }
  }

  async function updateProject(project: Project, patch: Record<string, string>) {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Update failed.");
    await load();
  }

  async function renameProject(project: Project) {
    const next = window.prompt("Enter a new project name:", project.name);
    if (next === null || !next.trim()) return;
    try { await updateProject(project, { name: next.trim() }); }
    catch (e) { setError(e instanceof Error ? e.message : "Rename failed."); }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete "${project.name}"? Its generations will remain in your history.`)) return;
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  const visible = projects.filter((p) =>
    `${p.name} ${p.description ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-white">My projects</h1>
        <p className="mt-2 text-sm text-slate-400">Create and manage your video projects.</p>
      </div>

      <form onSubmit={createProject} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <h2 className="font-bold text-white">Create a project</h2>
        <input required maxLength={80} value={name} onChange={e => setName(e.target.value)}
          placeholder="Project name" className="w-full rounded-xl border border-white/10 bg-[#090914] p-3 text-sm text-white outline-none focus:border-violet-400" />
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          maxLength={500} rows={2} placeholder="Description (optional)"
          className="w-full rounded-xl border border-white/10 bg-[#090914] p-3 text-sm text-white outline-none focus:border-violet-400" />
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Create project
        </button>
      </form>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
        <Search size={16} className="text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16 text-violet-300"><Loader2 className="animate-spin" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 text-center">
          <Film size={28} className="mx-auto text-violet-300" />
          <h2 className="mt-4 font-bold text-white">{search ? "No matching projects" : "No projects yet"}</h2>
          <p className="mt-2 text-xs text-slate-500">Create a project above to organize your generations.</p>
          <Link href="/dashboard/create" className="mt-4 inline-flex text-xs font-semibold text-violet-300">Go to video studio →</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map(project => (
            <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300"><Film /></div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400">{project.status}</span>
              </div>
              <h2 className="mt-4 font-bold text-white">{project.name}</h2>
              <p className="mt-1 min-h-8 text-xs text-slate-400">{project.description || "No description"}</p>
              <p className="mt-3 text-[11px] text-slate-500">{project._count.generations} generations · Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => void renameProject(project)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300"><Pencil size={13} /> Rename</button>
                <button onClick={() => void updateProject(project, { status: project.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE" }).catch(e => setError(e.message))}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
                  {project.status === "ACTIVE" ? <Archive size={13} /> : <RotateCcw size={13} />}
                  {project.status === "ACTIVE" ? "Archive" : "Restore"}
                </button>
                <button onClick={() => void deleteProject(project)} className="inline-flex items-center gap-1 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"><Trash2 size={13} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
