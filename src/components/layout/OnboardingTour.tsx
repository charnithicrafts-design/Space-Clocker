import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronRight, LayoutDashboard, Target, Clock, Brain, CheckCircle2, Database, Eraser, Signal } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';
import demoData from '../../data/demo-data.json';
import { useNavigate } from 'react-router-dom';
import { SoundManager } from '../../utils/SoundManager';

interface Step {
  title: string;
  content: string;
  icon: any;
  target: string;
  route: string;
}

const steps: Step[] = [
  {
    title: "Mission Briefing",
    content: "Welcome, Commander! Space-Clocker is your personal command center. It is designed to improve your clocking sense—your natural feeling of time—and help you lock your mind onto your biggest goals.",
    icon: Rocket,
    target: "mission-briefing",
    route: "/"
  },
  {
    title: "1. Sync Time & Goals",
    content: "Keep your daily clocking sense in perfect sync with your goals. The Momentum Engine tracks your focus level and rank in real-time, making sure every tick of the clock brings you closer to your ambitions.",
    icon: LayoutDashboard,
    target: "dashboard",
    route: "/"
  },
  {
    title: "2. Lock in Ambition",
    content: "Lock yourself together with your ambitions in your mental space. In Nebula (Architect Mode), you map out your big dreams and break them down into smaller steps, so they are always top-of-mind.",
    icon: Target,
    target: "nebula",
    route: "/nebula"
  },
  {
    title: "3. Avoid Distractions",
    content: "Stay far away from distractions and bad habits. Use the Void Protocol anti-habit system in your Orbit to name your weaknesses and keep them completely locked out of your daily schedule.",
    icon: Clock,
    target: "orbit",
    route: "/orbit"
  },
  {
    title: "4. Mentor Telemetry",
    content: "Send your progress reports directly to your teacher or mentor with Transmission. Share how you're doing, get feedback, and receive helpful nudges to stay on the right path.",
    icon: Signal,
    target: "transmission",
    route: "/transmission"
  },
  {
    title: "5. Track & Grow Skills",
    content: "Track the skills you need with a simple visual map. By comparing what you can do today with what your goal requires, you can practice the right things and transform your capability into real ability!",
    icon: Brain,
    target: "skills",
    route: "/skills"
  },
  {
    title: "Launch Sequence",
    content: "Your command center is online and ready. It's time to build your focus, master your time, and reach your goals. Safe travels, Commander!",
    icon: CheckCircle2,
    target: "complete",
    route: "/"
  }
];

const OnboardingTour = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for initial choice screen
  const { importDemoData, clearAllData } = useTrackStore();
  const navigate = useNavigate();

  const handleStartWithDemo = async () => {
    await importDemoData(demoData);
    SoundManager.playUplink();
    setCurrentStep(0);
    navigate(steps[0].route);
  };

  const handleStartFromScratch = async () => {
    await clearAllData();
    SoundManager.playThud();
    setCurrentStep(0);
    navigate(steps[0].route);
  };

  const handleNext = async () => {
    SoundManager.playPop();
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      navigate(nextStep.route);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    SoundManager.playThud();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-surface-lowest/80 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {currentStep === -1 ? (
          <motion.div 
            key="choice"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-xl glass-panel border-2 border-primary/30 p-10 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]">
                <Rocket size={48} />
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-secondary">
                  System Initialization
                </h2>
                <h1 className="text-4xl font-display font-black text-white">
                  Welcome to Space-Clocker
                </h1>
                <p className="text-on-surface-variant leading-relaxed max-w-md mx-auto">
                  Space-Clocker is a high-fidelity command center designed to bridge the gap between ambitious goals and daily execution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4 relative z-20">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStartWithDemo();
                  }}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group cursor-pointer"
                >
                  <div className="p-4 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 transition-transform pointer-events-none">
                    <Database size={24} />
                  </div>
                  <div className="text-left pointer-events-none">
                    <div className="font-black text-white uppercase tracking-wider text-sm">Import Demo</div>
                    <div className="text-xs text-on-surface-variant">See a pre-configured flight plan</div>
                  </div>
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStartFromScratch();
                  }}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-surface-high/10 border border-surface-high/20 hover:bg-surface-high/20 transition-all group cursor-pointer"
                >
                  <div className="p-4 rounded-2xl bg-surface-high/20 text-on-surface group-hover:scale-110 transition-transform pointer-events-none">
                    <Eraser size={24} />
                  </div>
                  <div className="text-left pointer-events-none">
                    <div className="font-black text-white uppercase tracking-wider text-sm">Start Fresh</div>
                    <div className="text-xs text-on-surface-variant">Initialize a clean mission slate</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={handleSkip}
                className="text-xs font-bold text-on-surface-variant hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Skip System Setup
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tour"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-lg glass-panel border-2 border-primary/30 p-8 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
                {React.createElement(steps[currentStep].icon, { size: 40 })}
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">
                  Step {currentStep + 1} of {steps.length}
                </h2>
                <h1 className="text-3xl font-display font-black text-white">
                  {steps[currentStep].title}
                </h1>
              </div>

              <p className="text-on-surface-variant leading-relaxed">
                {steps[currentStep].content}
              </p>

              <div className="flex w-full gap-4 pt-4">
                <button 
                  onClick={handleSkip}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-on-surface-variant hover:text-white transition-colors"
                >
                  SKIP MISSION
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-container text-on-primary px-6 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  <span>{currentStep === steps.length - 1 ? 'LAUNCH' : 'NEXT SECTOR'}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-surface-high'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTour;
