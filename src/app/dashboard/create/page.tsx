"use client";

import { useState } from "react";
import {
  AlertCircle, ImagePlus, Sparkles, WandSparkles, FileText,
  Video, Upload, Clapperboard, Info
} from "lucide-react";

type Mode = "text" | "image" | "script";

export default function CreateVideoPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("runway");
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState("5");
  const [resolution, setResolution] = useState("1080p");
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState("");
  const [storyboard, setStoryboard] = useState<any>(null);
  const [planning, setPlanning] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [taskId, setTaskId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const modes = [
    { id: "text" as const, label: "Text to video", icon: WandSparkles, description: "Describe your vision" },
    { id: "image" as const, label: "Image to video", icon: ImagePlus, description: "Animate an image" },
    { id: "script" as const, label: "Script to video", icon: FileText, description: "Build a visual story" },
  ];

  async function handleGenerate() {
    if (!prompt.trim()) {
      setNotice("Please enter a prompt before generating.");
      return;
    }

    if (model !== "runway") {
      setNotice("Runway is the only connected video provider currently.");
      return;
    }

    if (![5, 10].includes(Number(duration))) {
      setNotice("Runway currently supports 5 or 10 seconds per clip.");
      return;
    }

    if (mode === "image") {
      setNotice("Image-to-video upload is not connected yet. Select Text to video or Script to video.");
      return;
    }

    setPlanning(true);
    setNotice("");
    setStoryboard(null);
    setVideoUrl("");
    setTaskId("");
    setGenerationStatus("Submitting your video to Runway...");

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: Number(duration),
          ratio: ratio === "9:16" ? "720:1280" : "1280:720",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Runway could not accept the request.");
      }

      setTaskId(data.taskId);
      setGenerationStatus("Task submitted. Runway is rendering your video...");

      for (let attempt = 0; attempt < 120; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusResponse = await fetch(
          "/api/generations/status?taskId=" + encodeURIComponent(data.taskId),
          { cache: "no-store" }
        );
        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(statusData.error || "Could not retrieve task status.");
        }

        const status = String(statusData.status || "").toUpperCase();

        if (status === "SUCCEEDED") {
          const first = Array.isArray(statusData.output)
            ? statusData.output[0]
            : null;
          const url = typeof first === "string" ? first : first?.url;

          if (!url) {
            throw new Error("Runway completed the task but returned no video URL.");
          }

          setVideoUrl(url);
          setGenerationStatus("Your video is ready!");
          setNotice("Video generated successfully.");
          return;
        }

        if (status === "FAILED" || status === "CANCELED") {
          throw new Error(
            typeof statusData.failure === "string"
              ? statusData.failure
              : "Runway generation " + status.toLowerCase() + "."
          );
        }

        setGenerationStatus("Runway status: " + (status || "PROCESSING") + " · Please wait...");
      }

      setGenerationStatus("Still processing. Your task may continue on Runway.");
      setNotice("Task ID: " + data.taskId + ". Check its status again later.");
    } catch (error) {
      setGenerationStatus("Generation failed.");
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPlanning(false);
    }
  }
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300"><Sparkles size={14} /> AI Video Studio</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Create something extraordinary.</h1>
        <p className="mt-2 text-sm text-slate-400">Shape your idea, choose a model and prepare your video generation.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {modes.map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return <button key={item.id} onClick={() => { setMode(item.id); setNotice(""); }} className={`rounded-2xl border p-4 text-left transition ${active ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
            <div className="flex items-center justify-between"><Icon size={21} className={active ? "text-violet-300" : "text-slate-400"} />{active && <span className="h-2 w-2 rounded-full bg-violet-300" />}</div>
            <p className="mt-4 text-sm font-bold text-white">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.description}</p>
          </button>;
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
          <div>
            <label htmlFor="video-prompt" className="mb-3 block text-sm font-semibold text-white">{mode === "script" ? "Your script" : "Describe your video"}</label>
            <textarea id="video-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={7} placeholder={mode === "script" ? "Paste your script here. Include scenes, dialogue, narration and visual directions..." : mode === "image" ? "Describe how your image should move. Example: slow cinematic camera push-in, flowing hair, gentle sunlight..." : "A cinematic aerial shot of a futuristic city at golden hour, flying vehicles moving between skyscrapers, volumetric lighting, ultra realistic..."} className="w-full resize-y rounded-xl border border-white/10 bg-[#090914] p-4 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-400/50" />
            <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>Be descriptive for better results</span><span>{prompt.length} characters</span></div>
          </div>

          {mode === "image" && (
            <div>
              <label className="mb-3 block text-sm font-semibold text-white">Starting image</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-400/30 bg-violet-500/[0.04] px-5 py-8 text-center transition hover:bg-violet-500/[0.08]">
                <Upload size={23} className="text-violet-300" />
                <span className="mt-3 text-sm font-semibold text-slate-200">{fileName || "Choose an image to animate"}</span>
                <span className="mt-1 text-xs text-slate-500">PNG, JPG or WEBP · upload integration pending</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
          )}

          <div className="rounded-xl border border-white/[0.07] bg-[#090914] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Sparkles size={16} className="text-violet-300" /> Prompt Director</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">A prompt enhancement assistant will help refine camera movement, lighting, style and scene composition once an AI text provider is configured.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Cinematic lighting", "Camera movement", "Visual style", "Scene details"].map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-400">{tag}</span>)}
            </div>
          </div>

          {notice && <div role="status" className="flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-200"><AlertCircle size={16} className="mt-0.5 shrink-0" />{notice}</div>}

          <button disabled={planning} onClick={handleGenerate} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
            {planning ? <><Sparkles size={18} className="animate-spin" /> Generating video...</> : <><Video size={18} /> Generate video <Sparkles size={15} /></>}
          </button>
          <p className="text-center text-[10px] text-slate-600">Runway text-to-video is connected. Each request generates one 5- or 10-second clip.</p>

          {generationStatus && (
            <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.05] p-4">
              <h3 className="text-sm font-bold text-white">Generation status</h3>
              <p className="mt-2 text-xs leading-5 text-slate-300">{generationStatus}</p>
              {taskId && (
                <p className="mt-2 break-all text-[10px] text-slate-500">Task ID: {taskId}</p>
              )}
              {videoUrl && (
                <div className="mt-4 space-y-3">
                  <video controls playsInline src={videoUrl}
                    className="w-full rounded-xl border border-white/10 bg-black" />
                  <a href={videoUrl} target="_blank" rel="noreferrer"
                    className="inline-flex rounded-lg bg-violet-500 px-4 py-2 text-xs font-bold text-white hover:bg-violet-400">
                    Open generated video
                  </a>
                </div>
              )}
            </div>
          )}

          {storyboard && (
            <div className="space-y-3 rounded-xl border border-violet-400/20 bg-violet-500/[0.05] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Your video storyboard</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {storyboard.sceneCount} scenes · {storyboard.totalDurationSeconds} seconds total
                  </p>
                </div>
                <span className="rounded-full border border-violet-400/30 px-3 py-1 text-[10px] text-violet-200">
                  Planning complete
                </span>
              </div>
              <div className="space-y-2">
                {storyboard.scenes.map((scene: {
                  number: number;
                  title: string;
                  startSeconds: number;
                  durationSeconds: number;
                  direction: string;
                  prompt: string;
                }) => (
                  <div key={scene.number} className="rounded-lg border border-white/10 bg-[#090914] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{scene.title}</span>
                      <span className="text-[10px] text-violet-300">
                        {scene.startSeconds}s – {scene.startSeconds + scene.durationSeconds}s
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{scene.direction}</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(scene.prompt)}
                      className="mt-2 text-[10px] text-violet-300 hover:text-violet-200"
                    >
                      Copy scene prompt
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-5 text-amber-200/80">
                This is a scene plan, not a rendered video. Connect a supported video API and rendering worker to generate and merge the clips.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <h2 className="mb-4 text-sm font-bold text-white">Generation settings</h2>
            <label className="mb-2 block text-xs text-slate-400">Video model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="mb-5 w-full rounded-lg border border-white/10 bg-[#090914] p-3 text-xs text-slate-200 outline-none focus:border-violet-400/50">
              <option value="runway">Runway · API setup needed</option>
              <option value="google">Google Veo · API setup needed</option>
              <option value="openai">OpenAI Sora · API setup needed</option>
              <option value="other">Other provider · coming soon</option>
            </select>

            <label className="mb-2 block text-xs text-slate-400">Aspect ratio</label>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {["16:9", "9:16", "1:1"].map((value) => <button key={value} onClick={() => setRatio(value)} className={`rounded-lg border py-2 text-xs ${ratio === value ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-white/10 text-slate-400"}`}>{value}</button>)}
            </div>

            <label className="mb-2 block text-xs text-slate-400">Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mb-5 w-full rounded-lg border border-white/10 bg-[#090914] p-3 text-xs text-slate-200 outline-none">
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds · 1 minute</option>
              <option value="90">90 seconds · 1.5 minutes</option>
              <option value="120">120 seconds · 2 minutes</option>
            </select>

            <label className="mb-2 block text-xs text-slate-400">Resolution</label>
            <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#090914] p-3 text-xs text-slate-200 outline-none">
              <option>720p</option><option>1080p</option><option>4K</option>
            </select>
          </div>

          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200"><Info size={15} /> Provider connection required</div>
            <p className="mt-2 text-[11px] leading-5 text-slate-400">The selected model is a UI option only right now. API availability, supported durations and resolutions must be verified against the connected provider.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-xs text-slate-400">
            <div className="mb-2 flex items-center gap-2 font-semibold text-white"><Clapperboard size={15} className="text-violet-300" /> Current configuration</div>
            <div className="flex justify-between py-1"><span>Mode</span><span className="text-slate-200">{mode}</span></div>
            <div className="flex justify-between py-1"><span>Model</span><span className="text-slate-200">{model}</span></div>
            <div className="flex justify-between py-1"><span>Aspect</span><span className="text-slate-200">{ratio}</span></div>
            <div className="flex justify-between py-1"><span>Duration</span><span className="text-slate-200">{duration}s</span></div>
            <div className="flex justify-between py-1"><span>Resolution</span><span className="text-slate-200">{resolution}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
