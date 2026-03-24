import React from 'react';
import { useTrackStore } from '../../store/useTrackStore';

const MacroDashboard: React.FC = () => {
  const { ambitions } = useTrackStore();

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl p-6">
      <h2 className="font-display text-xl mb-4 text-primary">Ambitions</h2>
      {ambitions.map((a) => (
        <div key={a.id} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{a.title}</span>
            <span className="text-secondary">{a.progress}%</span>
          </div>
          <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-container"
              style={{ width: `${a.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MacroDashboard;
