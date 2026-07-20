import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Brain, Shield, ArrowRight, Zap, Orbit, Star, Activity } from 'lucide-react';
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
              The first productivity OS built to track your psychological momentum, protect your deep work, and align your daily actions with your lifelong trajectory.
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
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Cognitive Sync</h3>
                  <div className="text-7xl font-display font-black text-primary">95<span className="text-2xl text-primary/50">%</span></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <Activity size={32} />
                </div>
              </div>

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
            <h2 className="text-4xl lg:text-5xl font-display font-black">Not a to-do list. <br/><span className="text-secondary">A neuro-engine.</span></h2>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              Traditional productivity tools track what you do. Space-Clocker tracks how you operate, managing your mental state to prevent burnout and ensure deep alignment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Brain />, title: "Bio-Feedback Monitor", desc: "Real-time calculation of your Cognitive Sync Score based on ambition alignment and daily momentum." },
              { icon: <Rocket />, title: "The Momentum Engine", desc: "Gamify your trajectory. Gain XP, level up your rank, and map your macroscopic ambitions to daily Orbit tasks." },
              { icon: <Shield />, title: "The Void Protocol", desc: "Aggressively defend your deep work. Map your distractions into the Void and track their impact on your mental state." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="glass-panel border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-primary/30 transition-colors group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-2xl font-display font-bold">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#06080F] relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest mb-4">
          <Star size={14} className="text-primary" />
          <span>Mastermind Team Engineered</span>
          <Star size={14} className="text-primary" />
        </div>
        <p className="text-white/30 text-xs">Space-Clocker © {new Date().getFullYear()}. All systems nominal.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
