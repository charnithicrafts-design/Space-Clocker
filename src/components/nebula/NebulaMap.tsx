import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Circle, Zap, Clock, Cpu, Plus, Send, Rocket, X, Edit2, Trash2 } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import CommandModal from '../layout/CommandModal';
import ConfirmModal from '../layout/ConfirmModal';

const MilestoneCard = ({ milestone, ambitionId }: { milestone: any; ambitionId: string; key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isEditingMilestone, setIsEditingMilestone] = useState(false);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState(milestone.title);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const { toggleMilestoneTask, addMilestoneTask, updateMilestoneTask, updateMilestone, deleteMilestoneTask, preferences } = useTrackStore();
  
  const totalTasks = milestone.tasks?.length || 0;
  const completedTasks = milestone.tasks?.filter((t: any) => t.completed).length || 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addMilestoneTask(ambitionId, milestone.id, newTaskTitle);
    SoundManager.playPop();
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleToggleTask = (taskId: string) => {
    toggleMilestoneTask(ambitionId, milestone.id, taskId);
    SoundManager.playPop();
  };

  const startEditingTask = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    if (task.completed) return;
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const saveTaskEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId && editTaskTitle.trim()) {
      updateMilestoneTask(ambitionId, milestone.id, editingTaskId, editTaskTitle);
      SoundManager.playPop();
    }
    setEditingTaskId(null);
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (preferences.confirmDelete) {
      setDeleteTaskId(taskId);
      setIsDeleteModalOpen(true);
      return;
    }
    deleteMilestoneTask(ambitionId, milestone.id, taskId);
    SoundManager.playThud();
  };

  const handleDeleteConfirm = () => {
    if (deleteTaskId) {
      deleteMilestoneTask(ambitionId, milestone.id, deleteTaskId);
      SoundManager.playThud();
      setDeleteTaskId(null);
    }
  };

  const startEditingMilestone = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingMilestone(true);
    setEditMilestoneTitle(milestone.title);
  };

  const saveMilestoneEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMilestoneTitle.trim()) {
      updateMilestone(ambitionId, milestone.id, editMilestoneTitle);
      SoundManager.playPop();
    }
    setIsEditingMilestone(false);
  };

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl overflow-hidden mb-3 group/milestone">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-surface-high transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-3 h-3 rounded-full shrink-0 ${milestone.status === 'completed' ? 'bg-primary-container' : (milestone.status === 'active' ? 'bg-secondary' : 'bg-surface-high')}`} />
          
          {isEditingMilestone ? (
            <form onSubmit={saveMilestoneEdit} className="flex-1" onClick={e => e.stopPropagation()}>
              <input 
                autoFocus
                className="w-full bg-surface-high p-1 rounded border border-primary font-bold text-white focus:outline-none"
                value={editMilestoneTitle}
                onChange={(e) => setEditMilestoneTitle(e.target.value)}
                onBlur={() => setIsEditingMilestone(false)}
                onKeyDown={(e) => e.key === 'Escape' && setIsEditingMilestone(false)}
              />
            </form>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="font-bold text-white">{milestone.title}</span>
              <button 
                onClick={startEditingMilestone}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-all"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
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
                className="flex items-center gap-2 py-2 text-sm group"
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.completed ? <CheckCircle size={16} className="text-primary-container" /> : <Circle size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />}
                  
                  {editingTaskId === task.id ? (
                    <form onSubmit={saveTaskEdit} className="flex-1" onClick={e => e.stopPropagation()}>
                      <input 
                        autoFocus
                        className="w-full bg-surface-high p-1 rounded border border-primary text-xs focus:outline-none text-white"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        onBlur={() => setEditingTaskId(null)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                      />
                    </form>
                  ) : (
                    <span className={task.completed ? "line-through text-on-surface-variant" : "text-white group-hover:text-primary-container transition-colors"}>
                      {task.title}
                    </span>
                  )}
                </div>

                {!task.completed && editingTaskId !== task.id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => startEditingTask(e, task)}
                      className="p-1 hover:text-primary"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteTask(e, task.id)}
                      className="p-1 hover:text-error"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
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
                  className="flex-1 bg-surface-high p-2 rounded-lg border border-outline-variant text-xs focus:outline-none focus:border-primary text-white"
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

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Extract Task from Milestone?"
        message="This task will be permanently removed from your stellar roadmap. Proceed with extraction?"
        confirmText="Confirm Extraction"
      />
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

const AmbitionCard = ({ ambition, isPriority }: { ambition: any; isPriority?: boolean; key?: any }) => {
  const { addMilestone, updateAmbition } = useTrackStore();
  const [isOpen, setIsOpen] = useState(isPriority || false);
  const [isEditingAmbition, setIsEditingAmbition] = useState(false);
  const [editAmbitionTitle, setEditAmbitionTitle] = useState(ambition.title);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(ambition.id, newMilestoneTitle);
    SoundManager.playPop();
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const startEditingAmbition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingAmbition(true);
    setEditAmbitionTitle(ambition.title);
  };

  const saveAmbitionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editAmbitionTitle.trim()) {
      updateAmbition(ambition.id, editAmbitionTitle);
      SoundManager.playPop();
    }
    setIsEditingAmbition(false);
  };

  return (
    <motion.div 
      className={`glass-panel border-2 rounded-3xl mb-6 relative overflow-hidden transition-colors ${isPriority ? 'border-primary-container p-8' : 'border-outline-variant p-6 hover:border-primary/50'}`}
      initial={isPriority ? { y: 20, opacity: 0 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div 
        className={`flex justify-between items-start cursor-pointer ${!isPriority ? 'mb-2' : 'mb-6'}`}
        onClick={() => !isPriority && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 flex-1">
          {!isPriority && (
            <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary-container shrink-0">
              <Zap size={24} />
            </div>
          )}
          <div className="flex-1">
            <span className="text-primary-container text-xs font-bold uppercase tracking-widest">
              {isPriority ? 'Priority Zero' : 'Secondary Ambition'}
            </span>
            
            {isEditingAmbition ? (
              <form onSubmit={saveAmbitionEdit} className="mt-1" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus
                  className={`w-full bg-surface-high p-2 rounded-xl border border-primary font-display font-bold text-white focus:outline-none ${isPriority ? 'text-2xl' : 'text-lg'}`}
                  value={editAmbitionTitle}
                  onChange={(e) => setEditAmbitionTitle(e.target.value)}
                  onBlur={() => setIsEditingAmbition(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsEditingAmbition(false)}
                />
              </form>
            ) : (
              <div className="flex items-center gap-3 group/title">
                <h1 className={`${isPriority ? 'text-2xl' : 'text-lg'} font-display font-bold text-white mt-1`}>{ambition.title}</h1>
                <button 
                  onClick={startEditingAmbition}
                  className="opacity-0 group-hover/title:opacity-100 p-1 hover:text-primary transition-all mt-1"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            
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
                  className="flex-1 bg-surface-high p-3 rounded-xl border border-primary focus:outline-none text-sm text-white"
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
  const { ambitions, addAmbition } = useTrackStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLaunch = async (title: string) => {
    await addAmbition(title);
  };

  return (
    <div className="p-6 lg:pl-80 space-y-8 bg-surface-lowest min-h-screen text-white pb-24">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Architect Mode</h2>
          <h1 className="text-4xl font-display font-black text-primary text-glow-primary">The Nebula Map</h1>
          <p className="text-on-surface-variant">Deconstruct your ambitions into stellar milestones.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-3 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] transition-all group border-2 border-primary/20"
        >
          <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          <span>LAUNCH TRAJECTORY</span>
        </motion.button>
      </header>
      
      {ambitions.length === 0 ? (
        <div className="glass-panel border-2 border-dashed border-outline-variant rounded-[3.5rem] p-24 flex flex-col items-center justify-center text-center space-y-8 transition-all hover:border-primary/30 group">
          <div className="w-28 h-28 bg-surface-high/50 rounded-full flex items-center justify-center text-on-surface-variant opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
            <Rocket size={56} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Nebula Silent</h2>
            <p className="text-on-surface-variant max-w-md mt-3 leading-relaxed">Your mission log is empty. Initiate your first orbital trajectory to begin deconstructing complex objectives into actionable steps.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary/10 text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-primary/20 hover:bg-primary hover:text-on-primary transition-all"
          >
            INITIATE FIRST LAUNCH
          </button>
        </div>
      ) : (
        <>
          {ambitions.slice(0, 1).map((goal) => (
            <AmbitionCard key={goal.id} ambition={goal} isPriority />
          ))}

          {ambitions.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-4">Trajectory Fleet</h3>
              {ambitions.slice(1).map((sg) => (
                <AmbitionCard key={sg.id} ambition={sg} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bottom Grid for Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-48">
        <ComputeRelayCard />
        <NextMilestoneCard />
      </section>

      <CommandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLaunch}
        title="Launch New Trajectory"
        placeholder="Name your next macro ambition..."
        icon={Rocket}
      />
    </div>
  );
};

export default NebulaMap;
