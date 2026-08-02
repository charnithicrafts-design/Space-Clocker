import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Zap, 
  ShieldAlert, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  History,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface UserGuideProps {
  searchQuery: string;
}

export const UserGuideSection: React.FC<UserGuideProps> = ({ searchQuery }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const guideCards = [
    {
      id: 'mental-space',
      icon: Sparkles,
      color: 'text-primary',
      borderColor: 'border-primary/30',
      badge: 'Core Philosophy',
      title: '1. Clock In Your Mental Space',
      summary: 'Space-Clocker is not a rigid productivity tracker. It is a sanctuary to sync your internal clocking sense with your real-life goals.',
      details: [
        'Clocking Sense: Declaratively committing your mental space to what matters today.',
        'Completion Sense: The deep satisfaction of moving your trajectory forward without anxiety or burnout.',
        'Empathy Engine: Reframing distraction as natural "Gravity Wells" rather than moral failures.'
      ]
    },
    {
      id: 'adding-tasks',
      icon: Clock,
      color: 'text-secondary',
      borderColor: 'border-secondary/30',
      badge: 'Orbit Operations',
      title: '2. Adding & Scheduling Daily Tasks',
      summary: 'Navigate to Orbit to define your daily mission parameters and schedule your flight plan.',
      details: [
        'Click "+ Add Task" or press Enter in the mission input field.',
        'Assign a time slot (e.g. 09:00) and weightage (XP reward density).',
        'Use the Stasis Backlog for intentions you want to hold for future flight plans.'
      ]
    },
    {
      id: 'history-injection',
      icon: History,
      color: 'text-tertiary',
      borderColor: 'border-tertiary/30',
      badge: 'Telemetry & Demo Data',
      title: '3. Historical Telemetry & Demo Profiles',
      summary: 'Populate up to 3 years (1,095 days) of realistic history to test-drive your Trajectory Horizon.',
      details: [
        'Explore 35 Grounded Professional Profiles (Neurosurgeon, Data Artisan, Heavy Builder).',
        'Each profile generates 3-year historical task telemetry automatically.',
        'View continuous momentum trends in Horizon without starting from scratch.'
      ]
    },
    {
      id: 'ambitions-milestones',
      icon: Target,
      color: 'text-accent',
      borderColor: 'border-accent/30',
      badge: 'Nebula Sector',
      title: '4. Decomposing Ambitions & Milestones',
      summary: 'Architect 1 to 3-year macro-ambitions in Nebula and split them into achievable milestones.',
      details: [
        'Create a Macro-Ambition (e.g., "Master Cloud Architecture & AWS Specialization").',
        'Add Stellar Milestones with target completion deadlines.',
        'Split milestones into concrete sub-tasks that flow directly into your daily Orbit scheduler.'
      ]
    },
    {
      id: 'achievements-leveling',
      icon: Award,
      color: 'text-amber-400',
      borderColor: 'border-amber-400/30',
      badge: 'Resonance Engine',
      title: '5. Achievement, XP & Rank Ascension',
      summary: 'Earn Resonance XP as you complete tasks and watch your Rank Ascend.',
      details: [
        'Task Completions grant XP based on task weightage (10 to 50 XP).',
        'Accumulating XP unlocks Rank Ascensions (Level Up modal with audio fanfare).',
        'Your overall Space Science Level reflects your long-term consistency.'
      ]
    },
    {
      id: 'void-recalibrate',
      icon: Zap,
      color: 'text-fuchsia-400',
      borderColor: 'border-fuchsia-400/30',
      badge: 'Realignment',
      title: '6. Void Protocol & [⚡ Recalibrate]',
      summary: 'Acknowledge mental drift gently and realign past-due tasks back to today without guilt.',
      details: [
        'Orbital Decay: Past-due tasks tilt slightly and dim to signal lost momentum.',
        'Click [⚡ Recalibrate]: Immediately moves any decayed task to today\'s active Orbit with positive audio feedback.',
        'Void Protocol: Set boundaries around major distractions and monitor your resistance score.'
      ]
    }
  ];

  const filteredCards = guideCards.filter(card => 
    !searchQuery || 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-primary/20 bg-surface-high/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 text-secondary text-xs font-bold uppercase tracking-widest mb-2">
          <BookOpen size={16} /> User Operations & Flight Manual
        </div>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
          Clocking In Your Mental Space
        </h2>
        <p className="text-on-surface-variant text-sm max-w-2xl mt-2 leading-relaxed">
          From your clocking sense to your completion sense. Learn how to architect ambitions, manage daily flight plans, and recalibrate without guilt.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card, idx) => {
          const Icon = card.icon;
          const isSelected = activeStep === idx;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveStep(idx)}
              className={`glass-panel border p-6 rounded-3xl transition-all cursor-pointer group relative overflow-hidden ${
                isSelected ? `${card.borderColor} bg-surface-high/60 shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)]` : 'border-outline-variant/40 hover:border-outline-variant hover:bg-surface-high/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-surface-low border border-outline-variant/30 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-surface-high border border-outline-variant/40 text-on-surface-variant">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                {card.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                {card.summary}
              </p>

              <div className="space-y-2 pt-3 border-t border-outline-variant/20">
                {card.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                    <CheckCircle2 size={12} className={`${card.color} shrink-0 mt-0.5`} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
