import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, ChevronLeft, ChevronRight, Calendar, Tag, Radio, Sparkles, CheckCircle2 } from 'lucide-react';
import releasesData from '../../data/releases.json';
import { CURRENT_APP_VERSION } from '../../constants';
import { SoundManager } from '../../utils/SoundManager';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const RELEASES_PER_PAGE = 2;
  const totalPages = Math.ceil(releasesData.length / RELEASES_PER_PAGE);

  // Reset to first page whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        SoundManager.playPop();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, totalPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      SoundManager.playPop();
      setCurrentPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      SoundManager.playPop();
      setCurrentPage(p => p + 1);
    }
  };

  if (!isOpen) return null;

  const startIndex = (currentPage - 1) * RELEASES_PER_PAGE;
  const currentReleases = releasesData.slice(startIndex, startIndex + RELEASES_PER_PAGE);

  return (
    <AnimatePresence>
      <div 
        className="modal-backdrop z-[120] bg-surface-lowest/85 backdrop-blur-xl"
        onClick={() => {
          SoundManager.playPop();
          onClose();
        }}
      >
        <div className="modal-center-frame">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="modal-dialog glass-panel border border-outline-variant max-w-xl bg-surface-lowest shadow-2xl relative"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="version-history-title"
          >
            {/* Glowing Ambient Backdrop Accent */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-secondary/10 blur-3xl rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between gap-4 relative z-10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <History size={20} />
                </div>
                <div className="min-w-0">
                  <h2 id="version-history-title" className="type-title-3 font-bold text-on-surface uppercase tracking-tight">
                    Version Details
                  </h2>
                  <p className="type-overline text-on-surface-variant normal-case">
                    Space-Clocker System Manifest & Historical Trajectory Log
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  SoundManager.playPop();
                  onClose();
                }}
                aria-label="Close Version History"
                className="touch-target-compact w-12 h-12 rounded-xl bg-surface-high/60 hover:bg-surface-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content / Release Cards */}
            <div className="modal-body-scroll p-4 sm:p-6 space-y-4 relative z-10">
              {currentReleases.map((release) => {
                const isCurrent = release.version === CURRENT_APP_VERSION;
                const isMajor = release.type === 'major';
                const isHotfix = release.type === 'hotfix';

                return (
                  <article 
                    key={release.version}
                    className={`card-standard rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-primary/5 border-primary/40 shadow-[0_0_20px_rgba(0,242,255,0.08)]' 
                        : 'bg-surface-high/30 border-outline-variant/30 hover:border-outline-variant/60'
                    }`}
                  >
                    {/* Release Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="type-telemetry-base font-bold text-primary px-3 py-1 rounded-lg bg-surface-high border border-primary/30 font-mono">
                          v{release.version}
                        </span>

                        {isCurrent && (
                          <span className="type-overline inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/40 px-2 py-1 rounded-md font-black">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        )}

                        <span className={`type-overline px-2 py-1 rounded-md font-bold uppercase ${
                          isMajor 
                            ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                            : isHotfix 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                              : 'bg-surface-high text-on-surface-variant border border-outline-variant/30'
                        }`}>
                          {release.type || 'minor'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 type-telemetry-micro text-on-surface-variant font-mono">
                        <Calendar size={12} className="text-secondary" />
                        <span>{release.date}</span>
                      </div>
                    </div>

                    {/* Transmission Title */}
                    <h3 className="type-headline text-on-surface font-bold leading-snug mb-2">
                      {release.title || release.transmission}
                    </h3>

                    {/* Release Highlights */}
                    {release.details && release.details.length > 0 && (
                      <ul className="space-y-2 mt-3 pt-3 border-t border-outline-variant/20">
                        {release.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 type-body-sm text-on-surface-variant leading-relaxed">
                            <span className="text-primary mt-0.5 shrink-0 font-bold">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Modal Footer & Easy Pagination Controls */}
            <div className="p-4 sm:p-6 border-t border-outline-variant/30 bg-surface-lowest flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 relative z-10">
              <div className="type-overline text-on-surface-variant font-mono">
                Release Archive: {releasesData.length} Versions Logged
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="h-12 px-4 rounded-xl bg-surface-high border border-outline-variant/30 text-on-surface hover:bg-surface-highest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 type-overline touch-target-compact cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="type-telemetry-micro text-on-surface-variant px-3 py-1 bg-surface-high/50 rounded-lg border border-outline-variant/20 font-mono">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="h-12 px-4 rounded-xl bg-surface-high border border-outline-variant/30 text-on-surface hover:bg-surface-highest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 type-overline touch-target-compact cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default VersionHistoryModal;
