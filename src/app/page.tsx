"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioWaveform, Check,
  ChevronDown, Clapperboard, Command, Cpu, Film, Globe2,
  ImagePlus, Layers3, Menu, Play, Sparkles, WandSparkles,
  Zap, X, Shield, Video, Wand2
} from "lucide-react";
import { useState } from "react";

const HeroScene = dynamic(() => import("@/components/hero-scene"), {
  ssr: false,
  loading: () => <div className="hero-scene scene-loading" />,
});

const features = [
  { icon: WandSparkles, number: "01", title: "AI Prompt Director", desc: "Turn a simple thought into a detailed cinematic vision. Get camera directions, lighting, scenes and professional prompts." },
  { icon: Clapperboard, number: "02", title: "Text to Video", desc: "Transform written ideas into cinematic video using compatible connected generation models." },
  { icon: ImagePlus, number: "03", title: "Image to Motion", desc: "Bring still images to life with motion, camera movement and creative direction." },
  { icon: Layers3, number: "04", title: "Multi-scene Stories", desc: "Build scene-by-scene storyboards and organize your creative projects in one workspace." },
  { icon: AudioWaveform, number: "05", title: "Creative Intelligence", desc: "Generate scripts, visual concepts, shot lists and ideas with multiple AI assistants." },
  { icon: Cpu, number: "06", title: "Model Intelligence", desc: "Compare connected models by supported capabilities, quality, speed and available pricing." },
];

const models = [
  { name: "OpenAI", type: "Creative intelligence", color: "model-purple", initials: "O" },
  { name: "Google Gemini", type: "Multimodal intelligence", color: "model-blue", initials: "G" },
  { name: "Anthropic Claude", type: "Storytelling & scripts", color: "model-orange", initials: "C" },
  { name: "Runway", type: "Video generation gateway", color: "model-green", initials: "R" },
  { name: "DeepSeek", type: "Reasoning & optimization", color: "model-cyan", initials: "D" },
  { name: "Groq", type: "Fast AI inference", color: "model-pink", initials: "G" },
];

const steps = [
  ["01", "Describe your vision", "Start with an idea, script or reference image."],
  ["02", "Let AI direct", "Refine your prompt, storyboard scenes and select a suitable model."],
  ["03", "Create your film", "Submit a generation job and follow its progress in your workspace."],
  ["04", "Export & share", "Preview completed videos and download available results."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        THE FUTURE OF CREATIVE PRODUCTION IS HERE
        <span className="announcement-sep">/</span>
        <span className="announcement-link">EXPLORE CINEFORGE <ArrowUpRight size={12} /></span>
      </div>

      <header className="navbar">
        <Link href="/" className="brand">
          <span className="brand-mark"><Command size={21} /></span>
          <span>CINEFORGE<span className="brand-ai">.AI</span></span>
        </Link>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Platform</a>
          <a href="#models" onClick={() => setMenuOpen(false)}>AI Models</a>
          <a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <Link href="/dashboard" className="mobile-cta">Launch Studio <ArrowUpRight size={15} /></Link>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">Sign in</Link>
          <Link href="/dashboard" className="nav-cta">Launch Studio <ArrowUpRight size={15} /></Link>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="about">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-copy">
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="eyebrow-icon"><Sparkles size={13} /></span>
            THE NEXT DIMENSION OF VIDEO CREATION
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1 }}>
            Your imagination.<br />
            <span className="gradient-text">Without limits.</span>
          </motion.h1>

          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            From a single thought to a cinematic universe. Meet your AI-powered creative studio, built to turn the impossible into moving pictures.
          </motion.p>

          <motion.div className="hero-buttons" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Link href="/dashboard" className="primary-button">Create your first video <ArrowUpRight size={17} /></Link>
            <a href="#features" className="secondary-button"><Play size={15} /> Explore the platform</a>
          </motion.div>

          <div className="hero-proof">
            <div className="proof-icon"><Zap size={15} /></div>
            <span>One creative space.</span>
            <span className="proof-divider" />
            <span>Multiple AI possibilities.</span>
          </div>
        </div>

        <div className="hero-visual">
          <HeroScene />
          <div className="scene-label scene-label-top"><span className="live-dot" /> CREATIVE CORE <span>01 / 04</span></div>
          <div className="scene-label scene-label-bottom">GENERATIVE INTELLIGENCE <span>✳</span></div>
          <div className="float-card float-card-top"><span className="float-card-icon"><Sparkles size={15} /></span><div><strong>AI Director</strong><small>Creative intelligence</small></div><span className="float-status">READY</span></div>
          <div className="float-card float-card-bottom"><div className="wave-bars">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ height: `${12 + ((i * 17) % 27)}px` }} />)}</div><div><strong>Ideas in motion</strong><small>Imagine something new</small></div></div>
        </div>

        <div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span><span>BUILT FOR THE NEXT GENERATION OF CREATORS</span></div>
      </section>

      <section className="trust-strip">
        <span className="trust-label">ONE WORKSPACE. MANY INTELLIGENCES.</span>
        <div className="trust-logos"><span>OPENAI</span><span>GOOGLE</span><span>ANTHROPIC</span><span>RUNWAY</span><span>DEEPSEEK</span><span>GROQ</span></div>
      </section>

      <section className="section features-section" id="features">
        <div className="section-heading">
          <div><div className="section-kicker"><span /> THE CREATIVE ENGINE</div><h2>Everything you need.<br /><span className="muted-gradient">Nothing holding you back.</span></h2></div>
          <p>One intelligent platform connecting your ideas to the tools, models and creative workflows that bring them to life.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return <motion.article className="feature-card" key={feature.number} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <div className="feature-top"><span className="feature-icon"><Icon size={21} /></span><span className="feature-number">{feature.number}</span></div>
              <h3>{feature.title}</h3><p>{feature.desc}</p>
              <div className="feature-arrow"><ArrowUpRight size={17} /></div>
            </motion.article>;
          })}
        </div>
      </section>

      <section className="director-section">
        <div className="director-grid" />
        <div className="director-copy">
          <div className="section-kicker"><span /> MEET YOUR CREATIVE PARTNER</div>
          <h2>Think like a creator.<br /><span className="gradient-text">Direct like a filmmaker.</span></h2>
          <p>Meet AI Director — your creative co-pilot that transforms raw ideas into production-ready prompts, scene plans and cinematic direction.</p>
          <ul className="director-list">
            <li><Check size={16} /> Intelligent prompt enhancement</li>
            <li><Check size={16} /> Scene-by-scene storyboarding</li>
            <li><Check size={16} /> Camera, lighting and style suggestions</li>
            <li><Check size={16} /> Model recommendations for your task</li>
          </ul>
          <Link href="/dashboard" className="text-link">Explore AI Director <ArrowRight size={16} /></Link>
        </div>
        <div className="director-preview">
          <div className="preview-top"><span><Sparkles size={14} /> CREATIVE DIRECTOR</span><span className="preview-ready">● READY</span></div>
          <div className="preview-prompt"><small>YOUR ORIGINAL IDEA</small><p>A lone astronaut discovers a glowing garden on an abandoned planet.</p></div>
          <div className="preview-divider"><span /> AI ENHANCED CONCEPT</div>
          <div className="preview-result"><div className="result-icon"><Wand2 size={17} /></div><p>A cinematic wide-angle shot of a solitary astronaut stepping into an ethereal bioluminescent garden, alien flora illuminating the ancient ruins, volumetric blue light, atmospheric particles, slow dolly-in camera movement, photorealistic science fiction cinematography.</p></div>
          <div className="preview-tags"><span>WIDE ANGLE</span><span>VOLUMETRIC LIGHT</span><span>SCI-FI</span><span>DOLLY IN</span></div>
          <div className="preview-footer"><span><Shield size={13} /> Creative suggestion preview</span><span>EDITABLE CONCEPT</span></div>
        </div>
      </section>

      <section className="section models-section" id="models">
        <div className="section-heading">
          <div><div className="section-kicker"><span /> MULTI-MODEL INTELLIGENCE</div><h2>Different minds.<br /><span className="muted-gradient">One creative universe.</span></h2></div>
          <p>Connect your preferred AI providers. Choose a model manually or let the intelligent router recommend a compatible option.</p>
        </div>
        <div className="models-grid">
          {models.map((model, i) => <motion.div className="model-card" key={model.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <div className={`model-symbol ${model.color}`}>{model.initials}</div><div className="model-info"><h3>{model.name}</h3><p>{model.type}</p></div><span className="model-arrow"><ArrowUpRight size={17} /></span>
          </motion.div>)}
        </div>
        <p className="model-note">Provider availability depends on configured API credentials, model access and task compatibility. Video generation is enabled only for connected supported models.</p>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="section-kicker"><span /> FROM IDEA TO IMPACT</div>
        <h2>Four steps. <span className="gradient-text">Infinite stories.</span></h2>
        <div className="workflow-grid">
          {steps.map(([number, title, desc]) => <div className="workflow-step" key={number}><span className="workflow-number">{number}</span><div className="workflow-line" /><h3>{title}</h3><p>{desc}</p></div>)}
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-orb" />
        <div className="section-kicker"><span /> YOUR NEXT STORY STARTS HERE</div>
        <h2>Make something<br /><span className="gradient-text">worth watching.</span></h2>
        <p>Your ideas deserve more than a blank screen. Give them a universe.</p>
        <Link href="/dashboard" className="primary-button">Enter the creative studio <ArrowUpRight size={17} /></Link>
        <span className="cta-caption">CINEFORGE AI · IMAGINE WITHOUT LIMITS</span>
      </section>

      <footer className="footer">
        <Link href="/" className="brand"><span className="brand-mark"><Command size={19} /></span><span>CINEFORGE<span className="brand-ai">.AI</span></span></Link>
        <span>© 2026 CINEFORGE AI. BUILT FOR CREATIVE MINDS.</span>
        <div><a href="#features">Platform</a><a href="#models">Models</a><a href="#workflow">Workflow</a></div>
      </footer>
    </main>
  );
}
