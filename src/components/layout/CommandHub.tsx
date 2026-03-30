import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Clock, 
  Brain, 
  CalendarDays, 
  Signal, 
  Settings, 
  X,
  Zap,
  ShieldCheck,
  Telescope
} from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface CommandHubProps {
  isOpen: boolean;
  onClose: () => void;
}

const HubTile = ({ to, icon: Icon, label, description, color, onClick }: any) => (
  <Link 
    to={to} 
    onClick={() => { onClick(); SoundManager.playPop(); }}
    className="glass-panel border border-outline-variant p-6 rounded-3xl flex flex-col gap-4 group hover:border-primary/50 transition-all active:scale-95"
  >
    <div className={`p-3 rounded-2xl w-fit ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={color} />
    </div>
    <div className="text-left">
      <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">{label}</h3>
      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">{description}</p>
    </div>
  </Link>
);

const CommandHub: React.FC<CommandHubProps> = ({ isOpen, onClose }) => {
  const sectors = [
    { to: '/', icon: LayoutDashboard, label: 'Momentum', description: 'Core Dashboard', color: 'text-primary' },
    { to: '/orbit', icon: Clock, label: 'Orbit', description: 'Mission Log', color: 'text-secondary' },
    { to: '/nebula', icon: Target, label: 'Nebula', description: 'Ambition Matrix', color: 'text-magenta' },
    { to: '/timeline', icon: CalendarDays, label: 'Timeline', description: 'Stellar Chronometer', color: 'text-primary-container' },
    { to: '/skills', icon: Brain, label: 'Skills', description: 'Neural Matrix', color: 'text-success' },
    { to: '/horizon', icon: Telescope, label: 'Horizon', description: 'Trajectory Analysis', color: 'text-error' },
    { to: '/transmission', icon: Signal, label: 'Comms', description: 'Data Uplink', color: 'text-primary' },
    { to: '/settings', icon: Settings, label: 'System', description: 'Config Protocol', color: 'text-on-surface-variant' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050508]/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 space-y-8 no-scrollbar"
          >
            <div className="flex justify-between items-center sticky top-0 bg-transparent pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Zap className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Mission Control Hub</h2>
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Sector Synchronization Active</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-4 rounded-full bg-surface-high border border-outline-variant hover:border-error text-on-surface-variant hover:text-error transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <HubTile key={sector.to} {...sector} onClick={onClose} />
              ))}
            </div>

            <div className="pt-8 flex justify-center">
              <div className="glass-panel border border-outline-variant px-6 py-3 rounded-full flex items-center gap-3">
                <ShieldCheck size={16} className="text-success" />
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Neural Connection Secured</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandHub;
