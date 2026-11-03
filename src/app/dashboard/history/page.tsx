import { Clock3, Film, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function HistoryPage() {
  const session = await getSession();

  const generations = session
    ? await prisma.videoGeneration.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          prompt: true,
          status: true,
          duration: true,
          aspectRatio: true,
          outputUrl: true,
          errorMessage: true,
          creditsUsed: true,
          createdAt: true,
        },
      })
    : [];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Activity</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Generation history</h1>
        <p className="mt-2 text-sm text-slate-400">Your latest video generation jobs.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 border-b border-white/[0.07] pb-4">
          <Clock3 size={17} className="text-violet-300" />
          <h2 className="text-sm font-bold text-white">Recent generations ({generations.length})</h2>
        </div>

        {generations.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Film size={28} className="text-slate-600" />
            <p className="mt-4 text-sm font-semibold text-slate-300">No generation history yet</p>
            <p className="mt-2 text-xs text-slate-500">Your submitted video jobs will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.07]">
            {generations.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-white">{item.prompt}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {item.duration}s · {item.aspectRatio} · {item.creditsUsed} credits · {item.createdAt.toLocaleString()}
                  </p>
                  {item.errorMessage && <p className="mt-1 text-xs text-red-300">{item.errorMessage}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-300" :
                    item.status === "FAILED" || item.status === "CANCELLED" ? "bg-red-500/10 text-red-300" :
                    "bg-violet-500/10 text-violet-300"
                  }`}>{item.status}</span>
                  {item.outputUrl && (
                    <a href={item.outputUrl} target="_blank" rel="noreferrer" className="text-violet-300 hover:text-white" aria-label="Open generated video">
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
