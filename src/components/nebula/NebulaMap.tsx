import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Circle, Zap, Clock, Cpu } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

const MilestoneCard = ({ milestone }: { milestone: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalTasks = milestone.tasks?.length || 0;
  const completedTasks = milestone.tasks?.filter((t: any) => t.completed).length || 0;

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl overflow-hidden mb-3">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-surface-high transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${milestone.status === 'completed' ? 'bg-primary-container' : 'bg-surface-high'}`} />
          <span className="font-bold text-white">{milestone.title}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-secondary">{completedTasks.toString().padStart(2, '0')}/{totalTasks.toString().padStart(2, '0')}</span>
            <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-2 border-t border-surface-high"
        >
          {milestone.tasks.map((task: any) => (
            <div key={task.id} className="flex items-center gap-2 py-2 text-sm">
              {task.completed ? <CheckCircle size={16} className="text-primary-container" /> : <Circle size={16} className="text-on-surface-variant" />}
              <span className={task.completed ? "line-through text-on-surface-variant" : "text-white"}>{task.title}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const NextMilestoneCard = () => (
  <div className="glass-panel border border-outline-variant p-6 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden group hover:border-primary-container transition-colors">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <Clock size={120} />
    </div>
    <div>
      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">NEXT MILESTONE</h3>
    </div>
    <div>
      <div className="text-primary-container font-mono text-sm mb-1">In 4 hours</div>
      <div className="text-2xl font-bold text-white">System Sync</div>
    </div>
  </div>
);

const ComputeRelayCard = () => (
  <div className="glass-panel border border-outline-variant p-6 rounded-3xl h-full bg-gradient-to-br from-secondary/20 to-transparent flex flex-col justify-between">
    <Cpu className="text-secondary" size={32} />
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Compute<br/>Relay</h3>
      <div className="w-full h-1 bg-surface-high mt-4 rounded-full overflow-hidden">
        <div className="h-full bg-secondary w-2/3" />
      </div>
    </div>
  </div>
);

const NebulaMap = () => {
  const { ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-8 bg-surface-lowest min-h-screen text-white">
      <header className="mb-8">
        <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Architect Mode</h2>
        <h1 className="text-4xl font-display font-black text-white">The Nebula Map</h1>
        <p className="text-on-surface-variant">Deconstruct your ambitions into stellar milestones.</p>
      </header>
      
      {ambitions.slice(0, 1).map((goal) => (
        <div key={goal.id} className="mb-8">
          <motion.div 
            className="glass-panel border-2 border-primary-container p-8 rounded-3xl mb-6 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-primary-container text-xs font-bold uppercase tracking-widest">Priority Zero</span>
                <h1 className="text-2xl font-display font-bold text-white mt-1">{goal.title}</h1>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-primary-container flex items-center justify-center font-bold text-primary text-xl">
                {goal.progress}%
              </div>
            </div>
            
            <section className="mt-6">
              {(goal.milestones || []).map((m) => (
                <MilestoneCard key={m.id} milestone={m} />
              ))}
            </section>
          </motion.div>
        </div>
      ))}

      <section className="space-y-4">
        {ambitions.slice(1).map((sg) => (
          <div key={sg.id} className="glass-panel border border-outline-variant p-6 rounded-2xl flex justify-between items-center hover:border-primary-container transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary-container">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">{sg.title}</h3>
                <p className="text-xs text-on-surface-variant">
                  {(sg.milestones || []).length} Sub-goals • {(sg.milestones || []).filter((m: any) => m.status === 'pending').length} Pending
                </p>
              </div>
            </div>
            <ChevronDown className="text-on-surface-variant" />
          </div>
        ))}
      </section>

      {/* Bottom Grid for Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-48">
        <ComputeRelayCard />
        <NextMilestoneCard />
      </section>
    </div>
  );
};

export default NebulaMap;
