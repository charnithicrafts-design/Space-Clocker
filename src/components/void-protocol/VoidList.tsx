import React from 'react';
import VoidTask from './VoidTask';
import { useTrackStore } from '../../store/useTrackStore';

const VoidList: React.FC = () => {
  const voids = useTrackStore((state) => state.voids);

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl p-6">
      <h2 className="font-display text-xl mb-4 text-error">Void Protocol</h2>
      <div className="space-y-3">
        {voids.map((v) => (
          <VoidTask key={v.id} id={v.id} />
        ))}
      </div>
    </div>
  );
};

export default VoidList;
