import React from 'react';
import { motion } from 'framer-motion';
import { useTrackStore, HistoricalEvent } from '../../store/useTrackStore';
import { Trophy, Target, AlertCircle, Calendar, GraduationCap, Briefcase, Award, Zap } from 'lucide-react';

const CategoryIcon = ({ category, size = 20 }: { category: HistoricalEvent['category'], size?: number }) => {
  switch (category) {
    case 'internship': return <Briefcase size={size} />;
    case 'hackathon': return <Award size={size} />;
    case 'certification': return <Trophy size={size} />;
    case 'academic': return <GraduationCap size={size} />;
    case 'project': return <Zap size={size} />;
    default: return <Target size={size} />;
  }
};

const TypeIcon = ({ type }: { type: HistoricalEvent['type'] }) => {
  switch (type) {
    case 'success': return <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--color-success-rgb),0.6)]" />;
    case 'missed': return <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(var(--color-warning-rgb),0.6)]" />;
    case 'failed': return <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(var(--color-error-rgb),0.6)]" />;
  }
};

const StellarTimeline = () => {
  const { history } = useTrackStore();

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar size={20} className="text-primary-container" />
          Stellar History (Past Missions)
        </h2>
        <div className="text-[10px] font-black text-primary-container uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Historical Sync Active
        </div>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-outline-variant/30 before:to-transparent">
        {sortedHistory.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-dashed border-outline-variant/50 text-center">
            <p className="text-on-surface-variant text-sm uppercase font-mono">No historical records synchronized. Launch your first mission to begin.</p>
          </div>
        ) : (
          sortedHistory.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Node */}
              <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-surface-high border-2 border-outline-variant flex items-center justify-center z-10 group-hover:border-primary/50 transition-colors">
                <CategoryIcon category={event.category} size={12} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>

              {/* Content Card */}
              <div className="glass-panel p-5 rounded-2xl border border-outline-variant/30 group-hover:border-primary/20 transition-all hover:bg-surface-high/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <TypeIcon type={event.type} />
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase bg-surface-high px-2 py-0.5 rounded border border-outline-variant/30">
                    {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {event.skills.map(skill => (
                    <span key={skill} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20 group-hover:border-secondary/40 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StellarTimeline;
