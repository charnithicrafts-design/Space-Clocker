import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuProps {
  actions: {
    label: string;
    icon: React.ComponentType<{ size?: number | string; className?: string }>;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'default' | 'error';
  }[];
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;
    const handleEvents = (e: MouseEvent | KeyboardEvent) => {
      if (e.type === 'click' || (e instanceof KeyboardEvent && e.key === 'Escape')) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleEvents as EventListener);
    window.addEventListener('keydown', handleEvents as EventListener);
    return () => {
      window.removeEventListener('click', handleEvents as EventListener);
      window.removeEventListener('keydown', handleEvents as EventListener);
    };
  }, [isOpen]);

  if (!actions || actions.length === 0) return null;

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-surface-high rounded-lg transition-colors text-on-surface-variant hover:text-white"
        title="Actions"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-36 glass-panel border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                role="menuitem"
                onClick={(e) => {
                  setIsOpen(false);
                  action.onClick(e);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors hover:bg-surface-high ${action.variant === 'error' ? 'text-error hover:bg-error/10' : 'text-white'}`}
              >
                <action.icon size={14} />
                <span>{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
