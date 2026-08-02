import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserGuideSection } from './UserGuideSection';
import { DeveloperGuideSection } from './DeveloperGuideSection';
import { SoundManager } from '../../utils/SoundManager';

export const DocsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'developer'>('user');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Mission Control
            </Link>
            <span>/</span>
            <span>Documentation Hub</span>
          </div>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight">
            Space-Clocker Manuals
          </h1>
        </div>

        {/* Tab Toggle & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full bg-surface-high border border-outline-variant/40 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-white placeholder-on-surface-variant focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-high/60 p-1 rounded-2xl border border-outline-variant/30 w-full sm:w-auto">
            <button
              onClick={() => {
                SoundManager.playPop();
                setActiveTab('user');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'user' ? 'text-white' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {activeTab === 'user' && (
                <motion.div
                  layoutId="active-docs-tab"
                  className="absolute inset-0 bg-primary-container rounded-xl shadow-lg"
                />
              )}
              <BookOpen size={14} className="relative z-10" />
              <span className="relative z-10">User Guide</span>
            </button>

            <button
              onClick={() => {
                SoundManager.playPop();
                setActiveTab('developer');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'developer' ? 'text-white' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {activeTab === 'developer' && (
                <motion.div
                  layoutId="active-docs-tab"
                  className="absolute inset-0 bg-secondary/20 border border-secondary/30 rounded-xl shadow-lg"
                />
              )}
              <Code2 size={14} className="relative z-10" />
              <span className="relative z-10">Developer Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Content Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'user' ? (
            <UserGuideSection searchQuery={searchQuery} />
          ) : (
            <DeveloperGuideSection searchQuery={searchQuery} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DocsHub;
