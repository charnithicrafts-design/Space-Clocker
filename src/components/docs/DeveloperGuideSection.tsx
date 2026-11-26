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
  Code2,
  Sparkles,
  Users,
  Palette
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
  { id: 'quickstart', title: '1. Quickstart in 3 Steps', icon: Terminal },
  { id: 'wasm-architecture', title: '2. How Space-Clocker Works', icon: Cpu },
  { id: 'git-workflow', title: '3. Making Your First Feature', icon: GitBranch },
  { id: 'ai-collaboration', title: '4. Pair-Programming with AI', icon: Bot }
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
    { name: 'Winston 📐', role: 'System Architect', area: 'PGlite WASM Database, Worker RPC & State Slices' },
    { name: 'Sally 🎨', role: 'UX & Design Specialist', area: 'Glassmorphic Styling, Tailwind v4 & Responsive Layouts' },
    { name: 'Eleanor 🌿', role: 'Human Experience & Empathy', area: 'People Mode Architecture, Eleanor\'s Log & Gentle Recalibration' },
    { name: 'Chloe 📜', role: 'Brand & Storytelling', area: 'Mission Narrative, Landing Experience & Cultural Voice' },
    { name: 'Amelia 💻', role: 'Lead Developer', area: 'React Components, Story Specs & Bug Fixes' },
    { name: 'Murat 🛡️', role: 'QA Test Architect', area: 'Vitest Unit Suites & Data Integrity Quality Gates' },
    { name: 'John 🚀', role: 'Product Manager', area: 'Feature PRDs & Version Release Notes' }
  ];

  const chapters: DevChapter[] = [
    {
      id: 'quickstart',
      badge: 'Quickstart',
      title: '1. Quickstart in 3 Simple Steps',
      subtitle: 'How to clone the codebase, install dependencies, and launch your local dev server.',
      color: 'text-primary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p className="text-white font-medium">
            Welcome to Space-Clocker! Setting up your local development environment takes less than 2 minutes.
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-on-surface text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-black flex items-center justify-center shrink-0">1</span>
                  <span>Clone the Repository</span>
                </h4>
                <button 
                  onClick={() => copyToClipboard('git clone https://github.com/charnithicrafts-design/Space-Clocker.git && cd Space-Clocker', 'clone')}
                  className="touch-target-compact flex items-center gap-2 type-caption text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg hover:bg-primary/20 transition-all cursor-pointer font-bold"
                >
                  {copiedCode === 'clone' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === 'clone' ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-primary overflow-x-auto">
                git clone https://github.com/charnithicrafts-design/Space-Clocker.git<br/>
                cd Space-Clocker
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center">2</span>
                  <span>Install Dependencies</span>
                </h4>
                <button 
                  onClick={() => copyToClipboard('npm install', 'install')}
                  className="flex items-center gap-1.5 text-xs text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-lg hover:bg-secondary/20 transition-all cursor-pointer font-bold"
                >
                  {copiedCode === 'install' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === 'install' ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-secondary">
                npm install
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary text-xs font-black flex items-center justify-center">3</span>
                  <span>Launch Dev Server (http://localhost:3000)</span>
                </h4>
                <button 
                  onClick={() => copyToClipboard('npm run dev', 'dev')}
                  className="flex items-center gap-1.5 text-xs text-tertiary bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-lg hover:bg-tertiary/20 transition-all cursor-pointer font-bold"
                >
                  {copiedCode === 'dev' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === 'dev' ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-tertiary">
                npm run dev
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wasm-architecture',
      badge: 'Architecture Made Simple',
      title: '2. How Space-Clocker Works (Local-First WASM)',
      subtitle: 'Why our database runs inside a Web Worker so the app stays lightning-fast.',
      color: 'text-secondary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Space-Clocker is a <strong>local-first application</strong>. Your data lives inside a real PostgreSQL database running right inside your browser via WebAssembly (PGlite).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-primary flex items-center gap-2 text-sm">
                <Layers size={16} /> 1. React 19 UI
              </div>
              <p className="text-on-surface-variant">
                Renders screen components smoothly. Public pages skip database initialization to keep page loads instant.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-secondary flex items-center gap-2 text-sm">
                <Workflow size={16} /> 2. Comlink Bridge
              </div>
              <p className="text-on-surface-variant">
                Passes SQL queries between UI and worker thread asynchronously without freezing animations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-tertiary flex items-center gap-2 text-sm">
                <Cpu size={16} /> 3. PGlite WASM
              </div>
              <p className="text-on-surface-variant">
                Executes PostgreSQL queries in background thread and saves persistently in OPFS browser storage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="font-bold text-accent flex items-center gap-2 text-sm">
                <Users size={16} /> 4. Vocabulary Engine
              </div>
              <p className="text-on-surface-variant">
                Presentation decoupling via <code>useVocabulary()</code>. Dynamically toggles Cosmic & Everyday terms with zero schema changes.
              </p>
            </div>
          </div>

          {/* Dual-Engine Architecture: Theming + Vocabulary */}
          <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Palette size={20} className="text-primary" />
              <span>Three-Theme Engine & CSS Custom Properties</span>
            </h3>
            <p className="text-sm">
              Space-Clocker separates data state, vocabulary, and visual themes into completely orthogonal layers:
            </p>
            <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs space-y-2 text-on-surface-variant">
              <div><span className="text-primary font-bold">1. Cosmos:</span> <code>body[data-theme="cosmos"]</code> — #0B0E14 base, #00F2FF primary cyan, #DAB9FF secondary violet</div>
              <div><span className="text-secondary font-bold">2. Astronaut:</span> <code>body[data-theme="astronaut"]</code> — #090807 vacuum black, #1D6291 orbital blue, #A0947E thermal gold</div>
              <div><span className="text-tertiary font-bold">3. Sunny Iris:</span> <code>body[data-theme="sunny-iris"]</code> — #150727 launch poster purple, #DDB763 golden sun, #D6C7F2 pastel lavender</div>
            </div>
            <p className="text-xs text-on-surface-variant">
              Components read standard Tailwind tokens (e.g., <code>bg-surface-high</code>, <code>text-primary</code>) or the <code>useTheme()</code> hook. No component re-rendering cascade is triggered when themes switch—the browser instantly updates the CSS variable cascade at 60fps.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'git-workflow',
      badge: 'Branching & Quality',
      title: '3. Making Your First Feature & Quality Check',
      subtitle: 'How to create a feature branch, write conventional commits, and run tests.',
      color: 'text-tertiary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Feature Branching & Commits</h3>
            <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs space-y-2 text-on-surface-variant">
              <div><span className="text-primary font-bold">git checkout -b feat/orbit-recalibrate-audio</span></div>
              <div><span className="text-primary font-bold">git commit -m "feat(orbit): add audio sound on recalibrate click"</span></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Pre-Submission Quality Gate</h3>
            <p className="text-sm">Before submitting your pull request, run these two commands:</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-lowest border border-outline-variant/20 flex items-center justify-between">
                <span>npm run lint <span className="text-on-surface-variant font-sans">(Verify zero TypeScript errors)</span></span>
                <ShieldCheck size={16} className="text-success" />
              </div>
              <div className="p-3 rounded-xl bg-surface-lowest border border-outline-variant/20 flex items-center justify-between">
                <span>npm run test <span className="text-on-surface-variant font-sans">(Verify all Vitest suites pass)</span></span>
                <ShieldCheck size={16} className="text-success" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-collaboration',
      badge: 'AI Agents',
      title: '4. Pair-Programming with AI Agents & AGY CLI',
      subtitle: 'Meet your specialized AI team and learn common Antigravity CLI commands.',
      color: 'text-accent',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Meet Your Specialized AI Agent Team</h3>
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
            <h3 className="text-xl font-bold text-white tracking-tight">Antigravity (AGY) Slash Commands</h3>
            <div className="bg-surface-lowest p-4 rounded-xl border border-outline-variant/30 font-mono text-xs space-y-2 text-on-surface-variant">
              <div><span className="text-primary font-bold">/plan</span> — Triggers structured design planning before writing code.</div>
              <div><span className="text-secondary font-bold">/schedule</span> — Sets non-blocking timers or recurring background checks.</div>
              <div><span className="text-tertiary font-bold">/grill-me</span> — Initiates an interactive interview to align on design decisions.</div>
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
          className="glass-panel border border-outline-variant/40 p-4 sm:p-8 lg:p-12 rounded-3xl space-y-8 bg-surface-high/20 relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="space-y-3 border-b border-outline-variant/30 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`type-overline font-black tracking-widest px-3 py-1 rounded-full bg-surface-high border border-outline-variant/40 ${currentChapter.color}`}>
                {currentChapter.badge}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">Chapter {activeIndex + 1} of {DEV_CHAPTERS.length}</span>
            </div>
            <h2 className="type-title-1 lg:text-4xl font-display font-black text-on-surface uppercase tracking-tight">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-outline-variant/30">
            {activeIndex > 0 ? (
              <button
                onClick={() => {
                  SoundManager.playPop();
                  onSelectChapter(DEV_CHAPTERS[activeIndex - 1].id);
                }}
                className="touch-target flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-surface-high text-on-surface text-xs font-bold uppercase tracking-wider hover:bg-surface-high/80 border border-outline-variant/30 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span className="truncate">{DEV_CHAPTERS[activeIndex - 1].title}</span>
              </button>
            ) : <div className="hidden sm:block" />}

            {activeIndex < DEV_CHAPTERS.length - 1 ? (
              <button
                onClick={() => {
                  SoundManager.playPop();
                  onSelectChapter(DEV_CHAPTERS[activeIndex + 1].id);
                }}
                className="touch-target flex items-center justify-center sm:justify-end gap-2 px-6 py-3 rounded-2xl bg-secondary text-on-secondary text-xs font-black uppercase tracking-widest hover:bg-secondary/80 transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(255,84,77,0.3)]"
              >
                <span className="truncate">{DEV_CHAPTERS[activeIndex + 1].title}</span>
                <ArrowRight size={16} className="shrink-0" />
              </button>
            ) : <div className="hidden sm:block" />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
