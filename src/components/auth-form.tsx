"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Loader2, ArrowRight } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080812] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600"><Film /></span>
          <span className="text-2xl font-black tracking-tight">CineForge <span className="text-violet-400">AI</span></span>
        </Link>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-violet-950/20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">{signup ? "Create your account" : "Welcome back"}</p>
          <h1 className="mt-3 text-3xl font-bold">{signup ? "Start creating" : "Sign in to CineForge"}</h1>
          <p className="mt-2 text-sm text-slate-400">{signup ? "Create an account and get started with AI video." : "Continue to your video creation workspace."}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {signup && <input required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500" />}
            <input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500" />
            <input required minLength={8} maxLength={72} type="password" autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (minimum 8 characters)" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500" />
            {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-bold transition hover:bg-violet-500 disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>{signup ? "Create account" : "Sign in"} <ArrowRight size={18} /></>}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            {signup ? "Already have an account? " : "New to CineForge? "}
            <Link className="font-semibold text-violet-300 hover:text-violet-200" href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create account"}</Link>
          </p>
        </div>
        <Link href="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-white">← Back to home</Link>
      </div>
    </main>
  );
}
