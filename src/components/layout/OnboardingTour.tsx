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
    <div className="fixed inset-0 z-[200] bg-surface-lowest/80 backdrop-blur-xl overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {currentStep === -1 ? (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="w-full max-w-xl glass-panel border-2 border-primary/30 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]">
                  <Rocket className="w-8 h-8 sm:w-12 sm:h-12" />
                </div>

                <div className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-secondary">
                  System Initialization
                </h2>
                <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
                  Welcome to Space-Clocker
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto">
                  Space-Clocker is a high-fidelity command center designed to bridge the gap between ambitious goals and daily execution.
                </p>
                
                {/* Browser Callout (Pre-Flight Check) */}
                <div className="w-full max-w-md mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-left mt-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 font-mono text-[10px] font-black">
                    SYS
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Pre-Flight System Check</h4>
                    <p className="text-[11px] text-on-surface-variant leading-normal">
                      Optimized for Chrome Mission Control. Best experienced on Chrome desktop or Android.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full pt-2 sm:pt-4 relative z-20">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStartWithDemo();
                  }}
                  className="flex flex-row sm:flex-col items-center sm:items-center gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group cursor-pointer text-left sm:text-center"
                >
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/20 text-primary group-hover:scale-110 transition-transform pointer-events-none shrink-0">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="pointer-events-none">
                    <div className="font-black text-white uppercase tracking-wider text-xs sm:text-sm">Import Demo</div>
                    <div className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">See a pre-configured flight plan</div>
                  </div>
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStartFromScratch();
                  }}
                  className="flex flex-row sm:flex-col items-center sm:items-center gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface-high/10 border border-surface-high/20 hover:bg-surface-high/20 transition-all group cursor-pointer text-left sm:text-center"
                >
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-high/20 text-on-surface group-hover:scale-110 transition-transform pointer-events-none shrink-0">
                    <Eraser className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="pointer-events-none">
                    <div className="font-black text-white uppercase tracking-wider text-xs sm:text-sm">Start Fresh</div>
                    <div className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">Initialize a clean mission slate</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={handleSkip}
                className="text-[10px] sm:text-xs font-bold text-on-surface-variant hover:text-white uppercase tracking-[0.2em] transition-colors mt-2"
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
            className="w-full max-w-lg glass-panel border-2 border-primary/30 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
                {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-secondary">
                  Step {currentStep + 1} of {steps.length}
                </h2>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                  {steps[currentStep].title}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {steps[currentStep].content}
              </p>

              <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 pt-4">
                <button 
                  onClick={handleNext}
                  className="order-1 sm:order-2 flex-1 flex items-center justify-center gap-2 bg-primary-container text-on-primary px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all group text-sm sm:text-base"
                >
                  <span>{currentStep === steps.length - 1 ? 'LAUNCH' : 'NEXT SECTOR'}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleSkip}
                  className="order-2 sm:order-1 flex-1 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-on-surface-variant hover:text-white transition-colors text-sm sm:text-base"
                >
                  SKIP MISSION
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 sm:w-8 bg-primary' : 'w-1.5 sm:w-2 bg-surface-high'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingTour;
