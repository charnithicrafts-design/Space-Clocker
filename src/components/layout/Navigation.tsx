import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, CalendarDays, Brain, Telescope, Download, Upload, Settings } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

const NavLink = ({ to, icon: Icon, label, active, key }: { to: string; icon: any; label: string; active: boolean; key?: string }) => (
  <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${active ? 'bg-surface-high text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-low'}`}>
    <Icon size={24} />
    <span className="hidden lg:block font-medium">{label}</span>
  </Link>
);

const Navigation = () => {
  const { pathname } = useLocation();
  const store = useTrackStore();
  
  const handleExport = () => {
    const data = JSON.stringify(store, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `space-clocker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('This will overwrite your current progress. Proceed?')) {
          store.importData(data);
          window.location.reload(); // Refresh to ensure all components pick up new state
        }
      } catch (err) {
        alert('Invalid data file.');
      }
    };
    reader.readAsText(file);
  };

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/nebula', icon: Target, label: 'Nebula' },
    { to: '/orbit', icon: CalendarDays, label: 'Orbit' },
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
        <button onClick={handleExport} className="p-3 text-on-surface-variant"><Download size={24} /></button>
      </nav>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex fixed top-6 left-6 w-64 h-[calc(100vh-48px)] glass-panel rounded-3xl border border-outline-variant flex-col p-6 gap-6 z-50 overflow-hidden">
        <h1 className="font-display text-2xl font-bold text-primary px-3">Space-Clocker</h1>
        <div className="flex flex-col gap-2 flex-1">
          {links.map((link) => (
            <NavLink key={link.to} {...link} active={pathname === link.to} />
          ))}
        </div>

        <div className="pt-6 border-t border-outline-variant space-y-2">
          <button 
            onClick={handleExport}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-low transition-colors"
          >
            <Download size={20} />
            <span className="font-medium">Export Progress</span>
          </button>
          
          <label className="w-full flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-low transition-colors cursor-pointer">
            <Upload size={20} />
            <span className="font-medium">Import Progress</span>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-low transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
