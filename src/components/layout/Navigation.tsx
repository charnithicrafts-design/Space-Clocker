import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Clock, Brain, Telescope, Settings, CalendarDays, Globe, RefreshCcw, AlertCircle } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

interface NavLinkProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${active ? 'bg-surface-high text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-low'}`}>
    <Icon size={24} />
    <span className="hidden lg:block font-medium">{label}</span>
  </Link>
);

const Navigation = () => {
  const { pathname } = useLocation();
  const { syncStatus, oracleConfig } = useTrackStore();
  
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/nebula', icon: Target, label: 'Nebula' },
    { to: '/orbit', icon: Clock, label: 'Orbit' },
    { to: '/timeline', icon: CalendarDays, label: 'Timeline' },
    { to: '/skills', icon: Brain, label: 'Skills' },
    { to: '/horizon', icon: Telescope, label: 'Horizon' },
  ];

  return (
    <>
      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 glass-panel rounded-2xl border border-outline-variant flex justify-around items-center p-2 z-50">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={`p-3 ${pathname === link.to ? 'text-primary' : 'text-on-surface-variant'}`}>
            <link.icon size={24} />
          </Link>
        ))}
      </nav>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex fixed top-6 left-6 w-64 h-[calc(100vh-48px)] glass-panel rounded-3xl border border-outline-variant flex-col p-6 gap-6 z-50 overflow-hidden">
        <h1 className="font-display text-2xl font-bold text-primary px-3">Space-Clocker</h1>
        <div className="flex flex-col gap-2 flex-1">
          {links.map((link) => {
            const { to, ...rest } = link;
            return <NavLink key={to} to={to} {...rest} active={pathname === to} />;
          })}
        </div>

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
                <p className="text-[8px] text-success/70 font-mono">Telemetry OK</p>
              )}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-outline-variant">
          <NavLink 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            active={pathname === '/settings'} 
          />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
