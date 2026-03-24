import React, { useState } from 'react';
import MissionControl from './components/layout/MissionControl';
import OrbitScheduler from './components/micro-engine/OrbitScheduler';
import MacroDashboard from './components/macro-engine/MacroDashboard';
import VoidList from './components/void-protocol/VoidList';
import ReflectionModal from './components/reflection/ReflectionModal';

const App: React.FC = () => {
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  return (
    <MissionControl>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MacroDashboard />
        <OrbitScheduler />
        <div className="md:col-span-2">
          <VoidList />
        </div>
        <button 
          onClick={() => setIsReflectionOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-primary-container text-on-primary shadow-lg"
        >
          Reflect
        </button>
      </div>
      <ReflectionModal isOpen={isReflectionOpen} onClose={() => setIsReflectionOpen(false)} />
    </MissionControl>
  );
};

export default App;
