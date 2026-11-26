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
      <h3 className="type-title-3 font-black text-on-surface uppercase tracking-tight">{label}</h3>
      <p className="type-overline text-on-surface-variant font-bold tracking-widest mt-1">{description}</p>
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
        <div
          className="modal-backdrop z-[100] bg-surface-lowest/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="modal-center-frame">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl relative z-10 space-y-8 my-auto py-4"
            >
              <div className="flex justify-between items-center gap-4 pb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="type-title-1 font-black text-on-surface uppercase tracking-tight">Mission Control Hub</h2>
                    <p className="type-overline text-primary font-black tracking-[0.3em]">Sector Synchronization Active</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  aria-label="Close Mission Control Hub"
                  className="touch-target shrink-0 w-12 h-12 rounded-full bg-surface-high border border-outline-variant hover:border-error text-on-surface-variant hover:text-error transition-all flex items-center justify-center cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectors.map((sector) => (
                  <HubTile key={sector.to} {...sector} onClick={onClose} />
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <div className="glass-panel border border-outline-variant px-6 py-3 rounded-full flex items-center gap-2">
                  <ShieldCheck size={16} className="text-success shrink-0" />
                  <span className="type-overline font-black tracking-widest text-on-surface-variant">Neural Connection Secured</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandHub;
