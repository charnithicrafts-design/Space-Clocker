import { useState } from 'react';
import { useTrackStore } from '../../store/useTrackStore';
import { OracleService } from '../../services/OracleService';

export const OracleDashboard = () => {
  const { oracleConfig, addOracleLog, reflections, tasks } = useTrackStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const context = JSON.stringify({ reflections, tasks });
      const response = await OracleService.query(oracleConfig, prompt, context);
      addOracleLog(prompt, response);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-950 border border-purple-500/50 rounded-2xl text-white shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-purple-300">The Oracle</h1>
      <textarea
        className="w-full h-32 bg-gray-900 border border-gray-700 p-4 rounded-lg mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask the Oracle for wisdom regarding your progress..."
      />
      <button
        onClick={handleQuery}
        disabled={loading}
        className="bg-purple-700 hover:bg-purple-600 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
      >
        {loading ? 'Consulting...' : 'Consult The Oracle'}
      </button>
    </div>
  );
};
