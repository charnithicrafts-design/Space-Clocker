import { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Rocket, 
  Infinity as InfinityIcon, 
  Check, 
  AlertTriangle, 
  LayoutDashboard, 
  Compass, 
  RefreshCw, 
  Sun,
  X,
  TrendingUp,
  Filter,
  Rocket as RocketLaunch,
  Cpu,
  ChevronDown,
  GripVertical,
  GitBranch,
  BrainCircuit,
  Database,
  ShieldAlert,
  Cloud,
  Telescope,
  Settings
} from 'lucide-react';
import { soundManager } from './utils/SoundManager';

type Tab = 'dashboard' | 'nebula' | 'orbit' | 'void';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('orbit');
  const [showReflection, setShowReflection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [, setTick] = useState(0);

  const forceUpdate = () => setTick(t => t + 1);

  const handleMissedTask = () => {
    soundManager.playSwell();
    setShowReflection(true);
  };

  const handleTabChange = (tab: Tab) => {
    if (tab !== activeTab) {
      soundManager.playNav();
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-surface-lowest text-on-surface pb-24 selection:bg-primary-container/30 overflow-x-hidden">
      <Header onOpenSettings={() => setShowSettings(true)} />
      
      <main className="px-6 pt-24 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <DashboardScreen />
            </motion.div>
          )}
          {activeTab === 'nebula' && (
            <motion.div key="nebula" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <NebulaScreen />
            </motion.div>
          )}
          {activeTab === 'orbit' && (
            <motion.div key="orbit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-12">
              <OrbitScreen onMissedTask={handleMissedTask} />
            </motion.div>
          )}
          {activeTab === 'void' && (
            <motion.div key="void" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <VoidScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <AnimatePresence>
        {showReflection && (
          <ReflectionModal onClose={() => setShowReflection(false)} />
        )}
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)} 
            onSettingsChange={forceUpdate} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-lowest/80 backdrop-blur-xl border-b border-white/5 nebula-shadow">
      <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-high border border-outline-variant/30 flex items-center justify-center overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina&backgroundColor=1d2026" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display font-bold text-lg text-primary-container tracking-tight">
            Nithya | MCA
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-low hover:bg-surface transition-colors"
          >
            <Settings className="w-5 h-5 text-on-surface-variant hover:text-on-surface transition-colors" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => soundManager.playLevelUp()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-low hover:bg-surface transition-colors"
          >
            <Zap className="w-5 h-5 text-primary-container" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

/* =========================================
   SCREEN 1: DASHBOARD
   ========================================= */
function DashboardScreen() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">
              Momentum Engine
            </span>
            <h2 className="font-display text-5xl font-black text-primary leading-none tracking-tighter mt-1">
              LVL 42
            </h2>
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/5 nebula-shadow">
            <TrendingUp className="w-4 h-4 text-tertiary-fixed" />
            <span className="font-display font-bold text-sm text-tertiary-fixed">+12%</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-surface-highest rounded-full mt-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary-container to-primary shadow-[0_0_12px_rgba(0,242,255,0.5)]" 
          />
        </div>
        <p className="font-sans text-[10px] text-on-surface-variant/60 mt-3 uppercase tracking-widest">
          Next resonance shift in 2,400xp
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl font-bold tracking-tight text-on-surface">Macro Ambitions</h3>
          <Filter className="w-5 h-5 text-on-surface-variant" />
        </div>

        {/* Ambition Card 1 */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display text-lg font-bold text-primary mb-1">Quantum-ML Navigation</h4>
              <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest">Project: ISRO Hackathon</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-tertiary-container/30 flex items-center justify-center bg-tertiary-container/5 shadow-[0_0_15px_rgba(67,243,222,0.2)]">
              <span className="font-display font-bold text-tertiary-container text-xs">72%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-sans text-on-surface-variant/80 uppercase tracking-tighter">
              <span>Current Phase: Tensor Optimization</span>
              <span>08 / 12 Segments</span>
            </div>
            <div className="h-2 w-full bg-surface-lowest rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-tertiary-container to-tertiary-fixed rounded-full shadow-[0_0_10px_rgba(67,243,222,0.4)]" />
            </div>
          </div>
        </motion.div>

        {/* Ambition Card 2 */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display text-lg font-bold text-secondary mb-1">NASA Internship Prep</h4>
              <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest">Focus: Astrodynamics</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-secondary/30 flex items-center justify-center bg-secondary/5 shadow-[0_0_15px_rgba(218,185,255,0.2)]">
              <span className="font-display font-bold text-secondary text-xs">38%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-sans text-on-surface-variant/80 uppercase tracking-tighter">
              <span>Orbital Mechanics Review</span>
              <span>Milestone Reach: Near</span>
            </div>
            <div className="h-2 w-full bg-surface-lowest rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '38%' }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full shadow-[0_0_10px_rgba(218,185,255,0.4)]" />
            </div>
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <RocketLaunch className="w-5 h-5 text-primary-container mb-1" />
          <span className="text-2xl font-display font-bold text-on-surface">04</span>
          <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Active Missions</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <Zap className="w-5 h-5 text-tertiary-fixed mb-1" />
          <span className="text-2xl font-display font-bold text-on-surface">1.2k</span>
          <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Energy Output</span>
        </div>
      </div>

      <div className="bg-surface-low rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <ShieldAlert className="w-5 h-5 text-error" />
          <h4 className="font-display font-bold text-on-surface">Simulation Anomaly</h4>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Quantum state coherence dropped during the last ML training run. Automated debugging scripts dispatched for inspection.
        </p>
        <button className="mt-4 font-sans text-xs font-bold text-primary-container uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-80 transition-opacity">
          View Diagnostics <span className="text-lg leading-none">›</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================
   SCREEN 2: NEBULA (Architect Mode)
   ========================================= */
function NebulaScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Orbital Mechanics', completed: true },
    { id: 2, title: 'Complete ML Certification', completed: false },
  ]);

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) soundManager.playPop();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-secondary mb-2">Architect Mode</p>
        <h2 className="font-display text-4xl font-black text-on-surface leading-tight tracking-tighter">The Nebula Map</h2>
        <p className="text-on-surface-variant mt-2 text-sm max-w-[280px]">Deconstruct your ambitions into stellar milestones.</p>
      </div>

      <div className="space-y-4">
        {/* Active Ambition */}
        <div className="bg-surface-high rounded-xl p-6 shadow-[0px_24px_48px_rgba(0,242,255,0.06)] border-l-4 border-primary-container">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-container/10 text-primary-container text-[10px] font-bold tracking-widest uppercase mb-2">
                Priority Zero
              </span>
              <h3 className="font-display text-xl font-bold text-on-surface">ISRO Scientist 'SC' Exam</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tertiary-container/10 relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(67,243,222,0.2)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#43f3de" strokeWidth="4" strokeDasharray="125" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold text-tertiary-container">64%</span>
            </div>
          </div>

          {/* Nested Goals */}
          <div className="mt-6 flex gap-4">
            <div className="w-px bg-gradient-to-b from-primary-container to-transparent ml-2" />
            <div className="flex-1 space-y-3">
              {tasks.map(task => (
                <motion.div 
                  key={task.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTask(task.id)}
                  className={`
                    p-3 rounded-lg flex items-center justify-between cursor-pointer border
                    ${task.completed ? 'bg-surface-low border-white/5' : 'bg-surface border-primary-container/30 shadow-[0_0_15px_rgba(0,242,255,0.1)]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className={`w-4 h-4 ${task.completed ? 'text-on-surface-variant/50' : 'text-primary-container'}`} />
                    <span className={`text-sm font-medium ${task.completed ? 'text-on-surface-variant line-through' : 'text-primary'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.completed ? (
                    <Check className="w-4 h-4 text-tertiary-fixed" />
                  ) : (
                    <GitBranch className="w-4 h-4 text-on-surface-variant hover:text-primary transition-colors" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsed Ambitions */}
        <div className="bg-surface-low rounded-xl p-5 hover:bg-surface-high transition-all cursor-pointer flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">MCA Final Year Thesis</h3>
              <p className="text-xs text-on-surface-variant">12 Sub-goals • 4 Pending</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        </div>

        <div className="bg-surface-low rounded-xl p-5 hover:bg-surface-high transition-all cursor-pointer flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
              <Telescope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Quantum Computing Research</h3>
              <p className="text-xs text-on-surface-variant">3 Sub-goals • Not Started</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        </div>

        {/* Bento Slots */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gradient-to-br from-secondary/20 to-surface-high p-4 rounded-xl aspect-square flex flex-col justify-end border border-secondary/10">
            <Cpu className="w-6 h-6 text-secondary mb-2" />
            <p className="font-display font-bold text-on-surface leading-tight">Quantum<br/>State</p>
            <div className="mt-3 w-full h-1 bg-surface-lowest rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-2/3" />
            </div>
          </div>
          <div className="bg-surface p-4 rounded-xl aspect-square flex flex-col justify-between border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Next Milestone</p>
            <div>
              <p className="text-xs text-tertiary-fixed font-medium mb-1">In 4 hours</p>
              <p className="font-display font-bold text-on-surface text-lg leading-tight">Thesis Draft</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   SCREEN 3: ORBIT (Daily Scheduler)
   ========================================= */
function OrbitScreen({ onMissedTask }: { onMissedTask: () => void }) {
  return (
    <>
      <Hero />
      <StatsGrid onLevelUp={() => soundManager.playLevelUp()} />
      <TasksList onMissedTask={onMissedTask} />
      <VoidProtocol />
      <ProgressOrbSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold mb-2">
        Current Trajectory
      </p>
      <h2 className="font-display text-5xl font-black text-primary leading-[1.1] tracking-tighter">
        Deep Space<br />Protocol
      </h2>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container/10 blur-[60px] rounded-full pointer-events-none" />
    </section>
  );
}

function StatsGrid({ onLevelUp }: { onLevelUp: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLevelUp}
        className="cursor-pointer bg-surface p-5 rounded-xl flex flex-col justify-between aspect-square hover:bg-surface-high border border-white/5"
      >
        <Rocket className="w-6 h-6 text-tertiary-container" />
        <div>
          <p className="text-4xl font-display font-bold text-on-surface">82%</p>
          <p className="text-xs text-on-surface-variant mt-1">Efficiency</p>
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-surface p-5 rounded-xl flex flex-col justify-between aspect-square hover:bg-surface-high border border-white/5"
      >
        <div className="flex justify-between items-start">
          <InfinityIcon className="w-6 h-6 text-secondary" />
          <div className="bg-secondary/10 px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-bold text-secondary tracking-wider">LIVE</span>
          </div>
        </div>
        <div>
          <p className="text-4xl font-display font-bold text-on-surface">04</p>
          <p className="text-xs text-on-surface-variant mt-1">Active Nodes</p>
        </div>
      </motion.div>
    </div>
  );
}

function TasksList({ onMissedTask }: { onMissedTask: () => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, time: '09:00 AM', title: 'Attend Advanced ML Lecture', completed: true },
    { id: 2, time: '11:30 AM', title: 'Solve 5 Quantum Algorithms', completed: false },
    { id: 3, time: '02:00 PM', title: 'Draft ISRO Application Essay', completed: false },
  ]);

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      soundManager.playPop();
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xl text-on-surface">Today's Focus</h3>
        <span className="text-xs text-primary-container bg-primary-container/10 px-3 py-1 rounded-full font-medium">
          {completedCount}/{tasks.length} Complete
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleTask(task.id)}
              className={`
                p-5 rounded-2xl flex items-center justify-between cursor-pointer border
                ${task.completed ? 'bg-surface-high border-white/5 opacity-60' : 'bg-surface border-white/5 hover:bg-surface-high'}
              `}
            >
              <div className="flex flex-col">
                <span className={`text-xs mb-1 ${task.completed ? 'text-on-surface-variant line-through' : 'text-primary-container'}`}>
                  {task.time}
                </span>
                <span className={`font-bold ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                  {task.title}
                </span>
              </div>
              
              <motion.button 
                layout
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${task.completed 
                    ? 'bg-tertiary-container shadow-[0_0_15px_rgba(67,243,222,0.3)]' 
                    : 'border-2 border-outline-variant/50 hover:border-primary-container/50'
                  }
                `}
              >
                {task.completed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Check className="w-6 h-6 text-surface-lowest" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center pt-2">
        <button 
          onClick={onMissedTask}
          className="text-xs text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-widest font-semibold"
        >
          Report Missed Task
        </button>
      </div>
    </section>
  );
}

function VoidProtocol() {
  const handleNotToDoClick = () => {
    soundManager.playThud();
  };

  return (
    <section className="bg-error-container/10 rounded-3xl p-6 relative overflow-hidden border border-error/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-error/20" />
      
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-error" />
        <h3 className="font-display font-black text-lg tracking-tight uppercase text-error">
          Void Protocol (Not-To-Do)
        </h3>
      </div>
      
      <ul className="space-y-6">
        <NotToDoItem title="Doomscrolling" desc="Avoid infinite scrolling during deep study windows." onClick={handleNotToDoClick} />
        <NotToDoItem title="Context Switching" desc="Communication silence enforced during thesis writing." onClick={handleNotToDoClick} />
        <li className="flex items-start gap-4 opacity-40">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-outline-variant flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-on-surface">Unplanned Debugging</span>
            <span className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">No coding until the mathematical model is verified.</span>
          </div>
        </li>
      </ul>
      
      <div className="mt-8 pt-6 border-t border-error/10">
        <p className="text-[10px] text-error/70 text-center tracking-widest uppercase font-semibold">
          Breaching these protocols impacts orbital stability
        </p>
      </div>
    </section>
  );
}

function NotToDoItem({ title, desc, onClick }: { title: string, desc: string, onClick: () => void }) {
  return (
    <motion.li whileTap={{ scale: 0.98, x: 5 }} onClick={onClick} className="flex items-start gap-4 cursor-pointer group">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 group-hover:scale-150 transition-transform" />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-error">{title}</span>
        <span className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{desc}</span>
      </div>
    </motion.li>
  );
}

function ProgressOrbSection() {
  const percentage = 60;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex justify-center py-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--color-surface-highest)" strokeWidth="12" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            cx="100" cy="100" r={radius} fill="none" stroke="var(--color-tertiary-container)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference}
            className="drop-shadow-[0_0_12px_rgba(67,243,222,0.4)]"
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-5xl font-display font-black text-tertiary-container drop-shadow-[0_0_10px_rgba(67,243,222,0.4)]">{percentage}%</span>
          <span className="text-[10px] text-on-surface-variant tracking-widest font-bold uppercase mt-1">Orbit Sync</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   SCREEN 4: THE VOID (Skills Matrix)
   ========================================= */
function VoidScreen() {
  const [showTarget, setShowTarget] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-black text-primary leading-tight tracking-tighter mb-6">
          Technical Skills Matrix
        </h2>
        
        <div className="inline-flex items-center gap-4 bg-surface-high p-1.5 rounded-full border border-white/5">
          <button 
            onClick={() => { soundManager.playPop(); setShowTarget(true); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${showTarget ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Target Proficiency
          </button>
          <button 
            onClick={() => { soundManager.playPop(); setShowTarget(false); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${!showTarget ? 'bg-secondary/20 text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Current Proficiency
          </button>
        </div>
      </div>

      {/* Radar Chart Visualization */}
      <div className="relative w-full aspect-square max-w-[300px] mx-auto my-8">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* Hexagon Grid */}
          {[0.33, 0.66, 1].map((scale, i) => (
            <polygon 
              key={i}
              points="100,20 169.28,60 169.28,140 100,180 30.72,140 30.72,60"
              fill="none"
              stroke="var(--color-surface-highest)"
              strokeWidth="1"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            />
          ))}
          {/* Axes */}
          <line x1="100" y1="100" x2="100" y2="20" stroke="var(--color-surface-highest)" strokeWidth="1" />
          <line x1="100" y1="100" x2="169.28" y2="60" stroke="var(--color-surface-highest)" strokeWidth="1" />
          <line x1="100" y1="100" x2="169.28" y2="140" stroke="var(--color-surface-highest)" strokeWidth="1" />
          <line x1="100" y1="100" x2="100" y2="180" stroke="var(--color-surface-highest)" strokeWidth="1" />
          <line x1="100" y1="100" x2="30.72" y2="140" stroke="var(--color-surface-highest)" strokeWidth="1" />
          <line x1="100" y1="100" x2="30.72" y2="60" stroke="var(--color-surface-highest)" strokeWidth="1" />

          {/* Target Polygon (Cyan) */}
          <motion.polygon 
            initial={{ opacity: 0 }}
            animate={{ opacity: showTarget ? 1 : 0.2 }}
            points="100,30 160,65 150,130 100,170 40,135 45,60"
            fill="rgba(0, 242, 255, 0.1)"
            stroke="var(--color-primary-container)"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(0,242,255,0.5)] transition-opacity duration-500"
          />

          {/* Current Polygon (Purple) */}
          <motion.polygon 
            initial={{ opacity: 0 }}
            animate={{ opacity: !showTarget ? 1 : 0.2 }}
            points="100,40 130,80 160,140 100,150 60,120 70,70"
            fill="rgba(218, 185, 255, 0.1)"
            stroke="var(--color-secondary)"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(218,185,255,0.5)] transition-opacity duration-500"
          />
        </svg>

        {/* Labels */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary-container whitespace-nowrap">Data Structures</div>
        <div className="absolute top-1/4 -right-8 text-[10px] font-bold text-primary-container text-right leading-tight">Quantum<br/>Computing</div>
        <div className="absolute bottom-1/4 -right-8 text-[10px] font-bold text-secondary text-right leading-tight">Orbital<br/>Mechanics</div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary whitespace-nowrap">AI/ML</div>
        <div className="absolute bottom-1/4 -left-10 text-[10px] font-bold text-primary-container leading-tight">Astrophysics</div>
        <div className="absolute top-1/4 -left-8 text-[10px] font-bold text-primary-container leading-tight">Cloud<br/>Computing</div>
      </div>

      {/* Gap Analysis List */}
      <div className="bg-surface-high rounded-3xl p-6 border border-white/5">
        <h3 className="font-display text-lg font-bold text-on-surface mb-6">Gap Analysis & Action Plan</h3>
        
        <div className="space-y-5">
          <SkillItem title="Data Structures & Algorithms" percent={85} desc="Strong Foundation. Focus on dynamic programming for ISRO." color="from-primary-container to-secondary" />
          <SkillItem title="Quantum Computing" percent={45} desc="Critical Gap. Master Qiskit for NASA. Review quantum gates." color="from-secondary to-secondary/50" />
          <SkillItem title="Orbital Mechanics" percent={30} desc="Significant Effort Needed. Study Kepler's laws and propulsion." color="from-primary-container to-primary-container/50" />
          <SkillItem title="AI/ML Frameworks" percent={60} desc="Good Progress. Deepen knowledge in PyTorch & Neural Networks." color="from-secondary to-secondary/50" />
          <SkillItem title="Cloud Infrastructure (AWS/GCP)" percent={70} desc="On Track. Useful for processing large astronomical datasets." color="from-primary-container to-secondary" />
        </div>
      </div>
    </div>
  );
}

function SkillItem({ title, percent, desc, color }: { title: string, percent: number, desc: string, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-bold text-on-surface">{title}</span>
        <span className="text-xs font-bold text-secondary">{percent}%</span>
      </div>
      <div className="flex gap-4 items-start">
        <div className="flex-1 h-2 bg-surface-lowest rounded-full overflow-hidden mt-1.5">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-full bg-gradient-to-r ${color} shadow-[0_0_8px_rgba(218,185,255,0.3)]`} />
        </div>
        <p className="flex-1 text-[10px] text-on-surface-variant leading-snug">{desc}</p>
      </div>
    </div>
  );
}

/* =========================================
   SHARED COMPONENTS
   ========================================= */
function ReflectionModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-lowest/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-high w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/5 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Reflection Log
          </span>
          <h3 className="font-display text-2xl font-bold text-on-surface mb-2">Event Horizon</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            You've drifted from your trajectory. Acknowledge the void and recalibrate your momentum.
          </p>
        </div>
        
        <textarea 
          className="w-full h-32 bg-surface-lowest border border-white/5 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary-container resize-none mb-6"
          placeholder="Why did this task slip through the gravity well? What prevents it from happening again?"
          autoFocus
        />
        
        <button 
          onClick={() => { soundManager.playPop(); onClose(); }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all active:scale-95"
        >
          Recalibrate Trajectory
        </button>
      </motion.div>
    </motion.div>
  );
}

function BottomNav({ activeTab, onTabChange }: { activeTab: Tab, onTabChange: (tab: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50">
      <div className="absolute bottom-full left-0 w-full h-12 bg-gradient-to-t from-surface-lowest to-transparent pointer-events-none" />
      <div className="bg-surface-lowest/90 backdrop-blur-2xl border-t border-white/5 pb-safe">
        <div className="flex justify-around items-center px-4 py-4 max-w-md mx-auto">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
          <NavItem icon={<Compass />} label="Nebula" active={activeTab === 'nebula'} onClick={() => onTabChange('nebula')} />
          <NavItem icon={<RefreshCw />} label="Orbit" active={activeTab === 'orbit'} onClick={() => onTabChange('orbit')} />
          <NavItem icon={<Sun />} label="The Void" active={activeTab === 'void'} onClick={() => onTabChange('void')} />
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${active ? 'scale-110' : 'hover:scale-105'}`}
    >
      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-primary-container/10 text-primary-container shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'text-on-surface-variant hover:text-on-surface'}`}>
        {icon}
      </div>
      <span className={`font-display text-[10px] uppercase tracking-widest font-semibold ${active ? 'text-primary-container' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </motion.button>
  );
}

function SettingsModal({ onClose, onSettingsChange }: { onClose: () => void, onSettingsChange: () => void }) {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isSoundEnabled);
  const [navSound, setNavSound] = useState(soundManager.navSoundType);

  const handleToggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    soundManager.setSoundEnabled(newVal);
    onSettingsChange();
    if (newVal) {
      setTimeout(() => soundManager.playNav(), 50);
    }
  };

  const handleNavSoundChange = (type: 'smooth' | 'pop' | 'none') => {
    setNavSound(type);
    soundManager.setNavSoundType(type);
    onSettingsChange();
    if (type !== 'none' && soundEnabled) {
      if (type === 'smooth') {
        soundManager.playNav();
      } else {
        soundManager.playPop();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-lowest/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-high w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/5 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
          <h3 className="font-display text-2xl font-bold text-on-surface mb-2">System Settings</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Configure your orbital experience and sensory feedback.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Global Sound Toggle */}
          <div className="flex items-center justify-between bg-surface-lowest p-4 rounded-xl border border-white/5">
            <div>
              <p className="font-bold text-on-surface">Audio Feedback</p>
              <p className="text-xs text-on-surface-variant">Enable system sounds</p>
            </div>
            <button 
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-primary-container' : 'bg-surface-highest'}`}
            >
              <motion.div 
                animate={{ x: soundEnabled ? 24 : 2 }}
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
              />
            </button>
          </div>

          {/* Nav Sound Selection */}
          <div className="bg-surface-lowest p-4 rounded-xl border border-white/5 space-y-3">
            <div>
              <p className="font-bold text-on-surface">Navigation Sound</p>
              <p className="text-xs text-on-surface-variant">Choose the acoustic profile for tab changes</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleNavSoundChange('smooth')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${navSound === 'smooth' ? 'bg-primary-container/20 text-primary-container border border-primary-container/30' : 'bg-surface border border-white/5 text-on-surface-variant hover:text-on-surface'}`}
              >
                Smooth
              </button>
              <button 
                onClick={() => handleNavSoundChange('pop')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${navSound === 'pop' ? 'bg-primary-container/20 text-primary-container border border-primary-container/30' : 'bg-surface border border-white/5 text-on-surface-variant hover:text-on-surface'}`}
              >
                Sharp Pop
              </button>
              <button 
                onClick={() => handleNavSoundChange('none')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${navSound === 'none' ? 'bg-primary-container/20 text-primary-container border border-primary-container/30' : 'bg-surface border border-white/5 text-on-surface-variant hover:text-on-surface'}`}
              >
                Silent
              </button>
            </div>
          </div>
        </div>
        
      </motion.div>
    </motion.div>
  );
}
