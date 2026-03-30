import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Clock, 
  Brain, 
  Telescope, 
  Settings, 
  CalendarDays, 
  Globe, 
  Signal,
  Menu,
  Zap,
  Box
} from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import CommandHub from './CommandHub';

interface NavLinkProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  color?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, active, color = 'text-primary' }) => (
  <Link 
    to={to} 
    onClick={() => SoundManager.playPop()}
    aria-current={active ? 'page' : undefined}
    aria-label={`${label} sector`}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all relative group focus-visible:ring-2 focus-visible:ring-primary outline-none ${active ? 'bg-surface-high text-white shadow-lg' : 'text-on-surface-variant hover:text-white hover:bg-surface-low'}`}
  >
    {active && (
      <motion.div 
        layoutId="active-nav-indicator"
        className={`absolute left-0 w-1 h-6 rounded-full ${color}`}
      />
    )}
    <Icon size={20} className={active ? color : 'group-hover:scale-110 transition-transform'} aria-hidden="true" />
    <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">{label}</span>
  </Link>
);

import { motion } from 'framer-motion';

const Navigation = () => {
  const { pathname } = useLocation();
  const { syncStatus, oracleConfig } = useTrackStore();
  const [isHubOpen, setIsHubOpen] = useState(false);
  
  const tacticalLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Momentum', color: 'text-primary' },
    { to: '/orbit', icon: Clock, label: 'Orbit', color: 'text-secondary' },
  ];

  const strategicLinks = [
    { to: '/nebula', icon: Target, label: 'Nebula', color: 'text-magenta' },
    { to: '/timeline', icon: CalendarDays, label: 'Timeline', color: 'text-primary-container' },
    { to: '/skills', icon: Brain, label: 'Skills', color: 'text-success' },
  ];

  const communicationLinks = [
    { to: '/transmission', icon: Signal, label: 'Transmission', color: 'text-primary' },
  ];

  return (
    <>
      <CommandHub isOpen={isHubOpen} onClose={() => setIsHubOpen(false)} />

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50" aria-label="Mobile navigation">
        <div className="glass-panel rounded-3xl border border-outline-variant flex justify-around items-center p-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Link to="/" aria-label="Momentum sector" className={`p-3 rounded-2xl ${pathname === '/' ? 'text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
            <LayoutDashboard size={24} aria-hidden="true" />
          </Link>
          <Link to="/orbit" aria-label="Orbit sector" className={`p-3 rounded-2xl ${pathname === '/orbit' ? 'text-secondary bg-secondary/10' : 'text-on-surface-variant'}`}>
            <Clock size={24} aria-hidden="true" />
          </Link>
          
          {/* Command Hub Trigger */}
          <button 
            onClick={() => { setIsHubOpen(true); SoundManager.playSwell(); }}
            aria-label="Open Command Hub"
            className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] active:scale-90 transition-all -translate-y-4 border-4 border-surface-lowest focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            <Zap size={28} aria-hidden="true" />
          </button>

          <Link to="/timeline" aria-label="Timeline sector" className={`p-3 rounded-2xl ${pathname === '/timeline' ? 'text-primary-container bg-primary-container/10' : 'text-on-surface-variant'}`}>
            <CalendarDays size={24} aria-hidden="true" />
          </Link>
          <Link to="/settings" aria-label="System Config" className={`p-3 rounded-2xl ${pathname === '/settings' ? 'text-on-surface-variant bg-surface-high' : 'text-on-surface-variant'}`}>
            <Settings size={24} aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex fixed top-6 left-6 w-72 h-[calc(100vh-48px)] glass-panel rounded-3xl border border-outline-variant flex-col p-6 gap-8 z-50 overflow-hidden shadow-2xl" aria-label="Desktop navigation">
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30" aria-hidden="true">
            <Box className="text-primary" size={24} />
          </div>
          <h1 className="font-display text-xl font-black text-white uppercase tracking-tighter leading-none">
            Space<br/><span className="text-primary">Clocker</span>
          </h1>
        </div>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar pr-2">
          {/* Tactical Sector */}
          <section className="space-y-2" aria-labelledby="tactical-heading">
            <h2 id="tactical-heading" className="px-3 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-3">Tactical Sector</h2>
            {tacticalLinks.map((link) => (
              <NavLink key={link.to} {...link} active={pathname === link.to} />
            ))}
          </section>

          {/* Strategic Sector */}
          <section className="space-y-2" aria-labelledby="strategic-heading">
            <h2 id="strategic-heading" className="px-3 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-3">Strategic Sector</h2>
            {strategicLinks.map((link) => (
              <NavLink key={link.to} {...link} active={pathname === link.to} />
            ))}
          </section>

          {/* Communications Sector */}
          <section className="space-y-2" aria-labelledby="communications-heading">
            <h2 id="communications-heading" className="px-3 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-3">Communications</h2>
            {communicationLinks.map((link) => (
              <NavLink key={link.to} {...link} active={pathname === link.to} />
            ))}
          </section>
        </div>

        <div className="space-y-6 pt-6 border-t border-outline-variant">
          {/* Sync Status Overlay */}
          {oracleConfig.syncEnabled && (
            <div className="px-3 py-4 bg-surface-low rounded-2xl border border-outline-variant/30 flex items-center gap-3 group">
              <div className={`relative ${syncStatus.isSyncing ? 'animate-spin' : ''}`}>
                <Globe size={18} className={syncStatus.error ? 'text-error' : 'text-secondary'} />
                {syncStatus.isSyncing && (
                  <div className="absolute inset-0 bg-secondary blur-sm opacity-50 animate-pulse" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant truncate">
                  {syncStatus.isSyncing ? 'Uplinking...' : (syncStatus.error ? 'Comms Error' : 'Comms Active')}
                </p>
                {syncStatus.lastSyncedAt && !syncStatus.error && !syncStatus.isSyncing && (
                  <p className="text-[8px] text-success/70 font-mono uppercase">Telemetry OK</p>
                )}
              </div>
            </div>
          )}

          <NavLink 
            to="/settings" 
            icon={Settings} 
            label="System Config" 
            active={pathname === '/settings'}
            color="text-on-surface-variant"
          />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
