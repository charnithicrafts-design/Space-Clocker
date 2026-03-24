import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import MomentumEngine from './components/dashboard/MomentumEngine';
import NebulaMap from './components/nebula/NebulaMap';
import OrbitScheduler from './components/orbit/OrbitScheduler';
import CalendarShell from './components/horizon/CalendarShell';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-surface-lowest text-on-surface">
        <Navigation />
        <Routes>
          <Route path="/" element={<MomentumEngine />} />
          <Route path="/nebula" element={<NebulaMap />} />
          <Route path="/orbit" element={<OrbitScheduler />} />
          <Route path="/horizon" element={<CalendarShell />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
