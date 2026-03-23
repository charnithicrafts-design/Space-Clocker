import { useState } from 'react';
import { useTrackStore } from '../../store/useTrackStore';
import { OracleService } from '../../services/OracleService';

interface OracleDashboardProps {
  onClose: () => void;
}

export const OracleDashboard = ({ onClose }: OracleDashboardProps) => {
  const { oracleConfig, addOracleLog, reflections, tasks, stats } = useTrackStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await OracleService.query(oracleConfig, prompt, JSON.stringify({ reflections, tasks }));
      addOracleLog(prompt, response);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDebrief = async () => {
    setLoading(true);
    try {
      const response = await OracleService.getDailyDebrief(oracleConfig, tasks, reflections, stats);
      addOracleLog('Daily Debrief', response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 bg-gray-950 border border-purple-500/50 rounded-2xl text-white shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-300">The Oracle</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
        </div>
        <textarea
          className="w-full h-32 bg-gray-900 border border-gray-700 p-4 rounded-lg mb-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the Oracle for wisdom regarding your progress..."
        />
        <div className="flex gap-4">
          <button
            onClick={handleQuery}
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-600 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? 'Consulting...' : 'Consult The Oracle'}
          </button>
          <button
            onClick={handleDebrief}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? 'Consulting...' : 'Get Daily Debrief'}
          </button>
        </div>
      </div>
    </div>
  );
};
