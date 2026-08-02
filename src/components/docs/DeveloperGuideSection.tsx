import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  GitBranch, 
  Bot, 
  Copy, 
  Check, 
  Layers, 
  Workflow, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Code2
} from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface DevGuideProps {
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
}

export interface DevChapter {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  color: string;
  content: React.ReactNode;
}

export const DEV_CHAPTERS: { id: string; title: string; icon: any }[] = [
  { id: 'quickstart', title: '1. Environment & Setup', icon: Terminal },
  { id: 'wasm-architecture', title: '2. PGlite WASM Architecture', icon: Cpu },
  { id: 'git-workflow', title: '3. Branching & Quality Gates', icon: GitBranch },
  { id: 'ai-collaboration', title: '4. AI CLI (AGY) & Agent Team', icon: Bot }
];

export const DeveloperGuideSection: React.FC<DevGuideProps> = ({ selectedChapterId, onSelectChapter }) => {
  const currentIndex = DEV_CHAPTERS.findIndex(c => c.id === selectedChapterId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    SoundManager.playPop();
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const teamAgents = [
    { name: 'Winston 📐', role: 'System Architect', area: 'PGlite WASM, Comlink Worker RPC & State Slices' },
    { name: 'Sally 🎨', role: 'UX & Visual Lead', area: 'Glassmorphism, Tailwind v4 Theme & Layouts' },
    { name: 'Eleanor 🌿', role: 'Empathy Strategist', area: 'Eleanor\'s Log, Gravity Wells & Tone' },
    { name: 'Amelia 💻', role: 'Lead Developer', area: 'Component Logic & Feature Story Execution' },
    { name: 'Murat 🛡️', role: 'QA Engineer', area: 'Vitest Unit Suite & Data Integrity Gates' },
    { name: 'John 🚀', role: 'Product Manager', area: 'PRD Requirements & Version Release Notes' }
  ];

  const chapters: DevChapter[] = [
    {
      id: 'quickstart',
      badge: 'Quickstart',
      title: '1. Environment Setup & Prerequisites',
      subtitle: 'How to install, configure environment keys, and spin up the local dev environment.',
      color: 'text-primary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 text-sm">
            <span className="font-bold text-white">System Prerequisites:</span> Node.js &gt;= 20.0.0, npm &gt;= 10.0.0.
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Terminal Onboarding Steps</h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Step 1: Clone Repository</h4>
                  <button 
                    onClick={() => copyToClipboard('git clone https://github.com/charnithicrafts-design/Space-Clocker.git && cd Space-Clocker', 'clone')}
                    className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    {copiedCode === 'clone' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode === 'clone' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-primary">
                  git clone https://github.com/charnithicrafts-design/Space-Clocker.git<br/>
                  cd Space-Clocker
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Step 2: Install Dependencies</h4>
                  <button 
                    onClick={() => copyToClipboard('npm install', 'install')}
                    className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    {copiedCode === 'install' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode === 'install' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-primary">
                  npm install
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Step 3: Launch Local Dev Server (http://localhost:3000)</h4>
                  <button 
                    onClick={() => copyToClipboard('npm run dev', 'dev')}
                    className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    {copiedCode === 'dev' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode === 'dev' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-primary">
                  npm run dev
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wasm-architecture',
      badge: 'Architecture',
      title: '2. Local-First PGlite WASM Architecture',
      subtitle: 'Understanding thread isolation, Comlink RPC worker proxy, and OPFS storage.',
      color: 'text-secondary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Space-Clocker uses <strong>PGlite (Postgres-in-WASM)</strong> running inside a dedicated Web Worker thread to ensure zero UI frame drops during complex telemetry aggregations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-primary flex items-center gap-2 text-sm">
                <Layers size={16} /> 1. React 19 UI
              </div>
              <p className="text-on-surface-variant">
                Components invoke store actions (`useTrackStore`). Public pages skip DB boot to conserve memory.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-secondary flex items-center gap-2 text-sm">
                <Workflow size={16} /> 2. Comlink RPC Bridge
              </div>
              <p className="text-on-surface-variant">
                `src/db/client.ts` proxies async SQL queries to worker thread over MessageChannel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-tertiary flex items-center gap-2 text-sm">
                <Cpu size={16} /> 3. PGlite WASM Worker
              </div>
              <p className="text-on-surface-variant">
                `src/db/db.worker.ts` executes raw PostgreSQL SQL queries with OPFS file system persistence.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'git-workflow',
      badge: 'Quality Gates',
      title: '3. Branching & Quality Gates',
      subtitle: 'Branch conventions, conventional commits, and pre-submission test verification.',
      color: 'text-tertiary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Branching & Conventional Commits</h3>
            <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-on-surface-variant space-y-1.5">
              <div><span className="text-primary font-bold">git checkout -b feat/orbit-recalibrate-audio</span></div>
              <div><span className="text-primary font-bold">git commit -m "feat(orbit): add recalibrate audio trigger"</span></div>
              <div><span className="text-primary font-bold">git commit -m "fix(worker): resolve COALESCE date aggregation"</span></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Pre-Submission Quality Gates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-success shrink-0" /> <span><strong>Typecheck:</strong> Run <code className="text-primary bg-surface-lowest px-1.5 py-0.5 rounded">npm run lint</code> (tsc --noEmit must pass with 0 errors).</span></div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-success shrink-0" /> <span><strong>Unit Suite:</strong> Run <code className="text-primary bg-surface-lowest px-1.5 py-0.5 rounded">npm run test</code> (all Vitest suites must pass).</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-collaboration',
      badge: 'AI Autonomous Team',
      title: '4. AI CLI (AGY) & Agent Team Collaboration',
      subtitle: 'How to pair-program with our specialized AI agents using Antigravity CLI.',
      color: 'text-accent',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Specialized Agent Team Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamAgents.map((agent, aIdx) => (
                <div key={aIdx} className="p-3 rounded-xl bg-surface-high/40 border border-outline-variant/30 space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{agent.name}</span>
                    <span className="text-[10px] text-primary">{agent.role}</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">{agent.area}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Common Antigravity (AGY) Slash Commands</h3>
            <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs space-y-2 text-on-surface-variant">
              <div><span className="text-primary font-bold">/plan</span> — Initiate structured planning mode before code changes.</div>
              <div><span className="text-secondary font-bold">/schedule</span> — Set recurring timers or one-shot reminders for background tasks.</div>
              <div><span className="text-tertiary font-bold">/grill-me</span> — Conduct interactive interview to resolve design decisions.</div>
              <div><span className="text-accent font-bold">/learn</span> — Persist project rules into `GEMINI.md`.</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentChapter = chapters[activeIndex];

  return (
    <div className="space-y-8">
      {/* Chapter Reader Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass-panel border border-outline-variant/40 p-8 lg:p-12 rounded-[2.5rem] space-y-8 bg-surface-high/20 relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="space-y-3 border-b border-outline-variant/30 pb-6">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-surface-high border border-outline-variant/40 ${currentChapter.color}`}>
                {currentChapter.badge}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">Chapter {activeIndex + 1} of {DEV_CHAPTERS.length}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight">
              {currentChapter.title}
            </h2>
            <p className="text-on-surface-variant text-base font-light">
              {currentChapter.subtitle}
            </p>
          </div>

          {/* Chapter Body Content */}
          <div>
            {currentChapter.content}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-outline-variant/30">
            {activeIndex > 0 ? (
              <button
                onClick={() => {
                  SoundManager.playPop();
                  onSelectChapter(DEV_CHAPTERS[activeIndex - 1].id);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-high text-white text-xs font-bold uppercase tracking-wider hover:bg-surface-high/80 border border-outline-variant/30 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>{DEV_CHAPTERS[activeIndex - 1].title}</span>
              </button>
            ) : <div />}

            {activeIndex < DEV_CHAPTERS.length - 1 ? (
              <button
                onClick={() => {
                  SoundManager.playPop();
                  onSelectChapter(DEV_CHAPTERS[activeIndex + 1].id);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-white text-xs font-black uppercase tracking-widest hover:bg-secondary/80 transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(255,84,77,0.3)]"
              >
                <span>{DEV_CHAPTERS[activeIndex + 1].title}</span>
                <ArrowRight size={16} />
              </button>
            ) : <div />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
