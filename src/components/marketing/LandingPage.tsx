import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Brain, Shield, ArrowRight, Zap, Orbit, Star, Activity, Target, Calendar } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

// --- Particle Background ---
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; s: number; vx: number; vy: number; a: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        a: Math.random()
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        p.a += 0.01;
        const alpha = 0.2 + Math.abs(Math.sin(p.a)) * 0.5;

        ctx.fillStyle = `rgba(0, 242, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60" />;
};

// --- Mental Sync Orb Visualizer ---
const MentalSyncVisualizer: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Ambient background glow */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-40 h-40 bg-primary/20 blur-[40px] rounded-full" 
      />

      {/* Orbit Rings */}
      <div className="absolute w-48 h-48 rounded-full border border-white/5" />
      <div className="absolute w-64 h-64 rounded-full border border-white/5 border-dashed" />
      
      {/* Synchronizing Particle on Inner Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute w-48 h-48"
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rounded-full shadow-[0_0_15px_rgba(255,84,77,0.8)]" />
      </motion.div>

      {/* Synchronizing Particle on Outer Ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute w-64 h-64"
      >
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,255,0.8)]" />
      </motion.div>

      {/* Central Core */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 20px rgba(0,242,255,0.2)', '0 0 40px rgba(0,242,255,0.6)', '0 0 20px rgba(0,242,255,0.2)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-2xl relative z-10 border border-primary/30"
      >
        <Brain className="text-[#06080F]" size={28} />
      </motion.div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const launchApp = () => {
    SoundManager.playSwell();
    if (window.location.hostname === 'spaceclocker.com' || window.location.hostname === 'www.spaceclocker.com') {
      window.location.href = 'https://app.spaceclocker.com/identity';
    } else {
      navigate('/identity');
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans">
      <ParticleBackground />
      
      {/* Decorative Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#06080F]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Orbit className="text-primary animate-spin-slow" size={28} />
            <span className="text-xl font-display font-black tracking-widest uppercase">Space-Clocker</span>
          </div>
          <button 
            onClick={launchApp}
            className="px-6 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-[#06080F] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-300"
          >
            Enter Mission Control
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 min-h-screen flex items-center z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            style={{ y: y1, opacity }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Zap size={14} /> Space-Clocker v1.9.0 is Live
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-black leading-[1.1] tracking-tighter">
              Clock In Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                Mental Space.
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-lg leading-relaxed font-light">
              A productivity OS that synchronizes your mind with your internal clock. Turn your gut feeling into tangible momentum for ambitious projects, life goals, and relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={launchApp}
                className="group relative px-8 py-4 rounded-2xl bg-primary text-[#06080F] font-black uppercase tracking-widest text-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Construct Trajectory <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            style={{ 
              y: y2,
              rotateX: mousePosition.y,
              rotateY: -mousePosition.x
            }}
            className="relative perspective-1000 hidden lg:block"
          >
            <div className="w-full aspect-square rounded-[3rem] glass-panel border border-white/10 p-8 shadow-2xl shadow-primary/20 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Mental Sync</h3>
                  <div className="text-7xl font-display font-black text-primary">95<span className="text-2xl text-primary/50">%</span></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <Activity size={32} />
                </div>
              </div>

              {/* The Visualizer fills the empty space in the center */}
              <MentalSyncVisualizer />

              <div className="space-y-4 relative z-10">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-white/50 uppercase tracking-widest">
                  <span>State: Flow</span>
                  <span className="text-primary">Optimum Momentum</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#06080F] to-[#0A0D16]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-black">Synchronize your mind. <br/><span className="text-secondary">Trust your internal clock.</span></h2>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              Space-Clocker clocks you into your mental space. It bridges the gap between your gut feeling and your daily actions, ensuring you stay aligned with your life goals, romantic relationships, and financial independence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Target />, title: "The Nebula Map", desc: "Like a GPS for your ambitions. Guides you to your goal with a precise trajectory, breaking massive dreams into actionable milestones." },
              { icon: <Orbit />, title: "Orbit & Stasis Backlog", desc: "Manage daily tasks without the anxiety of missing them. Unfinished tasks carry forward automatically into your Stasis Backlog." },
              { icon: <Brain />, title: "Bio-Feedback System", desc: "Self-reflection and accountability. Psychologically motivates you to improve and maintain your absolute best trajectory." },
              { icon: <Star />, title: "Skill Matrix", desc: "Visualize and track the exact technical and soft skills required for every ambition and project you pursue." },
              { icon: <Calendar />, title: "Timeline View", desc: "Track your progress from a panoramic calendar view, visualizing past victories and upcoming horizons." },
              { icon: <Rocket />, title: "Momentum Engine", desc: "Gain XP, level up your rank, and map your macroscopic ambitions to your daily actions." },
              { icon: <Shield />, title: "The Void Protocol", desc: "Aggressively defend your deep work. Map distractions and lock bad habits out of your daily schedule." },
              { icon: <Zap />, title: "Mission Briefings", desc: "Mentorship directly from Charnithi, plus AI-driven reflection in the upcoming Horizon module.", comingSoon: true }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-panel border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-primary/30 transition-colors group cursor-pointer relative overflow-hidden"
              >
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-2 py-1 rounded border border-secondary/20">
                    In Dev
                  </div>
                )}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-xl font-display font-bold leading-tight">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#06080F] relative z-10 text-center">
        <div className="flex flex-col items-center justify-center gap-4 text-white/40 text-sm font-bold tracking-widest mb-4">
          <div className="flex items-center gap-2 uppercase">
            <Star size={14} className="text-primary" />
            <span>A heartful product from <a href="https://www.charnithi.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline hover:text-primary/80 transition-colors">Charnithi</a></span>
            <Star size={14} className="text-primary" />
          </div>
          <p className="text-white/30 text-xs font-normal normal-case">Space-Clocker © {new Date().getFullYear()}. Synchronize your mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
