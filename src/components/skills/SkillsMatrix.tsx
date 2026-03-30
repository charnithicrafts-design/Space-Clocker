import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Brain, Target, Info, ChevronRight } from 'lucide-react';

const RadarChart = ({ skills, showTarget }: { skills: any[], showTarget: boolean }) => {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / skills.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const currentPoints = useMemo(() => 
    skills.map((s, i) => {
      const { x, y } = getCoordinates(s.currentProficiency, i);
      return `${x},${y}`;
    }).join(' '), [skills]);

  const targetPoints = useMemo(() => 
    skills.map((s, i) => {
      const { x, y } = getCoordinates(s.targetProficiency, i);
      return `${x},${y}`;
    }).join(' '), [skills]);

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
        {skills.map((_, i) => {
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
        {skills.map((s, i) => {
          const { x, y } = getCoordinates(115, i);
          const nameLines = s.name.split(' & ');
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-on-surface-variant text-[9px] font-bold tracking-tighter uppercase"
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
        {skills.map((s, i) => {
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

const SkillGapCard = ({ skill }: { skill: any }) => {
  return (
    <div className="glass-panel border border-outline-variant p-4 rounded-2xl space-y-3 hover:border-primary/50 transition-colors group">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white text-sm tracking-tight">{skill.name}</h4>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary">{skill.currentProficiency}%</span>
        </div>
      </div>
      
      <div className="relative w-full h-2 bg-surface-high rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${skill.currentProficiency}%` }}
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
        />
        {/* Target Marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-magenta shadow-[0_0_8px_rgba(217,70,239,1)] z-10"
          style={{ left: `${skill.targetProficiency}%` }}
        />
      </div>

      <div className="flex gap-2 items-start opacity-70 group-hover:opacity-100 transition-opacity">
        <Info size={14} className="text-secondary mt-0.5 shrink-0" />
        <p className="text-[11px] leading-relaxed text-on-surface-variant">
          {skill.recommendation}
        </p>
      </div>
    </div>
  );
};

const SkillsMatrix = () => {
  const { skills } = useTrackStore();
  const [showTarget, setShowTarget] = useState(true);

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="flex justify-between items-end">
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

      <section className="flex flex-col items-center">
        <RadarChart skills={skills} showTarget={showTarget} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Target className="text-primary" size={20} />
          <h3 className="font-display font-bold text-xl">Gap Analysis & Action Plan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <SkillGapCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
      
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
