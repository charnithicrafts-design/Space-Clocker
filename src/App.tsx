import React from 'react';
import MissionControl from './components/layout/MissionControl';
import OrbitScheduler from './components/micro-engine/OrbitScheduler';
import MacroDashboard from './components/macro-engine/MacroDashboard';

const App: React.FC = () => {
  return (
    <MissionControl>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MacroDashboard />
        <OrbitScheduler />
      </div>
    </MissionControl>
  );
};

export default App;
