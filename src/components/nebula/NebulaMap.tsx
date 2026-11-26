import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Circle, Zap, Clock, Cpu, Plus, Send, Rocket, X, Edit2, Trash2, Timer, AlertTriangle, Calendar, MoreVertical } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { getTodayLocalISO } from '../../utils/DateTimeUtils';
import CommandModal from '../layout/CommandModal';
import ConfirmModal from '../layout/ConfirmModal';
import { ActionMenu } from '../layout/ActionMenu';
import { useVocabulary } from '../../utils/vocabulary';

const MilestoneCard = ({ milestone, ambitionId }: { milestone: any; ambitionId: string; key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isEditingMilestone, setIsEditingMilestone] = useState(false);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState(milestone.title);
  
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');
  const [editTaskEndTime, setEditTaskEndTime] = useState('');
  const [editTaskDeadline, setEditTaskDeadline] = useState('');
  const [editTaskDate, setEditTaskDate] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDate, setNewDate] = useState(getTodayLocalISO());
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteMilestoneModalOpen, setIsDeleteMilestoneModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const { toggleMilestoneTask, addMilestoneTask, updateMilestoneTask, updateMilestone, deleteMilestoneTask, deleteMilestone, preferences } = useTrackStore();
  
  const totalTasks = milestone.tasks?.length || 0;
  const completedTasks = milestone.tasks?.filter((t: any) => t.completed).length || 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addMilestoneTask(ambitionId, milestone.id, newTaskTitle, {
      time: newTime,
      endTime: newEndTime || undefined,
      deadline: newDeadline || undefined,
      plannedDate: newDate,
      horizon: 'daily'
    });
    SoundManager.playPop();
    setNewTaskTitle('');
    setNewEndTime('');
    setNewDeadline('');
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
    setEditTaskTime(task.time || '09:00');
    setEditTaskEndTime(task.endTime || '');
    setEditTaskDeadline(task.deadline || '');
    setEditTaskDate(task.plannedDate || getTodayLocalISO());
  };

  const saveTaskEdit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingTaskId) return;

    if (editingTaskId && editTaskTitle.trim()) {
      updateMilestoneTask(ambitionId, milestone.id, editingTaskId, {
        title: editTaskTitle,
        time: editTaskTime,
        endTime: editTaskEndTime || undefined,
        deadline: editTaskDeadline || undefined,
        plannedDate: editTaskDate
      });
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

  const handleDeleteMilestone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preferences.confirmDelete) {
      setIsDeleteMilestoneModalOpen(true);
      return;
    }
    deleteMilestone(ambitionId, milestone.id);
    SoundManager.playThud();
  };

  const handleDeleteMilestoneConfirm = () => {
    deleteMilestone(ambitionId, milestone.id);
    SoundManager.playThud();
  };

  const startEditingMilestone = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingMilestone(true);
    setEditMilestoneTitle(milestone.title);
  };

  const saveMilestoneEdit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isEditingMilestone) return;
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
                className="w-full bg-surface-high px-3 py-1.5 rounded-xl border border-primary font-bold text-white focus:outline-none type-headline"
                value={editMilestoneTitle}
                onChange={(e) => setEditMilestoneTitle(e.target.value)}
                onBlur={() => saveMilestoneEdit()}
                onKeyDown={(e) => e.key === 'Escape' && setIsEditingMilestone(false)}
              />
            </form>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="type-title-3 font-bold text-white">{milestone.title}</span>
              <div className="ml-auto lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                <ActionMenu 
                  actions={[
                    { label: 'Edit', icon: Edit2, onClick: startEditingMilestone },
                    { label: 'Collapse', icon: Trash2, onClick: handleDeleteMilestone, variant: 'error' }
                  ]} 
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
            <span className="type-telemetry-base text-secondary font-mono">{completedTasks.toString().padStart(2, '0')}/{totalTasks.toString().padStart(2, '0')}</span>
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
                className="flex flex-col py-3 border-b border-surface-high/30 last:border-0 group relative hover:z-30 focus-within:z-30"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    onClick={() => handleToggleTask(task.id)}
                  >
                    {task.completed ? <CheckCircle size={16} className="text-primary-container" /> : <Circle size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />}
                    
                    {editingTaskId === task.id ? (
                      <form onSubmit={saveTaskEdit} className="flex-1 flex flex-col gap-3 p-4 bg-surface-high rounded-2xl border border-primary/50" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus
                          className="w-full bg-transparent border-b border-primary/30 py-1 font-bold text-white focus:outline-none focus:border-primary type-headline"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          onBlur={() => saveTaskEdit()}
                          onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="type-overline text-on-surface-variant">Entry</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Clock size={12} className="text-primary" />
                              <input type="time" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none" value={editTaskTime} onChange={e => setEditTaskTime(e.target.value)} onBlur={() => saveTaskEdit()} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="type-overline text-on-surface-variant">Descent</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Timer size={12} className="text-secondary" />
                              <input type="time" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none" value={editTaskEndTime} onChange={e => setEditTaskEndTime(e.target.value)} onBlur={() => saveTaskEdit()} />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="type-overline text-on-surface-variant">Mission Date</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Calendar size={12} className="text-primary-container" />
                              <input type="date" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none uppercase" value={editTaskDate} onChange={e => setEditTaskDate(e.target.value)} onBlur={() => saveTaskEdit()} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="type-overline text-error">Deadline Lock</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-error/30">
                              <AlertTriangle size={12} className="text-error" />
                              <input type="datetime-local" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none" value={editTaskDeadline} onChange={e => setEditTaskDeadline(e.target.value)} onBlur={() => saveTaskEdit()} />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button type="button" onClick={() => setEditingTaskId(null)} className="h-9 px-3 text-xs type-overline text-on-surface-variant touch-target-compact">Cancel</button>
                          <button type="submit" className="h-9 px-4 bg-primary text-on-primary rounded-xl type-overline touch-target-compact">Save Parameters</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col">
                        <span className={`type-headline text-sm font-bold ${task.completed ? "line-through text-on-surface-variant" : "text-white group-hover:text-primary-container transition-colors"}`}>
                          {task.title}
                        </span>
                        <div className="flex gap-3 mt-1">
                           <div className="flex items-center gap-1 type-telemetry-micro text-on-surface-variant font-mono">
                             <Clock size={10} /> {task.time || '09:00'}
                           </div>
                           {task.deadline && (
                             <div className="flex items-center gap-1 type-telemetry-micro text-error/70 font-mono">
                               <AlertTriangle size={10} /> {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </div>
                           )}
                           <div className="flex items-center gap-1 type-telemetry-micro text-on-surface-variant/60 font-mono uppercase">
                             <Calendar size={10} /> {task.plannedDate || 'Undated'}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!task.completed && editingTaskId !== task.id && (
                    <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                      <ActionMenu 
                        actions={[
                          { label: 'Edit', icon: Edit2, onClick: (e) => startEditingTask(e, task) },
                          { label: 'Extract', icon: Trash2, onClick: (e) => handleDeleteTask(e, task.id), variant: 'error' }
                        ]} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!isAddingTask ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
                className="flex items-center gap-2 py-2 type-overline text-primary hover:text-primary-container transition-colors mt-2"
              >
                <Plus size={14} />
                <span>SPLIT INTO NEW TASK</span>
              </button>
            ) : (
              <form onSubmit={handleAddTask} className="flex flex-col gap-4 mt-2 p-4 bg-surface-high/30 rounded-2xl border border-dashed border-outline-variant" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    className="flex-1 bg-surface-high h-10 px-3 rounded-xl border border-outline-variant text-xs focus:outline-none focus:border-primary text-white type-body"
                    placeholder="Sub-task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  <button type="submit" className="h-10 px-4 bg-primary-container text-on-primary rounded-xl shrink-0 flex items-center justify-center touch-target-compact">
                    <Send size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="type-overline text-on-surface-variant">Entry Time</label>
                    <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                      <Clock size={12} className="text-primary" />
                      <input type="time" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none" value={newTime} onChange={e => setNewTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="type-overline text-on-surface-variant">Planned Date</label>
                    <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                      <Calendar size={12} className="text-secondary" />
                      <input type="date" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none uppercase" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="type-overline text-error">Deadline Protocol (Optional)</label>
                  <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-error/20">
                    <AlertTriangle size={12} className="text-error" />
                    <input type="datetime-local" className="bg-transparent text-xs type-telemetry-base text-white focus:outline-none w-full" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setIsAddingTask(false)}
                  className="text-center type-overline text-on-surface-variant py-1.5 hover:text-white transition-colors"
                >
                  Cancel Uplink
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

      <ConfirmModal 
        isOpen={isDeleteMilestoneModalOpen}
        onClose={() => setIsDeleteMilestoneModalOpen(false)}
        onConfirm={handleDeleteMilestoneConfirm}
        title="Collapse Milestone?"
        message="This milestone and all its sub-tasks will be permanently archived into the void. Proceed?"
        confirmText="Confirm Collapse"
      />
    </div>
  );
};

const NextMilestoneCard = () => (
  <div className="glass-panel card-standard border border-outline-variant rounded-2xl sm:rounded-3xl h-full flex flex-col justify-between relative overflow-hidden group hover:border-primary-container transition-colors">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <Clock size={120} />
    </div>
    <div>
      <h3 className="type-overline text-on-surface-variant mb-1">NEXT MILESTONE</h3>
    </div>
    <div>
      <div className="type-telemetry-base text-primary-container mb-1">In 4 hours</div>
      <div className="type-title-2 font-bold text-white">System Sync</div>
    </div>
  </div>
);

const ComputeRelayCard = () => (
  <div className="glass-panel card-standard border border-outline-variant rounded-2xl sm:rounded-3xl h-full bg-gradient-to-br from-secondary/20 to-transparent flex flex-col justify-between">
    <Cpu className="text-secondary" size={32} />
    <div>
      <h3 className="type-title-2 font-bold text-white mb-1">Compute<br/>Relay</h3>
      <div className="w-full h-1.5 bg-surface-high mt-4 rounded-full overflow-hidden">
        <div className="h-full bg-secondary w-2/3" />
      </div>
    </div>
  </div>
);

const AmbitionCard = ({ ambition, isPriority }: { ambition: any; isPriority?: boolean; key?: any }) => {
  const { addMilestone, updateAmbition, deleteAmbition, preferences } = useTrackStore();
  const [isOpen, setIsOpen] = useState(isPriority || false);
  const [isEditingAmbition, setIsEditingAmbition] = useState(false);
  const [editAmbitionTitle, setEditAmbitionTitle] = useState(ambition.title);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(ambition.id, newMilestoneTitle);
    SoundManager.playPop();
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const startEditingAmbition = () => {
    setIsEditingAmbition(true);
    setEditAmbitionTitle(ambition.title);
  };

  const saveAmbitionEdit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isEditingAmbition) return;
    if (editAmbitionTitle.trim()) {
      updateAmbition(ambition.id, editAmbitionTitle);
      SoundManager.playPop();
    }
    setIsEditingAmbition(false);
  };

  const handleDeleteAmbition = () => {
    if (preferences.confirmDelete) {
      setIsDeleteModalOpen(true);
      return;
    }
    deleteAmbition(ambition.id);
    SoundManager.playThud();
  };

  const handleDeleteConfirm = () => {
    deleteAmbition(ambition.id);
    SoundManager.playThud();
  };

  return (
    <motion.div 
      className={`glass-panel border-2 rounded-2xl sm:rounded-3xl mb-6 relative overflow-hidden transition-colors ${isPriority ? 'border-primary-container card-standard sm:card-spacious' : 'border-outline-variant card-standard hover:border-primary/50'}`}
      initial={isPriority ? { y: 20, opacity: 0 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div 
        className={`flex justify-between items-start ${!isPriority ? 'mb-2 cursor-pointer' : 'mb-6 cursor-default'}`}
        onClick={() => !isPriority && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 flex-1">
          {!isPriority && (
            <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary-container shrink-0">
              <Zap size={24} />
            </div>
          )}
          <div className="flex-1">
            <span className="type-overline text-primary-container">
              {isPriority ? 'Priority Zero' : 'Secondary Ambition'}
            </span>
            
            {isEditingAmbition ? (
              <form onSubmit={saveAmbitionEdit} className="mt-1" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus
                  className={`w-full bg-surface-high p-2 rounded-xl border border-primary font-display font-bold text-white focus:outline-none ${isPriority ? 'type-title-1' : 'type-title-2'}`}
                  value={editAmbitionTitle}
                  onChange={(e) => setEditAmbitionTitle(e.target.value)}
                  onBlur={() => saveAmbitionEdit()}
                  onKeyDown={(e) => e.key === 'Escape' && setIsEditingAmbition(false)}
                />
              </form>
            ) : (
              <div className="flex items-center gap-3 group/title">
                <h1 className={`${isPriority ? 'type-title-1' : 'type-title-2'} font-display font-bold text-white mt-1`}>{ambition.title}</h1>
                <div className="mt-1 lg:opacity-0 lg:group-hover/title:opacity-100 transition-all">
                  <ActionMenu 
                    actions={[
                      { label: 'Edit', icon: Edit2, onClick: startEditingAmbition },
                      { label: 'Abort', icon: Trash2, onClick: handleDeleteAmbition, variant: 'error' }
                    ]} 
                  />
                </div>
              </div>
            )}
            
            {!isPriority && !isOpen && (
              <p className="type-body text-xs text-on-surface-variant">
                {(ambition.milestones || []).length} Milestones • {(ambition.milestones || []).filter((m: any) => m.status === 'pending').length} Pending
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`${isPriority ? 'w-16 h-16 type-title-3' : 'w-10 h-10 type-telemetry-micro'} rounded-full border-2 border-primary-container flex items-center justify-center font-bold text-primary`}>
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
                className="w-full h-12 glass-panel border border-dashed border-outline-variant px-4 rounded-2xl flex items-center justify-center gap-2 type-overline text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors group touch-target"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                <span>Deconstruct into new milestone</span>
              </button>
            ) : (
              <form onSubmit={handleAddMilestone} className="flex gap-2 p-2">
                <input 
                  autoFocus
                  className="flex-1 bg-surface-high h-10 px-4 rounded-xl border border-primary focus:outline-none type-body text-sm text-white"
                  placeholder="Milestone title..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                />
                <button type="submit" className="h-10 px-4 bg-primary-container text-on-primary rounded-xl shrink-0 flex items-center justify-center touch-target-compact">
                  <Send size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingMilestone(false)}
                  className="h-10 px-4 text-on-surface-variant hover:text-white type-overline touch-target-compact"
                >
                  CANCEL
                </button>
              </form>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Abort Trajectory?"
        message="This will permanently delete the entire trajectory, including all milestones and tasks. This action cannot be reversed."
        confirmText="Confirm Abort"
      />
    </motion.div>
  );
};

const NebulaMap = () => {
  const { ambitions, addAmbition } = useTrackStore();
  const { t, isPeopleMode } = useVocabulary();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLaunch = async (title: string) => {
    await addAmbition(title);
  };

  return (
    <div className="p-4 sm:p-6 lg:pl-80 space-y-8 bg-surface-lowest min-h-dvh text-on-surface pb-32 overflow-x-hidden">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-secondary type-overline">{isPeopleMode ? 'Goals & Ambitions' : 'Architect Mode'}</h2>
          <h1 className="type-display text-primary text-glow-primary uppercase">{isPeopleMode ? 'Goals Map' : 'The Nebula Map'}</h1>
          <p className="type-body text-on-surface-variant mt-1">
            {isPeopleMode ? 'Deconstruct your goals into manageable milestones.' : 'Deconstruct your ambitions into stellar milestones.'}
          </p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-container text-on-primary-container h-12 px-6 rounded-2xl type-overline hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] transition-all group border-2 border-primary/20 touch-target"
        >
          <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          <span>{isPeopleMode ? 'CREATE NEW GOAL' : 'LAUNCH TRAJECTORY'}</span>
        </motion.button>
      </header>
      
      {ambitions.length === 0 ? (
        <div className="glass-panel border-2 border-dashed border-outline-variant card-spacious rounded-3xl p-12 sm:p-24 flex flex-col items-center justify-center text-center space-y-6 transition-all hover:border-primary/30 group">
          <div className="w-24 h-24 bg-surface-high/50 rounded-full flex items-center justify-center text-on-surface-variant opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
            <Rocket size={48} />
          </div>
          <div>
            <h2 className="type-title-1 text-white uppercase">Nebula Silent</h2>
            <p className="type-body text-on-surface-variant max-w-md mt-2 leading-relaxed">Your mission log is empty. Initiate your first orbital trajectory to begin deconstructing complex objectives into actionable steps.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary/10 text-primary h-12 px-8 rounded-2xl type-overline border border-primary/20 hover:bg-primary hover:text-on-primary transition-all touch-target"
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-48">
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
