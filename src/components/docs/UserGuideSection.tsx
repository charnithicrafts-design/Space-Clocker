import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Clock, 
  History, 
  Target, 
  Award, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Info,
  ShieldAlert,
  Compass,
  Smile,
  HeartHandshake,
  Users,
  Palette
} from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface UserGuideProps {
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
}

export interface UserChapter {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  color: string;
  content: React.ReactNode;
}

export const USER_CHAPTERS: { id: string; title: string; icon: any }[] = [
  { id: 'mental-space', title: '1. Clocking Your Mental Space', icon: Sparkles },
  { id: 'adding-tasks', title: '2. Orbit Daily Flight Planning', icon: Clock },
  { id: 'history-telemetry', title: '3. 3-Year Telemetry & Archetypes', icon: History },
  { id: 'ambitions-milestones', title: '4. Nebula Ambition GPS', icon: Target },
  { id: 'achievements-xp', title: '5. Achievements & Level Ups', icon: Award },
  { id: 'void-recalibrate', title: '6. Void Protocol & Recalibration', icon: Zap }
];

export const UserGuideSection: React.FC<UserGuideProps> = ({ selectedChapterId, onSelectChapter }) => {
  const currentIndex = USER_CHAPTERS.findIndex(c => c.id === selectedChapterId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;

  const chapters: UserChapter[] = [
    {
      id: 'mental-space',
      badge: 'Core Philosophy',
      title: '1. Clocking In Your Mental Space',
      subtitle: 'Why Space-Clocker exists and how it syncs your mind with your real-life goals.',
      color: 'text-primary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          {/* Main Hero Statement Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-surface-high/40 to-transparent border border-primary/30 text-white space-y-3 shadow-lg">
            <div className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
              <Sparkles size={16} /> Our Core Belief
            </div>
            <p className="text-xl font-display font-black leading-snug">
              "Space-Clocker is an application to clock in your mental space. You sync (clock in) your ambitions in your mental space with your internal clocking sense. Space-Clocker will caress you from your clocking sense to your completion sense."
            </p>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight pt-2">How It Works in Everyday Life</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Clock size={20} />
                <span>Step A: Clocking Sense</span>
              </div>
              <p className="text-sm">
                Every morning, you check in with yourself. Instead of staring at an overwhelming to-do list, you declare what truly matters to your mental space today based on your real energy level.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-base">
                <Award size={20} />
                <span>Step B: Completion Sense</span>
              </div>
              <p className="text-sm">
                As you check off missions, you experience deep satisfaction. You know every step is moving your 1 to 3-year life goals forward—with zero guilt, anxiety, or burnout.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-high/20 border border-outline-variant/20 flex items-start gap-3 text-sm">
            <HeartHandshake size={22} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-1">Rest Without Guilt (Gravity Wells)</strong>
              When life happens or energy dips, Space-Clocker treats delays as natural <em>Gravity Wells</em>—not failures. You always have one-click recalibration to gently bring past intentions into today.
            </div>
          </div>

          {/* People Mode vs Original Mode Rosetta Stone */}
          <div className="p-6 rounded-3xl bg-surface-high/30 border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Users size={22} className="text-secondary" />
              <span>Choose Your Mental Frequency: Original vs. People Mode</span>
            </div>
            <p className="text-sm">
              We believe great productivity belongs to everyone. While deep sci-fi telemetry fuels many of our users, others prefer straightforward, everyday clarity. With our dual-mode vocabulary engine, you can switch between <strong>Original Mode</strong> and <strong>People Mode</strong> at any moment with a single click—right above <em>App Settings</em> on the desktop sidebar, or inside <em>System Config</em>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-white/50 font-mono uppercase tracking-wider">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-primary">Original Mode</th>
                    <th className="py-2.5 px-3 text-secondary">People Mode</th>
                    <th className="py-2.5 px-3">What It Means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Daily Planning</td>
                    <td className="py-2.5 px-3 font-mono text-primary">Orbit / Flight Deck</td>
                    <td className="py-2.5 px-3 font-medium text-secondary">Today's Tasks</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">Your manageable daily to-do items</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Life Roadmap</td>
                    <td className="py-2.5 px-3 font-mono text-primary">Nebula / Sector</td>
                    <td className="py-2.5 px-3 font-medium text-secondary">Ambitions & Goals</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">Long-term vision decomposed into milestones</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Overview</td>
                    <td className="py-2.5 px-3 font-mono text-primary">Momentum Engine</td>
                    <td className="py-2.5 px-3 font-medium text-secondary">Progress Engine</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">Your high-level trajectory & velocity</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Anti-Distraction</td>
                    <td className="py-2.5 px-3 font-mono text-primary">Void Protocol</td>
                    <td className="py-2.5 px-3 font-medium text-secondary">Countermeasures</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">Habits and temptations you choose to avoid</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-white">Synchronization</td>
                    <td className="py-2.5 px-3 font-mono text-primary">Quantum Telemetry</td>
                    <td className="py-2.5 px-3 font-medium text-secondary">Cloud Backup & Sync</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">Encrypted, peer-safe local-first backups</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-on-surface-variant italic">
              Your tasks, milestones, logs, and database remain 100% untouched when switching modes. Only the terminology transforms.
            </p>
          </div>

          {/* Three Visual Themes: Cosmos, Astronaut & Sunny Iris */}
          <div className="p-6 rounded-3xl bg-surface-high/30 border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Palette size={22} className="text-primary" />
              <span>Three Visual Themes for Every State of Mind</span>
            </div>
            <p className="text-sm">
              The colors around you directly shape how calm and focused you feel. Space-Clocker provides three comfortable visual themes that you can switch anytime from the sidebar cycler or inside <em>System Config</em>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-surface-lowest/70 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    Interstellar HUD
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FF]" />
                </div>
                <h4 className="font-bold text-white text-base">1. Cosmos (Original)</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Color Story:</strong> Deep space obsidian, electric cyan telemetry, and nebula violet.<br />
                  <strong>Purpose:</strong> High-octane immersion and laser-sharp focus for technical workflows and night sessions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-lowest/70 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    NASA / Apollo
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D6291]" />
                </div>
                <h4 className="font-bold text-white text-base">2. Astronaut (Aerospace)</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Color Story:</strong> Real-world spacewalk palette—vacuum black, spacesuit ceramic, Earth orbital blue, and thermal foil gold.<br />
                  <strong>Purpose:</strong> Grounded engineering discipline and tactile mission control focus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-lowest/70 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    Botanical Ease of Eye
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DDB763]" />
                </div>
                <h4 className="font-bold text-white text-base">3. Sunny Iris (Sanctuary)</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Color Story:</strong> Charnithi launch poster royal purple, sunny golden iris throat, pastel lavender, and sprout green.<br />
                  <strong>Purpose:</strong> Zero eye strain for marathon days, delivering soothing organic warmth and cognitive calm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'adding-tasks',
      badge: 'Daily Flight Deck',
      title: '2. Orbit Daily Flight Planning',
      subtitle: 'A simple 3-step guide to organizing your day without anxiety.',
      color: 'text-secondary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            <strong>Orbit</strong> is your daily sanctuary. It helps you focus on what you can accomplish today without worrying about tomorrow.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Simple 3-Step Daily Routine</h3>

            <div className="space-y-3">
              <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-primary text-on-primary font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">Write Your Intentions</h4>
                  <p className="text-sm">
                    Click <strong>Orbit</strong> in the sidebar, type your task in the input box (e.g., <em>"Design User Auth Flow"</em>), and press Enter.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-secondary text-white font-black text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">Set Time & Weightage</h4>
                  <p className="text-sm">
                    Optionally pick a target hour (e.g., 10:00 AM) and set task weightage. Heavier tasks reward you with extra Resonance XP when completed.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-9 h-9 rounded-2xl bg-tertiary text-on-tertiary font-black text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">Use Stasis Backlog for Future Tasks</h4>
                  <p className="text-sm">
                    Got tasks you can't finish today? Send them to your <strong>Stasis Backlog</strong> with one click. They stay safe until you are ready to pull them into a future flight plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'history-telemetry',
      badge: 'Telemetry & Demo Data',
      title: '3. 3-Year Telemetry & Grounded Profiles',
      subtitle: 'Test-drive continuous 1,095-day historical task data with real professional archetypes.',
      color: 'text-tertiary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Don't want to start with a blank screen? Space-Clocker includes <strong>35 Grounded Professional Profiles</strong> loaded with 3 years (1,095 days) of realistic historical task data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-tertiary text-base">35 Professional Archetypes</h4>
              <p className="text-sm">
                Explore real profiles like <em>Neurosurgeon, Heavy Builder, Data Artisan, Civil Engineer,</em> and <em>Clinical Trial Director</em>—each with customized hard & soft skills.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-primary text-base">Instant Horizon Telemetry</h4>
              <p className="text-sm">
                Switching profiles in the Identity Matrix (`/identity`) populates your 7-day, 30-day, and 3-year Trajectory Horizon charts instantly so you can test analytics right away.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ambitions-milestones',
      badge: 'Nebula Sector',
      title: '4. Nebula Ambition GPS',
      subtitle: 'Turn massive 1 to 3-year dreams into clear, actionable milestone steps.',
      color: 'text-accent',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            The <strong>Nebula Sector</strong> acts as a GPS for your long-term life goals. It breaks intimidating multi-year dreams into simple milestone steps.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent shrink-0" />
              <span className="text-sm"><strong>1. Create Macro Ambition:</strong> Name your overarching goal (e.g. <em>"Master AWS Cloud Architecture"</em>).</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent shrink-0" />
              <span className="text-sm"><strong>2. Add Stellar Milestones:</strong> Add key checkpoints (e.g. <em>"Pass Solutions Architect Exam"</em>).</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-accent shrink-0" />
              <span className="text-sm"><strong>3. Split Milestone Sub-Tasks:</strong> Break milestones into daily actionable tasks that flow right into your Orbit schedule.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'achievements-xp',
      badge: 'Resonance Engine',
      title: '5. Achievements & Rank Ascension',
      subtitle: 'How completing daily missions builds your XP and ascends your rank.',
      color: 'text-amber-400',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Every mission you complete awards <strong>Resonance XP</strong> to celebrate your daily consistency.
          </p>

          <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-400/30 space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award size={22} className="text-amber-400 animate-bounce" /> Rank Ascended!
            </h3>
            <p className="text-sm">
              Filling your XP bar triggers our custom level-up modal with audio fanfare, increasing your overall <strong>Space Science Level</strong>.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'void-recalibrate',
      badge: 'Realignment',
      title: '6. Void Protocol & [⚡ Recalibrate]',
      subtitle: 'How to recover momentum gently when life gets off track.',
      color: 'text-fuchsia-400',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="p-6 rounded-3xl bg-fuchsia-950/30 border border-fuchsia-400/30 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap size={22} className="text-fuchsia-400" /> The [⚡ Recalibrate] Magic Button
            </h3>
            <p className="text-sm">
              If tasks were scheduled for yesterday or earlier and were left unfinished, Orbit shows them dimmed with a gentle tilt to signal lost momentum.
            </p>
            <p className="text-sm font-bold text-white bg-fuchsia-900/40 p-3 rounded-xl border border-fuchsia-400/30">
              Clicking [⚡ Recalibrate] instantly moves all past-due tasks (including milestone sub-tasks) into today's flight plan, accompanied by a welcoming audio sound. No shame, no friction.
            </p>
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
              <span className="text-xs text-on-surface-variant font-mono">Chapter {activeIndex + 1} of {USER_CHAPTERS.length}</span>
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
                  onSelectChapter(USER_CHAPTERS[activeIndex - 1].id);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-high text-white text-xs font-bold uppercase tracking-wider hover:bg-surface-high/80 border border-outline-variant/30 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>{USER_CHAPTERS[activeIndex - 1].title}</span>
              </button>
            ) : <div />}

            {activeIndex < USER_CHAPTERS.length - 1 ? (
              <button
                onClick={() => {
                  SoundManager.playPop();
                  onSelectChapter(USER_CHAPTERS[activeIndex + 1].id);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary text-xs font-black uppercase tracking-widest hover:bg-primary-container transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(0,242,255,0.3)]"
              >
                <span>{USER_CHAPTERS[activeIndex + 1].title}</span>
                <ArrowRight size={16} />
              </button>
            ) : <div />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
