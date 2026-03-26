import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Circle, Zap, Clock, Cpu, Plus, Send } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

const MilestoneCard = ({ milestone, ambitionId, key }: { milestone: any; ambitionId: string; key?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { toggleMilestoneTask, addMilestoneTask } = useTrackStore();
  
  const totalTasks = milestone.tasks?.length || 0;
  const completedTasks = milestone.tasks?.filter((t: any) => t.completed).length || 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addMilestoneTask(ambitionId, milestone.id, newTaskTitle);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl overflow-hidden mb-3">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-surface-high transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${milestone.status === 'completed' ? 'bg-primary-container' : (milestone.status === 'active' ? 'bg-secondary' : 'bg-surface-high')}`} />
          <span className="font-bold text-white">{milestone.title}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-secondary">{completedTasks.toString().padStart(2, '0')}/{totalTasks.toString().padStart(2, '0')}</span>
            <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 space-y-2 border-t border-surface-high"
          >
            {milestone.tasks.map((task: any) => (
              <div 
                key={task.id} 
                className="flex items-center gap-2 py-2 text-sm cursor-pointer group"
                onClick={() => toggleMilestoneTask(ambitionId, milestone.id, task.id)}
              >
                {task.completed ? <CheckCircle size={16} className="text-primary-container" /> : <Circle size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />}
                <span className={task.completed ? "line-through text-on-surface-variant" : "text-white group-hover:text-primary-container transition-colors"}>{task.title}</span>
              </div>
            ))}

            {!isAddingTask ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
                className="flex items-center gap-2 py-2 text-xs font-bold text-primary hover:text-primary-container transition-colors mt-2"
              >
                <Plus size={14} />
                <span>SPLIT INTO NEW TASK</span>
              </button>
            ) : (
              <form onSubmit={handleAddTask} className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                <input 
                  autoFocus
                  className="flex-1 bg-surface-high p-2 rounded-lg border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  placeholder="Sub-task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button type="submit" className="p-2 bg-primary-container text-on-primary rounded-lg">
                  <Send size={14} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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

const AmbitionCard = ({ ambition, isPriority, key }: { ambition: any; isPriority?: boolean; key?: string }) => {
  const { addMilestone } = useTrackStore();
  const [isOpen, setIsOpen] = useState(isPriority || false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(ambition.id, newMilestoneTitle);
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  return (
    <motion.div 
      className={`glass-panel border-2 rounded-3xl mb-6 relative overflow-hidden transition-colors ${isPriority ? 'border-primary-container p-8' : 'border-outline-variant p-6 hover:border-primary/50'}`}
      initial={isPriority ? { y: 20, opacity: 0 } : false}
      animate={isPriority ? { y: 0, opacity: 1 } : false}
    >
      <div 
        className={`flex justify-between items-start cursor-pointer ${!isPriority ? 'mb-2' : 'mb-6'}`}
        onClick={() => !isPriority && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {!isPriority && (
            <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary-container shrink-0">
              <Zap size={24} />
            </div>
          )}
          <div>
            <span className="text-primary-container text-xs font-bold uppercase tracking-widest">
              {isPriority ? 'Priority Zero' : 'Secondary Ambition'}
            </span>
            <h1 className={`${isPriority ? 'text-2xl' : 'text-lg'} font-display font-bold text-white mt-1`}>{ambition.title}</h1>
            {!isPriority && !isOpen && (
              <p className="text-xs text-on-surface-variant">
                {(ambition.milestones || []).length} Milestones • {(ambition.milestones || []).filter((m: any) => m.status === 'pending').length} Pending
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`${isPriority ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-xs'} rounded-full border-2 border-primary-container flex items-center justify-center font-bold text-primary`}>
            {ambition.progress}%
          </div>
          {!isPriority && (
            <ChevronDown size={20} className={`text-on-surface-variant transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`space-y-3 ${!isPriority ? 'mt-6 pt-6 border-t border-outline-variant' : ''}`}
          >
            {(ambition.milestones || []).map((m: any) => (
              <MilestoneCard key={m.id} milestone={m} ambitionId={ambition.id} />
            ))}

            {!isAddingMilestone ? (
              <button 
                onClick={() => setIsAddingMilestone(true)}
                className="w-full glass-panel border border-dashed border-outline-variant p-4 rounded-2xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                <span className="font-bold tracking-tight uppercase text-xs">Deconstruct into new milestone</span>
              </button>
            ) : (
              <form onSubmit={handleAddMilestone} className="flex gap-2 p-2">
                <input 
                  autoFocus
                  className="flex-1 bg-surface-high p-3 rounded-xl border border-primary focus:outline-none text-sm"
                  placeholder="Milestone title..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                />
                <button type="submit" className="p-3 bg-primary-container text-on-primary rounded-xl">
                  <Send size={18} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingMilestone(false)}
                  className="p-3 text-on-surface-variant hover:text-white text-xs font-bold"
                >
                  CANCEL
                </button>
              </form>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NebulaMap = () => {
  const { ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-8 bg-surface-lowest min-h-screen text-white pb-24">
      <header className="mb-8">
        <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Architect Mode</h2>
        <h1 className="text-4xl font-display font-black text-white">The Nebula Map</h1>
        <p className="text-on-surface-variant">Deconstruct your ambitions into stellar milestones.</p>
      </header>
      
      {ambitions.slice(0, 1).map((goal) => (
        <AmbitionCard key={goal.id} ambition={goal} isPriority />
      ))}

      <div className="space-y-4">
        <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-4">Trajectory Fleet</h3>
        {ambitions.slice(1).map((sg) => (
          <AmbitionCard key={sg.id} ambition={sg} />
        ))}
      </div>

      {/* Bottom Grid for Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-48">
        <ComputeRelayCard />
        <NextMilestoneCard />
      </section>
    </div>
  );
};

export default NebulaMap;
