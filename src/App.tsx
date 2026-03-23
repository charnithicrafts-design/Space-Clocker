import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import MissionControl from './components/layout/MissionControl';
import OrbitScheduler from './components/micro-engine/OrbitScheduler';
import MacroDashboard from './components/macro-engine/MacroDashboard';
import VoidList from './components/void-protocol/VoidList';
import ReflectionModal from './components/reflection/ReflectionModal';
import { useTrackStore } from './store/useTrackStore';

const App: React.FC = () => {
  const { tasks, goals, voids, toggleTask, engageVoid, addReflection, stats } = useTrackStore();
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

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

      {/* Floating Reflection Button */}
      <motion.button
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsReflectionOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed rounded-full shadow-[0_0_20px_rgba(218,185,255,0.4)] flex items-center justify-center hover:bg-tertiary-fixed-dim transition-colors"
        title="Log Reflection"
      >
        <MessageSquarePlus size={24} />
      </motion.button>

      <ReflectionModal 
        isOpen={isReflectionOpen} 
        onClose={() => setIsReflectionOpen(false)} 
        onSubmit={addReflection}
      />
    </>
  );
};

export default App;
