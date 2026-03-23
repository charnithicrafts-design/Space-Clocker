import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Bot, Settings } from 'lucide-react';
import MissionControl from './components/layout/MissionControl';
import OrbitScheduler from './components/micro-engine/OrbitScheduler';
import MacroDashboard from './components/macro-engine/MacroDashboard';
import VoidList from './components/void-protocol/VoidList';
import ReflectionModal from './components/reflection/ReflectionModal';
import { OracleDashboard } from './components/oracle/OracleDashboard';
import { OracleSettings } from './components/oracle/OracleSettings';
import { useTrackStore } from './store/useTrackStore';

const App: React.FC = () => {
  const { tasks, goals, voids, toggleTask, engageVoid, addReflection, stats } = useTrackStore();
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <MissionControl>
        <OrbitScheduler 
          tasks={tasks} 
          toggleTask={toggleTask} 
          orbitProgress={stats.orbitProgress} 
        />
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <MacroDashboard goals={goals} />
          <div className="flex-1">
            <VoidList voids={voids} onEngage={engageVoid} />
          </div>
        </div>
      </MissionControl>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-40 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)}
          className="w-12 h-12 bg-surface-variant text-on-surface-variant rounded-full shadow-lg flex items-center justify-center hover:bg-surface-variant-hover transition-colors"
        >
          <Settings size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOracleOpen(!isOracleOpen)}
          className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(218,185,255,0.4)] flex items-center justify-center transition-colors ${isOracleOpen ? 'bg-primary text-on-primary' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}
          title="Consult The Oracle"
        >
          <Bot size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOracleOpen && (
          <OracleDashboard onClose={() => setIsOracleOpen(false)} />
        )}
      </AnimatePresence>

      <ReflectionModal 
        isOpen={isReflectionOpen} 
        onClose={() => setIsReflectionOpen(false)} 
        onSubmit={addReflection}
      />
      
      {isSettingsOpen && (
        <OracleSettings onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
};

export default App;
