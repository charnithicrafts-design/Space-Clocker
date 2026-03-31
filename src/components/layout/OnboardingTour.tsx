import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronRight, X, LayoutDashboard, Target, Clock, Brain, CheckCircle2 } from 'lucide-react';
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
    content: "Welcome, Cadet Nithya Dharshini. Your previous accolades in the ISRO Antarkish Hackathon and NASA Space Apps have been synchronized. We've initialized your trajectory toward the 2027 Scientist 'SC' mission.",
    icon: Rocket,
    target: "mission-briefing",
    route: "/"
  },
  {
    title: "Stellar History",
    content: "Your historical achievements—successes, misses, and tactical pivots—are now part of your Stellar Timeline. This history fuels your Momentum Engine and levels up your Astro-Technical rank.",
    icon: CheckCircle2,
    target: "history",
    route: "/"
  },
  {
    title: "Momentum Engine",
    content: "This is your Momentum Engine. It tracks your overall progress. Notice how your level (Rank 15) reflects your background in Cybersecurity and GIS.",
    icon: LayoutDashboard,
    target: "dashboard",
    route: "/"
  },
  {
    title: "Architect Mode",
    content: "In Architect Mode (Nebula), we've mapped your 2027 ISRO ambition into technical milestones like the IIRS PG Diploma. Deconstruct any mission here.",
    icon: Target,
    target: "nebula",
    route: "/nebula"
  },
  {
    title: "Daily Orbit",
    content: "Manage your daily orbital tasks, like Cybersecurity drills. Use the 'Void Protocol' to lock out distractions that threaten your 2027 trajectory.",
    icon: Clock,
    target: "orbit",
    route: "/orbit"
  },
  {
    title: "The Void",
    content: "Visualize your proficiency in the Skills Matrix. Your current mastery in GIS and Full Stack is impressive, but ISRO requires deep focus on Satellite Forensics.",
    icon: Brain,
    target: "skills",
    route: "/skills"
  },
  {
    title: "Launch Sequence",
    content: "System check complete. Your path to ISRO/NASA is paved with your past victories. Chart your course to the stars, Commander Nithya.",
    icon: CheckCircle2,
    target: "complete",
    route: "/"
  }
];

const OnboardingTour = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { importDemoData } = useTrackStore();
  const navigate = useNavigate();

  const step = steps[currentStep];

  const handleNext = async () => {
    if (currentStep === 0) {
      await importDemoData(demoData);
      SoundManager.playUplink();
    } else {
      SoundManager.playPop();
    }

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
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg glass-panel border-2 border-primary/30 p-8 rounded-[2.5rem] relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
            <step.icon size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <h1 className="text-3xl font-display font-black text-white">
              {step.title}
            </h1>
          </div>

          <p className="text-on-surface-variant leading-relaxed">
            {step.content}
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
    </div>
  );
};

export default OnboardingTour;
