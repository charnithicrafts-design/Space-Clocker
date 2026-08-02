import React, { useState } from 'react';
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
  ChevronRight,
  BookOpen,
  Info,
  ShieldAlert
} from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface UserGuideProps {
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
}

export interface UserChapter {
  id: string;
  icon: any;
  badge: string;
  title: string;
  subtitle: string;
  color: string;
  content: React.ReactNode;
}

export const USER_CHAPTERS: { id: string; title: string; icon: any }[] = [
  { id: 'mental-space', title: '1. Clocking Your Mental Space', icon: Sparkles },
  { id: 'adding-tasks', title: '2. Orbit Daily Flight Planning', icon: Clock },
  { id: 'history-telemetry', title: '3. 3-Year Telemetry & Profiles', icon: History },
  { id: 'ambitions-milestones', title: '4. Decomposing Ambitions', icon: Target },
  { id: 'achievements-xp', title: '5. Achievements & Rank Ascension', icon: Award },
  { id: 'void-recalibrate', title: '6. Void Protocol & [⚡ Recalibrate]', icon: Zap }
];

export const UserGuideSection: React.FC<UserGuideProps> = ({ selectedChapterId, onSelectChapter }) => {
  const currentIndex = USER_CHAPTERS.findIndex(c => c.id === selectedChapterId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;

  const chapters: UserChapter[] = [
    {
      id: 'mental-space',
      icon: Sparkles,
      badge: 'Core Philosophy',
      title: '1. Clocking In Your Mental Space',
      subtitle: 'Understanding the shift from rigid productivity tracking to authentic mental space alignment.',
      color: 'text-primary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-white font-medium space-y-2">
            <div className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
              <Sparkles size={16} /> Core Axiom
            </div>
            <p className="text-lg font-display font-bold">
              "Space-Clocker is an application to clock in your mental space. You sync (clock in) your ambitions in your mental space with your internal clocking sense. Space-Clocker will caress you from your clocking sense to your completion sense."
            </p>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight pt-2">The Two Pillars of Space-Clocker</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-primary text-base flex items-center gap-2">
                <Clock size={18} /> Internal Clocking Sense
              </h4>
              <p className="text-sm">
                Declaratively acknowledging your true mental bandwidth each morning. You set intentions based on real energy, not unrealistic to-do lists.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-secondary text-base flex items-center gap-2">
                <Award size={18} /> Completion Sense
              </h4>
              <p className="text-sm">
                Experiencing the deep psychological satisfaction of advancing your 1 to 3-year life trajectory without guilt, anxiety, or burnout.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-high/20 border border-outline-variant/20 flex items-start gap-3">
            <Info size={20} className="text-secondary shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong className="text-white">Empathy First:</strong> Distractions and low-energy days are recognized as natural <em>Gravity Wells</em>. The application provides tools to gently realign your trajectory rather than penalizing you.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'adding-tasks',
      icon: Clock,
      badge: 'Orbit Sector',
      title: '2. Orbit Daily Flight Planning',
      subtitle: 'How to declare intentions, assign time slots, and manage your daily mission backlog.',
      color: 'text-secondary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            The <strong>Orbit Sector</strong> is your daily flight deck. Here, you align short-term actions with your macroscopic ambitions.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Step-by-Step Flight Planning</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-base">Declare Your Mission Input</h4>
                  <p className="text-sm mt-1">Navigate to <strong>Orbit</strong>, type your intention into the mission input bar (e.g., <em>"Review AWS VPC Architecture Rules"</em>), and press Enter.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-base">Assign Time Slot & Weightage</h4>
                  <p className="text-sm mt-1">Select a planned execution time (e.g. 10:00 AM) and assign XP density. Heavier tasks yield greater Resonance XP rewards.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-high/30 border border-outline-variant/30 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-tertiary/20 text-tertiary font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-base">Stasis Backlog Management</h4>
                  <p className="text-sm mt-1">If your day gets overcrowded, drag or send tasks into the <strong>Stasis Backlog</strong> to hold them safely for upcoming flight plans.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'history-telemetry',
      icon: History,
      badge: 'Trajectory Telemetry',
      title: '3. 3-Year Telemetry & Grounded Profiles',
      subtitle: 'Exploring continuous 1,095-day historical task data and professional archetypes.',
      color: 'text-tertiary',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Space-Clocker includes <strong>35 Grounded Professional Archetypes</strong> (e.g., Neurosurgeon, Heavy Builder, Data Artisan, Clinical Trial Director) pre-populated with realistic historical telemetry.
          </p>

          <div className="p-6 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">How Telemetry Spreads Across 3 Years</h3>
            <ul className="space-y-2 text-sm list-disc pl-5">
              <li><strong>Continuous Date Series:</strong> Telemetry metrics aggregate completed tasks and void resistance events across a continuous 7-day, 30-day, and 1,095-day (3-year) window.</li>
              <li><strong>Stellar History SQL Engine:</strong> Historical records are stored inside PGlite WASM database table <code className="text-primary bg-surface-lowest px-1.5 py-0.5 rounded">stellar_history</code>.</li>
              <li><strong>Testing Your Horizon:</strong> You can load any professional archetype from the Identity Matrix (`/identity`) to immediately inspect 3-year radar chart projections.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'ambitions-milestones',
      icon: Target,
      badge: 'Nebula Sector',
      title: '4. Decomposing Ambitions & Milestones',
      subtitle: 'Architecting long-term goals into stellar milestones and sub-task flight plans.',
      color: 'text-accent',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            In the <strong>Nebula Sector</strong>, you break down intimidating multi-year ambitions into manageable flight plans.
          </p>

          <div className="p-6 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Decomposition Workflow</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-accent shrink-0" /> <span><strong>Create Ambition:</strong> Define a macro-goal (e.g. <em>"AWS Cloud Specialist Specialization"</em>).</span></div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-accent shrink-0" /> <span><strong>Add Milestones:</strong> Define target milestones (e.g. <em>"Pass Solutions Architect Associate Exam"</em>).</span></div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-accent shrink-0" /> <span><strong>Split Milestone Tasks:</strong> Click <em>"+ Add Task to Milestone"</em>. Sub-tasks carry full milestone mapping (`ambitionId` + `milestoneId`).</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'achievements-xp',
      icon: Award,
      badge: 'Resonance Engine',
      title: '5. Achievement, XP & Rank Ascension',
      subtitle: 'How completing daily missions builds your Space Science Rank.',
      color: 'text-amber-400',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Every task completed in Orbit or Nebula feeds your overall <strong>Resonance XP</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-amber-400 text-base">XP Calculation</h4>
              <p className="text-sm">
                Standard tasks award <strong>+10 to +50 XP</strong> based on complexity and weightage. Completing entire milestones awards bonus Resonance XP.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-high/40 border border-outline-variant/30 space-y-2">
              <h4 className="font-bold text-primary text-base">Rank Ascension Modal</h4>
              <p className="text-sm">
                Reaching 100% XP triggers the <strong>Rank Ascended!</strong> celebration modal with custom audio feedback, elevating your Space Science Level.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'void-recalibrate',
      icon: Zap,
      badge: 'Realignment',
      title: '6. Void Protocol & [⚡ Recalibrate]',
      subtitle: 'Gentle realignment tools to recover momentum when flight plans drift.',
      color: 'text-fuchsia-400',
      content: (
        <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
          <div className="p-6 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-500/30 space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap size={20} className="text-fuchsia-400" /> The [⚡ Recalibrate] Protocol
            </h3>
            <p className="text-sm">
              When tasks pass their planned date without completion, Orbit displays them with a subtle orbital tilt and dim glow to signal lost momentum.
            </p>
            <p className="text-sm font-semibold text-white">
              Clicking <strong>[⚡ Recalibrate]</strong> immediately moves all past-due tasks (both standalone and milestone sub-tasks) to today's active Orbit, playing a positive audio sound to welcome you back into flow.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-high/30 border border-outline-variant/30 space-y-2">
            <h4 className="font-bold text-white text-base">Void Protocol Boundaries</h4>
            <p className="text-sm">
              Log major distractions (e.g. social media spirals) into the <strong>Void Protocol</strong>. The engine tracks your resistance score and helps you lock out bad habits without shame.
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
