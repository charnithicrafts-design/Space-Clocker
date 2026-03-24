import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import MomentumEngine from './components/dashboard/MomentumEngine';
import NebulaMap from './components/nebula/NebulaMap';

const Orbit = () => <div className="p-6 lg:pl-80">Orbit View</div>;
const Horizon = () => <div className="p-6 lg:pl-80">Horizon View</div>;

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-surface-lowest text-on-surface">
        <Navigation />
        <Routes>
          <Route path="/" element={<MomentumEngine />} />
          <Route path="/nebula" element={<NebulaMap />} />
          <Route path="/orbit" element={<Orbit />} />
          <Route path="/horizon" element={<Horizon />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
