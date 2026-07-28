import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { ShieldAlert, Telescope, HeartPulse, Activity, Target, Zap } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

const TrajectoryHorizon: React.FC = () => {
  const { timeframe, setTimeframe, telemetry, voidBreachStats, isLoading, fetchTelemetry } = useAnalyticsStore();

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Empathy-driven empty state or loading state
  if (isLoading || !telemetry) {
    return (
      <div className="min-h-screen bg-[#050508] p-6 lg:pl-80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-c from-primary/5 to-transparent pointer-events-none" />
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          />
          <p className="text-on-surface-variant font-display font-black text-xl uppercase tracking-widest opacity-60">
            Gathering Telemetry...
          </p>
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const formatData = () => {
    const allDates = Array.from(new Set([
      ...telemetry.heatmap.map(d => d.date),
      ...telemetry.voidBreaches.map(d => d.date)
    ])).sort();

    return allDates.map(date => {
      const focus = telemetry.heatmap.find(h => h.date === date)?.count || 0;
      const decay = telemetry.voidBreaches.find(v => v.date === date)?.count || 0;
      return {
        name: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        focus,
        decay
      };
    });
  };

  const chartData = formatData();
  const totalFocus = telemetry.heatmap.reduce((sum, d) => sum + d.count, 0);
  const totalDecay = telemetry.voidBreaches.reduce((sum, d) => sum + d.count, 0);

  // Radar Chart Data for Temporal Vulnerability
  const radarData = voidBreachStats?.hourlyBreaches.map(d => {
    const hourLabel = d.hour === 0 ? '12AM' : d.hour < 12 ? `${d.hour}AM` : d.hour === 12 ? '12PM' : `${d.hour - 12}PM`;
    return {
      time: hourLabel,
      breaches: d.breaches,
      fullMark: Math.max(...(voidBreachStats.hourlyBreaches.map(b => b.breaches))) || 1
    };
  }) || [];

  // XP Radial Data
  const xpData = [{
    name: 'XP',
    uv: telemetry.currentXp % 1000,
    pv: 1000,
    fill: '#10b981'
  }];

  // Eleanor's Empathetic Analysis
  const getEmpatheticMessage = () => {
    if (totalDecay === 0 && totalFocus > 0) {
      return "Your trajectory is beautifully clear. You're maintaining incredible focus. Remember to rest just as fiercely as you work.";
    } else if (totalDecay > totalFocus) {
      return "It looks like you've encountered a heavy gravity well recently. That is completely normal. Space is vast, and drifting happens to the best pilots. Be gentle with yourself as you recalibrate.";
    } else if (totalDecay === 0 && totalFocus === 0) {
      return "The sector is quiet. There's no pressure here. Take a breath, and when you're ready, we can chart your next destination.";
    } else {
      return "You are holding a steady course. You've navigated through some turbulence, but your momentum remains strong. Every day is a new sector to explore.";
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] p-6 lg:pl-80 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12 pb-6 border-b border-outline-variant/30">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Telescope size={24} />
              <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase">Horizon</h1>
            </div>
            <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
              Deep space trajectory analysis. Review your momentum, analyze orbital decay, and chart your path forward.
            </p>
          </div>

          {/* Timeframe Controls */}
          <div className="flex bg-surface-high/50 p-1 rounded-2xl border border-outline-variant/50 backdrop-blur-md">
            {[7, 30, 365].map((days) => (
              <button
                key={days}
                onClick={() => {
                  SoundManager.playPop();
                  setTimeframe(days as any);
                }}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  timeframe === days 
                    ? 'bg-primary text-on-primary shadow-lg' 
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-high'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </header>

        {/* Eleanor's Empathy Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-magenta/30 bg-magenta/5 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.1)]"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-magenta/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="w-16 h-16 rounded-2xl bg-magenta/20 flex items-center justify-center border border-magenta/30 shrink-0 text-magenta">
            <HeartPulse size={32} />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-xs font-black text-magenta tracking-[0.2em] uppercase">Eleanor's Log</h3>
            <p className="text-white/90 text-lg font-medium leading-relaxed">
              "{getEmpatheticMessage()}"
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Heatmap Area Chart (Winston & Sally) */}
          <div className="lg:col-span-2 glass-panel border border-outline-variant/50 p-6 rounded-3xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Stellar Activity (Momentum)
              </h3>
              <div className="text-2xl font-mono font-black text-primary">{totalFocus} <span className="text-[10px] text-on-surface-variant tracking-widest uppercase">Tasks</span></div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(99, 102, 241, 0.3)', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gravity Well Analysis */}
          <div className="glass-panel border border-fuchsia-500/20 bg-fuchsia-500/5 p-6 rounded-3xl flex flex-col gap-6 shadow-[inset_0_0_40px_rgba(217,70,239,0.05)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={16} />
                Gravity Wells
              </h3>
              <div className="text-2xl font-mono font-black text-fuchsia-400">{totalDecay}</div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">
              Times your trajectory drifted into a gravity well (distraction). This is normal; use this data to identify high-friction zones and rest periods.
            </p>
            
            <div className="flex-1 w-full mt-4 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(217, 70, 239, 0.1)', borderColor: 'rgba(217, 70, 239, 0.3)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#e879f9', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line type="monotone" dataKey="decay" stroke="#e879f9" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#e879f9', stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Phase 2 Additions: Temporal Radar & XP Burn-up */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          
          {/* Temporal Vulnerability Radar */}
          <div className="glass-panel border border-magenta/20 p-6 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-magenta/10 rounded-full blur-[50px] pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <h3 className="text-sm font-black text-magenta uppercase tracking-widest flex items-center gap-2">
                <Target size={16} />
                Temporal Vulnerability
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-80 z-10">
              Analysis of your daily orbital decay. Identifies the specific hours you are most susceptible to the Void.
            </p>
            
            <div className="flex-1 w-full mt-2 min-h-[250px] z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(217, 70, 239, 0.2)" />
                  <PolarAngleAxis dataKey="time" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                  <Radar name="Breaches" dataKey="breaches" stroke="#d946ef" strokeWidth={2} fill="#d946ef" fillOpacity={0.3} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(217, 70, 239, 0.3)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#e879f9', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Burn-up / Reactor Status */}
          <div className="glass-panel border border-emerald-500/20 bg-emerald-500/5 p-6 rounded-3xl flex flex-col gap-6 relative overflow-hidden shadow-[inset_0_0_40px_rgba(16,185,129,0.05)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} />
                Reactor Core (XP)
              </h3>
              <div className="text-right">
                <div className="text-2xl font-mono font-black text-emerald-400">LVL {telemetry.currentLevel}</div>
                <div className="text-[10px] text-emerald-400/60 font-black tracking-widest">{telemetry.currentXp.toLocaleString()} XP TOTAL</div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-[250px]">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" cy="50%" 
                    innerRadius="70%" outerRadius="100%" 
                    barSize={12} data={xpData}
                    startAngle={180} endAngle={0}
                  >
                    <RadialBar
                      background={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                      dataKey="uv"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center mt-4">
                  <span className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">
                    {Math.round(((telemetry.currentXp % 1000) / 1000) * 100)}%
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-bold mt-1">To Next Level</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TrajectoryHorizon;
