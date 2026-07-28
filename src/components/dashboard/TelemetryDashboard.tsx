import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

export const TelemetryDashboard: React.FC = () => {
  const { timeframe, telemetry, voidBreachStats, isLoading, error, setTimeframe, fetchTelemetry, fetchVoidBreachStats } = useAnalyticsStore();

  useEffect(() => {
    fetchTelemetry();
    fetchVoidBreachStats();
  }, [fetchTelemetry, fetchVoidBreachStats]);

  if (isLoading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Initializing Telemetry Link...</div>;
  if (error) return <div className="p-8 text-center text-error">Telemetry Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Telemetry Dashboard</h2>
        <div className="flex gap-2">
          {[7, 30, 365].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                timeframe === days ? 'bg-primary text-on-primary' : 'bg-surface-high text-on-surface-variant hover:bg-surface-highest'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deep Work Heatmap (Area Chart for 30-day streak) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Stellar Activity (Focus)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry?.heatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(str) => str.slice(5)} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--color-secondary)' }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorFocus)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Void Breach Radar (Hourly Distraction Drift) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl" />
          <h3 className="text-sm font-bold text-error uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            Void Breach (Hourly Vulnerability)
          </h3>
          <div className="h-64 relative z-10">
            {voidBreachStats?.hourlyBreaches && voidBreachStats.hourlyBreaches.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={voidBreachStats.hourlyBreaches} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(h) => `${h}:00`} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-high)', borderColor: 'var(--color-error)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--color-error)' }}
                    labelFormatter={(h) => `${h}:00 - ${Number(h)+1}:00`}
                  />
                  <Bar dataKey="breaches" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant text-sm">
                No void breaches detected. Perfect trajectory.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
