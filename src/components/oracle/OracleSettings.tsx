import { useState } from 'react';
import { useTrackStore } from '../../store/useTrackStore';

export const OracleSettings = () => {
  const { oracleConfig, updateOracleConfig } = useTrackStore();
  const [localConfig, setLocalConfig] = useState(oracleConfig);

  const handleSave = () => {
    updateOracleConfig(localConfig);
  };

  return (
    <div className="p-4 bg-gray-900 border border-purple-500/30 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Oracle Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">Provider API URL (e.g., http://localhost:8000/v1)</label>
          <input
            type="text"
            className="w-full bg-gray-800 p-2 rounded"
            value={localConfig.providerUrl}
            onChange={(e) => setLocalConfig({ ...localConfig, providerUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">API Key</label>
          <input
            type="password"
            className="w-full bg-gray-800 p-2 rounded"
            value={localConfig.apiKey}
            onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Model</label>
          <input
            type="text"
            className="w-full bg-gray-800 p-2 rounded"
            value={localConfig.model}
            onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded transition"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
