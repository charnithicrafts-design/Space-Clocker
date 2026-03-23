import React from 'react';
import MissionControl from './components/layout/MissionControl';
import OrbitScheduler from './components/micro-engine/OrbitScheduler';
import MacroDashboard from './components/macro-engine/MacroDashboard';
import { useTrackStore } from './store/useTrackStore';

const App: React.FC = () => {
  const { tasks, goals, toggleTask, stats } = useTrackStore();

  return (
    <MissionControl>
      <OrbitScheduler 
        tasks={tasks} 
        toggleTask={toggleTask} 
        orbitProgress={stats.orbitProgress} 
      />
      <MacroDashboard goals={goals} />
    </MissionControl>
  );
};

export default App;
