import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, CalendarDays, Brain, Telescope, Settings } from 'lucide-react';

const NavLink = ({ to, icon: Icon, label, active, key }: { to: string; icon: any; label: string; active: boolean; key?: string }) => (
  <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${active ? 'bg-surface-high text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-low'}`}>
    <Icon size={24} />
    <span className="hidden lg:block font-medium">{label}</span>
  </Link>
);

const Navigation = () => {
  const { pathname } = useLocation();
  
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/nebula', icon: Target, label: 'Nebula' },
    { to: '/orbit', icon: CalendarDays, label: 'Orbit' },
    { to: '/skills', icon: Brain, label: 'Skills' },
    { to: '/horizon', icon: Telescope, label: 'Horizon' },
    { to: '/settings', icon: Settings, label: 'Settings' },
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
          {links.map((link) => (
            <NavLink key={link.to} {...link} active={pathname === link.to} />
          ))}
        </div>

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
