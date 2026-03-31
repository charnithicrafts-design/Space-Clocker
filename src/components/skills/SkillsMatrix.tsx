import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore, Skill } from '../../store/useTrackStore';
import { Brain, Target, Info, ChevronRight, Plus, Trash2, Edit3, Check, X, User, Globe } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

const RadarChart = ({ skills, showTarget }: { skills: Skill[], showTarget: boolean }) => {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.4;
  
  // Radar chart needs at least 3 points to look like a polygon
  const displaySkills = skills.length >= 3 ? skills : [
    ...skills,
    ...Array(Math.max(0, 3 - skills.length)).fill(null).map((_, i) => ({
      id: `placeholder-${i}`,
      name: '---',
      currentProficiency: 0,
      targetProficiency: 0,
      recommendation: '',
      type: 'personal' as const
    }))
  ];

  const angleStep = (Math.PI * 2) / displaySkills.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const currentPoints = useMemo(() => 
    displaySkills.map((s, i) => {
      const { x, y } = getCoordinates(s.currentProficiency, i);
      return `${x},${y}`;
    }).join(' '), [displaySkills]);

  const targetPoints = useMemo(() => 
    displaySkills.map((s, i) => {
      const { x, y } = getCoordinates(s.targetProficiency, i);
      return `${x},${y}`;
    }).join(' '), [displaySkills]);

  return (
    <div className="relative flex justify-center items-center">
      <svg width={size} height={size} className="drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
        {/* Grid Circles */}
        {[20, 40, 60, 80, 100].map((tick) => (
          <circle
            key={tick}
            cx={center}
            cy={center}
            r={(tick / 100) * radius}
            fill="none"
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {displaySkills.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          );
        })}

        {/* Labels */}
        {displaySkills.map((s, i) => {
          const { x, y } = getCoordinates(115, i);
          const nameLines = s.name.split(' & ');
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-on-surface-variant text-[9px] font-black tracking-tighter uppercase"
            >
              {nameLines.map((line: string, idx: number) => (
                <tspan key={idx} x={x} dy={idx === 0 ? 0 : 10}>{line}</tspan>
              ))}
            </text>
          );
        })}

        {/* Target Proficiency Polygon */}
        <AnimatePresence>
          {showTarget && (
            <motion.polygon
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              points={targetPoints}
              fill="rgba(217, 70, 239, 0.1)"
              stroke="rgba(217, 70, 239, 0.5)"
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]"
            />
          )}
        </AnimatePresence>

        {/* Current Proficiency Polygon */}
        <motion.polygon
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          points={currentPoints}
          fill="rgba(34, 211, 238, 0.2)"
          stroke="rgba(34, 211, 238, 0.8)"
          strokeWidth="3"
          className="drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
        />

        {/* Data Points */}
        {displaySkills.map((s, i) => {
          const { x, y } = getCoordinates(s.currentProficiency, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-primary drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
            />
          );
        })}
      </svg>
    </div>
  );
};

const SkillGapCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  const { updateSkill, deleteSkill, preferences } = useTrackStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(skill.name);
  const [editCurrent, setEditCurrent] = useState(skill.currentProficiency);
  const [editTarget, setEditTarget] = useState(skill.targetProficiency);
  const [editRec, setEditRec] = useState(skill.recommendation);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSkill(skill.id, {
      name: editName,
      currentProficiency: editCurrent,
      targetProficiency: editTarget,
      recommendation: editRec
    });
    SoundManager.playPop();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (preferences.confirmDelete && !window.confirm(`Eject '${skill.name}' from the matrix?`)) return;
    await deleteSkill(skill.id);
    SoundManager.playThud();
  };

  return (
    <motion.div layout className="glass-panel border border-outline-variant rounded-3xl overflow-hidden hover:border-primary/40 transition-colors group">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div 
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-white text-base tracking-tight">{skill.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">{skill.currentProficiency}% Proficiency</span>
                  <span className="text-[10px] text-on-surface-variant">/</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{skill.targetProficiency}% Target</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-surface-high rounded-xl text-on-surface-variant hover:text-primary transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={handleDelete} className="p-2 hover:bg-surface-high rounded-xl text-on-surface-variant hover:text-error transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="relative w-full h-2 bg-surface-high rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.currentProficiency}%` }}
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]"
              />
              <div 
                className="absolute top-0 bottom-0 w-1 bg-magenta shadow-[0_0_8px_rgba(217,70,239,1)] z-10"
                style={{ left: `${skill.targetProficiency}%` }}
              />
            </div>

            <div className="flex gap-3 items-start p-3 bg-surface-low rounded-2xl border border-outline-variant/30">
              <Info size={14} className="text-secondary mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
                {skill.recommendation}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSave}
            className="p-5 space-y-4 bg-surface-low"
          >
            <div className="space-y-3">
              <input 
                className="w-full bg-surface-high px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:outline-none text-sm text-white"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Skill Name"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-on-surface-variant px-1">Current %</label>
                  <input 
                    type="number"
                    className="w-full bg-surface-high px-4 py-2 rounded-xl border border-outline-variant text-sm"
                    value={editCurrent}
                    onChange={e => setEditCurrent(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-on-surface-variant px-1">Target %</label>
                  <input 
                    type="number"
                    className="w-full bg-surface-high px-4 py-2 rounded-xl border border-outline-variant text-sm"
                    value={editTarget}
                    onChange={e => setEditTarget(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <textarea 
                className="w-full bg-surface-high px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:outline-none text-xs text-on-surface-variant min-h-[80px]"
                value={editRec}
                onChange={e => setEditRec(e.target.value)}
                placeholder="Recommendation / Action Plan"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Check size={12} />
                Confirm
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AddSkillForm = ({ categoryId, categoryType, onCancel }: { categoryId?: string, categoryType: 'personal' | 'ambition', onCancel: () => void }) => {
  const { addSkill } = useTrackStore();
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(100);
  const [rec, setRec] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addSkill(name, current, target, rec, categoryType, categoryId);
    SoundManager.playPop();
    onCancel();
  };

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden mb-8"
    >
      <form onSubmit={handleSubmit} className="glass-panel border border-primary/30 p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
          <Plus size={14} />
          Initialize New Skill Parameter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input 
              autoFocus
              className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-primary focus:outline-none text-sm transition-all"
              placeholder="Skill Name (e.g. Astro-Navigation)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Current %</label>
                <input 
                  type="number"
                  className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant text-sm"
                  value={current}
                  onChange={e => setCurrent(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Target %</label>
                <input 
                  type="number"
                  className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant text-sm"
                  value={target}
                  onChange={e => setTarget(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <textarea 
              className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-primary focus:outline-none text-sm transition-all h-[calc(100%-0px)] min-h-[120px]"
              placeholder="Gap analysis recommendation..."
              value={rec}
              onChange={e => setRec(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-white transition-all">
            Cancel
          </button>
          <button type="submit" className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.4)] transition-all">
            Uplink Skill
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const SkillsMatrix = () => {
  const { skills, ambitions } = useTrackStore();
  const [showTarget, setShowTarget] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<'all' | 'personal' | string>('all');
  const [isAdding, setIsAdding] = useState(false);

  const categories = useMemo(() => {
    const cats = [
      { id: 'all', label: 'All Sectors', icon: Globe, type: 'all' },
      { id: 'personal', label: 'Personal Track', icon: User, type: 'personal' },
    ];
    ambitions.forEach(a => {
      cats.push({ id: a.id, label: a.title, icon: Target, type: 'ambition' });
    });
    return cats;
  }, [ambitions]);

  const filteredSkills = useMemo(() => {
    if (selectedCategoryId === 'all') return skills;
    if (selectedCategoryId === 'personal') return skills.filter(s => s.type === 'personal');
    return skills.filter(s => s.ambitionId === selectedCategoryId);
  }, [skills, selectedCategoryId]);

  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">The Skills Matrix</h2>
          <h1 className="text-4xl font-display font-black text-primary">Technical Proficiency</h1>
        </div>
        <div className="flex items-center gap-4 glass-panel p-2 px-4 rounded-full border border-outline-variant">
          <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${!showTarget ? 'text-primary' : 'text-on-surface-variant'}`}>Current</span>
          <button 
            onClick={() => setShowTarget(!showTarget)}
            className="w-10 h-5 bg-surface-high rounded-full relative p-1 transition-colors"
          >
            <motion.div 
              animate={{ x: showTarget ? 20 : 0 }}
              className="w-3 h-3 bg-white rounded-full shadow-lg"
            />
          </button>
          <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${showTarget ? 'text-secondary' : 'text-on-surface-variant'}`}>Target</span>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-surface-high/50 rounded-2xl border border-outline-variant w-fit">
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategoryId(cat.id); setIsAdding(false); SoundManager.playPop(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${isActive ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-skill-cat"
                  className="absolute inset-0 bg-surface-low rounded-xl border border-outline-variant shadow-lg"
                />
              )}
              <Icon size={14} className={`relative z-10 ${isActive ? 'text-primary' : ''}`} />
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategoryId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <section className="flex flex-col items-center">
            <RadarChart skills={filteredSkills} showTarget={showTarget} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Target className="text-primary" size={20} />
                <h3 className="font-display font-black text-xl uppercase tracking-tight">Gap Analysis: {activeCategory?.label}</h3>
              </div>
              {selectedCategoryId !== 'all' && (
                <button 
                  onClick={() => setIsAdding(!isAdding)}
                  className="p-2 px-4 bg-primary/10 border border-primary/30 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2"
                >
                  {isAdding ? <X size={14} /> : <Plus size={14} />}
                  {isAdding ? 'Cancel' : 'Add Skill'}
                </button>
              )}
            </div>

            <AnimatePresence>
              {isAdding && (
                <AddSkillForm 
                  categoryId={selectedCategoryId === 'personal' ? undefined : selectedCategoryId} 
                  categoryType={selectedCategoryId === 'personal' ? 'personal' : 'ambition'}
                  onCancel={() => setIsAdding(false)}
                />
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSkills.map((skill) => (
                <SkillGapCard key={skill.id} skill={skill} />
              ))}
              {filteredSkills.length === 0 && !isAdding && (
                <div className="col-span-full py-20 text-center glass-panel border border-outline-variant border-dashed rounded-3xl opacity-40">
                  <div className="text-on-surface-variant font-display font-black text-2xl uppercase italic">No Skills Mapped in this Sector</div>
                  <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] mt-2">Initialize parameters to begin analysis.</p>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-center pt-8">
        <button className="glass-panel border border-primary/30 p-4 px-8 rounded-2xl flex items-center gap-3 hover:bg-primary/10 transition-colors group">
            <Brain className="text-primary" />
            <span className="font-bold tracking-tight">Generate AI Trajectory Update</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SkillsMatrix;
