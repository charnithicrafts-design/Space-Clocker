import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  GitBranch, 
  Cpu, 
  Users, 
  Bot, 
  Code2, 
  Workflow, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Command
} from 'lucide-react';

interface DevGuideProps {
  searchQuery: string;
}

export const DeveloperGuideSection: React.FC<DevGuideProps> = ({ searchQuery }) => {
  const teamAgents = [
    { name: 'Winston 📐', role: 'System Architect', area: 'PGlite WASM, Worker Proxy & State Slices' },
    { name: 'Sally 🎨', role: 'UX & Visual Lead', area: 'Glassmorphism, Tailwind v4 & Layouts' },
    { name: 'Eleanor 🌿', role: 'Empathy Strategist', area: 'Eleanor\'s Log, Gravity Wells & Tone' },
    { name: 'Amelia 💻', role: 'Lead Developer', area: 'Component Logic & Feature Execution' },
    { name: 'Murat 🛡️', role: 'QA Engineer', area: 'Vitest Unit Suite & Data Integrity Gates' },
    { name: 'John 🚀', role: 'Product Manager', area: 'Epic Requirements & Version Roadmap' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-secondary/20 bg-surface-high/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 text-secondary text-xs font-bold uppercase tracking-widest mb-2">
          <Code2 size={16} /> Contributor & Architecture Portal
        </div>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
          Developer Onboarding & AI Collaboration
        </h2>
        <p className="text-on-surface-variant text-sm max-w-2xl mt-2 leading-relaxed">
          Everything you need to onboard, set up your environment, work with feature branches, and pair-program with our AI agent team using Antigravity CLI.
        </p>
      </div>

      {/* 1. Environment Setup */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-outline-variant/40 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. Environment Setup & Prerequisites</h3>
            <p className="text-xs text-on-surface-variant">Prerequisites: Node.js &gt;= 20.0.0, npm &gt;= 10.0.0</p>
          </div>
        </div>

        <div className="bg-surface-lowest p-4 rounded-2xl border border-outline-variant/30 font-mono text-xs text-primary space-y-2 overflow-x-auto">
          <div><span className="text-on-surface-variant"># Clone repository</span></div>
          <div>git clone https://github.com/charnithicrafts-design/Space-Clocker.git</div>
          <div>cd Space-Clocker</div>
          <div className="pt-2"><span className="text-on-surface-variant"># Install dependencies</span></div>
          <div>npm install</div>
          <div className="pt-2"><span className="text-on-surface-variant"># Set local Gemini API key (optional for AI features)</span></div>
          <div>echo "GEMINI_API_KEY=your_key_here" &gt; .env.local</div>
          <div className="pt-2"><span className="text-on-surface-variant"># Run local dev server (http://localhost:3000)</span></div>
          <div>npm run dev</div>
        </div>
      </motion.div>

      {/* 2. Interactive Architecture Diagram */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel border border-outline-variant/40 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Local-First WASM Architecture</h3>
            <p className="text-xs text-on-surface-variant">Offloading PostgreSQL aggregations to a dedicated Web Worker thread</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
            <div className="font-bold text-primary flex items-center gap-2">
              <Layers size={14} /> React 19 UI Thread
            </div>
            <p className="text-on-surface-variant text-[11px]">
              Components dispatch async actions to Zustand stores (`useTrackStore`, `useAnalyticsStore`).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
            <div className="font-bold text-secondary flex items-center gap-2">
              <Workflow size={14} /> Comlink RPC Bridge
            </div>
            <p className="text-on-surface-variant text-[11px]">
              `src/db/client.ts` proxies async method calls to worker thread without blocking main UI frames.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
            <div className="font-bold text-tertiary flex items-center gap-2">
              <Cpu size={14} /> PGlite WASM Worker
            </div>
            <p className="text-on-surface-variant text-[11px]">
              `src/db/db.worker.ts` executes raw SQL queries in PostgreSQL WASM with OPFS persistence.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. Git Feature Branching & Review */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel border border-outline-variant/40 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/20">
            <GitBranch size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Branching, Commits & Quality Gates</h3>
            <p className="text-xs text-on-surface-variant">Conventional commits & strict typecheck/test requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-white">Branch Naming & Conventional Commits</h4>
            <div className="bg-surface-lowest p-3 rounded-xl border border-outline-variant/20 font-mono text-[11px] text-on-surface-variant space-y-1">
              <div>git checkout -b feat/your-feature-name</div>
              <div>git commit -m "feat(orbit): add recalibrate audio trigger"</div>
              <div>git commit -m "fix(worker): resolve COALESCE date aggregation"</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white">Pre-Submission Quality Checklist</h4>
            <div className="space-y-1.5 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Run `npm run lint` (tsc --noEmit must pass with 0 errors)</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Run `npm run test` (all Vitest suites must pass)</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Verify profile skills test (`tests/data-integrity/skills.test.ts`)</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Antigravity CLI & AI Team Collaboration */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel border border-outline-variant/40 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. AI CLI (Antigravity / AGY) & Agent Team Collaboration</h3>
            <p className="text-xs text-on-surface-variant">Pair programming with our specialized autonomous agent roster</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent Roster */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Team Agent Roster</h4>
            <div className="grid grid-cols-1 gap-2">
              {teamAgents.map((agent, aIdx) => (
                <div key={aIdx} className="p-2.5 rounded-xl bg-surface-high/30 border border-outline-variant/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{agent.name}</span>
                    <span className="text-[10px] text-on-surface-variant ml-2">({agent.role})</span>
                  </div>
                  <span className="text-[9px] text-primary">{agent.area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AGY Commands */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Common Antigravity (AGY) Slash Commands</h4>
            <div className="bg-surface-lowest p-3 rounded-xl border border-outline-variant/20 font-mono text-[11px] space-y-2 text-on-surface-variant">
              <div><span className="text-primary font-bold">/plan</span> — Initiate structured planning mode before code changes.</div>
              <div><span className="text-secondary font-bold">/schedule</span> — Set recurring timers or one-shot reminders for tasks.</div>
              <div><span className="text-tertiary font-bold">/grill-me</span> — Conduct interactive design interview to resolve ambiguities.</div>
              <div><span className="text-accent font-bold">/learn</span> — Persist user preferences or project rules into `GEMINI.md`.</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
