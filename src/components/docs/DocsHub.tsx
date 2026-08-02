import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Search, ArrowLeft, ChevronRight, Sparkles, Terminal, Compass } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserGuideSection, USER_CHAPTERS } from './UserGuideSection';
import { DeveloperGuideSection, DEV_CHAPTERS } from './DeveloperGuideSection';
import { SoundManager } from '../../utils/SoundManager';

export const DocsHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'user' | 'developer'>(
    searchParams.get('tab') === 'developer' ? 'developer' : 'user'
  );
  const [activeChapterId, setActiveChapterId] = useState<string>(
    activeTab === 'user' ? USER_CHAPTERS[0].id : DEV_CHAPTERS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Tab Switch
  const handleTabSwitch = (tab: 'user' | 'developer') => {
    SoundManager.playPop();
    setActiveTab(tab);
    setSearchParams({ tab });
    setActiveChapterId(tab === 'user' ? USER_CHAPTERS[0].id : DEV_CHAPTERS[0].id);
  };

  const activeChapters = activeTab === 'user' ? USER_CHAPTERS : DEV_CHAPTERS;

  const filteredChapters = activeChapters.filter(c => 
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:py-10 max-w-7xl mx-auto min-h-screen bg-surface-lowest text-white pb-32">
      {/* Top Header & Search Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-8">
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
              placeholder="Search chapters..."
              className="w-full bg-surface-high border border-outline-variant/40 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-white placeholder-on-surface-variant focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-high/60 p-1 rounded-2xl border border-outline-variant/30 w-full sm:w-auto">
            <button
              onClick={() => handleTabSwitch('user')}
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
              <span className="relative z-10">User Manual</span>
            </button>

            <button
              onClick={() => handleTabSwitch('developer')}
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
              <span className="relative z-10">Developer Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standard 2/3 Column Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chapter Navigation Sidebar Tree */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-8">
          <div className="glass-panel border border-outline-variant/40 p-4 rounded-3xl space-y-2 bg-surface-high/20">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant flex items-center justify-between">
              <span>{activeTab === 'user' ? '📖 User Guide Chapters' : '💻 Developer Onboarding'}</span>
              <span className="font-mono text-primary">{filteredChapters.length} Chapters</span>
            </div>

            <div className="space-y-1">
              {filteredChapters.map((chap) => {
                const Icon = chap.icon;
                const isSelected = activeChapterId === chap.id;

                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      SoundManager.playPop();
                      setActiveChapterId(chap.id);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold transition-all relative cursor-pointer border-none outline-none ${
                      isSelected
                        ? 'bg-surface-high text-white shadow-lg border border-primary/30'
                        : 'text-on-surface-variant hover:text-white hover:bg-surface-high/40'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-chapter-indicator"
                        className="absolute left-0 w-1 h-6 rounded-full bg-primary"
                      />
                    )}
                    <Icon size={18} className={isSelected ? 'text-primary' : 'text-on-surface-variant'} />
                    <span className="truncate flex-1">{chap.title}</span>
                    <ChevronRight size={14} className={`transition-transform ${isSelected ? 'rotate-90 text-primary' : 'opacity-40'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Active Chapter Content Reader */}
        <div className="lg:col-span-8">
          {activeTab === 'user' ? (
            <UserGuideSection
              selectedChapterId={activeChapterId}
              onSelectChapter={(id) => setActiveChapterId(id)}
            />
          ) : (
            <DeveloperGuideSection
              selectedChapterId={activeChapterId}
              onSelectChapter={(id) => setActiveChapterId(id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsHub;
