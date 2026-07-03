import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Target,
  Clock,
  Brain,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Globe,
  Box,
  Timer,
  TrendingUp,
  Orbit,
  Database,
  Star,
  ChevronDown,
} from 'lucide-react';

// ─── Starfield Canvas ───────────────────────────────────────────────
const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: { x: number; y: number; z: number; o: number }[] = [];
    const STAR_COUNT = 260;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.3,
        o: Math.random(),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.o += 0.003 * s.z;
        const alpha = 0.3 + Math.abs(Math.sin(s.o)) * 0.7;
        ctx.fillStyle = `rgba(0, 242, 255, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.z * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

// ─── Section animation variants ─────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ─── Feature Data ───────────────────────────────────────────────────
const features = [
  {
    icon: Rocket,
    title: 'Momentum Engine',
    subtitle: 'Dashboard',
    description:
      'Your mission control. Track XP, levels, and macro ambitions with a real‑time resonance feed that visualizes every micro‑win.',
    color: 'text-primary',
    bgGlow: 'from-primary/10 to-transparent',
    borderColor: 'border-primary/20',
  },
  {
    icon: Target,
    title: 'Nebula Architect',
    subtitle: 'Goal Decomposition',
    description:
      'Decompose massive ambitions into stellar milestones. Navigate the constellation map to see exactly where you stand on each trajectory.',
    color: 'text-secondary',
    bgGlow: 'from-secondary/10 to-transparent',
    borderColor: 'border-secondary/20',
  },
  {
    icon: Clock,
    title: 'Orbit Scheduler',
    subtitle: 'Daily Engine',
    description:
      'Precision daily planning with efficiency tracking and Void Protocol — the anti‑habit system that shields you from distractions.',
    color: 'text-primary-container',
    bgGlow: 'from-primary-container/10 to-transparent',
    borderColor: 'border-primary-container/20',
  },
  {
    icon: Brain,
    title: 'Stellar Matrix',
    subtitle: 'Skills Radar',
    description:
      'A radar‑chart visualization for technical proficiency. Bright stars mark mastery; dim regions reveal gaps to conquer next.',
    color: 'text-success',
    bgGlow: 'from-success/10 to-transparent',
    borderColor: 'border-success/20',
  },
];

const differentiators = [
  {
    icon: Database,
    title: 'Local‑First Privacy',
    description:
      'All data lives in your browser via PGlite (Postgres in WASM). No cloud dependency — your trajectories never leave your machine unless you choose to sync.',
  },
  {
    icon: Sparkles,
    title: 'AI Copilot Ready',
    description:
      'Integrated Gemini AI assists with goal decomposition, schedule optimization, and reflective insights — like a mission‑control advisor.',
  },
  {
    icon: Shield,
    title: 'Void Protocol',
    description:
      'A unique Not‑To‑Do system. Identify distractions, log temptations, and build anti‑habits. Treat the void as something to defend against, not fall into.',
  },
  {
    icon: Globe,
    title: 'Cross‑Device Sync',
    description:
      'Optional peer‑to‑peer sync lets you uplink your data across devices securely, without centralised servers owning your productivity graph.',
  },
];

const stats = [
  { label: 'Modes', value: '4+', sub: 'Integrated modules' },
  { label: 'Storage', value: '0 KB', sub: 'Cloud data sent' },
  { label: 'Latency', value: '<1ms', sub: 'Local DB queries' },
  { label: 'Audio', value: '100%', sub: 'Immersive feedback' },
];

// ─── Component ──────────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-surface-lowest overflow-hidden">
      <Starfield />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Radial glow behind logo */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0,242,255,0.35) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/30 shadow-[0_0_60px_rgba(0,242,255,0.15)]">
            <Box className="text-primary" size={48} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-display text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4"
        >
          Space<span className="text-primary">Clocker</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-xl md:text-2xl text-primary-container font-display font-bold tracking-widest uppercase mb-6"
        >
          Clock In Your Mental Space
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl text-on-surface-variant text-base md:text-lg leading-relaxed mb-10"
        >
          A high‑fidelity, space‑themed productivity cockpit for students and
          professionals who treat their career trajectory like a mission.
          Decompose ambitions. Orbit daily tasks. Track skills like
          constellations. All local‑first, all immersive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.25)] hover:shadow-[0_0_60px_rgba(0,242,255,0.4)] transition-all duration-300 hover:scale-105"
          >
            Launch Dashboard
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/40 text-primary font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary/5 transition-all duration-300"
          >
            Explore Features
            <ChevronDown size={18} />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-primary/40" size={28} />
        </motion.div>
      </section>

      {/* ── Stats Ticker ─────────────────────────────────────────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-5xl mx-auto px-6 -mt-10 mb-20"
      >
        <div className="glass-panel rounded-3xl border border-outline-variant p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center nebula-shadow">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-display font-black text-primary tracking-tight">
                {s.value}
              </div>
              <div className="text-xs font-bold text-on-surface uppercase tracking-widest mt-1">
                {s.label}
              </div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Core Modules ─────────────────────────────────────────── */}
      <motion.section
        id="features"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative z-10 max-w-6xl mx-auto px-6 mb-28"
      >
        <div className="text-center mb-14">
          <h2 className="text-secondary text-xs font-black uppercase tracking-[0.35em] mb-3">
            Core Modules
          </h2>
          <p className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Four Engines. One Mission.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={cardVariants}
                className={`group glass-panel rounded-3xl border ${f.borderColor} p-8 relative overflow-hidden hover:border-opacity-60 transition-all duration-300`}
              >
                {/* Subtle gradient glow */}
                <div
                  className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${f.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/40 flex items-center justify-center`}
                    >
                      <Icon className={f.color} size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">
                        {f.title}
                      </h3>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                        {f.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── What Makes Us Different ───────────────────────────────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative z-10 max-w-6xl mx-auto px-6 mb-28"
      >
        <div className="text-center mb-14">
          <h2 className="text-primary-container text-xs font-black uppercase tracking-[0.35em] mb-3">
            Why Space Clocker
          </h2>
          <p className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Engineered Different
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {differentiators.map((d) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                variants={cardVariants}
                className="group flex gap-5 p-6 rounded-2xl bg-surface-low/50 border border-outline-variant/20 hover:border-primary/20 transition-all duration-300"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <Icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-tight mb-1.5">
                    {d.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {d.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── Tagline Interlude ─────────────────────────────────────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 py-24 text-center"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,242,255,0.3) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <Star
            className="mx-auto text-primary/30 mb-6"
            size={40}
            fill="currentColor"
          />
          <p className="font-display text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight max-w-3xl mx-auto px-6">
            Your Goals Are{' '}
            <span className="text-primary">Constellations</span>.
            <br />
            We Help You{' '}
            <span className="text-secondary">Navigate</span> Them.
          </p>
          <p className="text-on-surface-variant mt-6 text-base md:text-lg max-w-xl mx-auto px-6">
            Space Clocker is not another to‑do app. It's a productivity
            operating system disguised as a space mission — because your career
            deserves that level of precision.
          </p>
        </div>
      </motion.section>

      {/* ── Target Audience ───────────────────────────────────────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative z-10 max-w-4xl mx-auto px-6 mb-28"
      >
        <div className="glass-panel rounded-3xl border border-outline-variant p-8 md:p-12 nebula-shadow">
          <h2 className="text-success text-xs font-black uppercase tracking-[0.35em] mb-3 text-center">
            Built For
          </h2>
          <p className="font-display text-2xl md:text-4xl font-black text-white uppercase tracking-tighter text-center mb-10">
            Ambitious Minds
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Students',
                desc: 'MCA, engineering, or any intensive program — track your skill trajectory toward certifications like AWS, Azure, or Data Analytics.',
              },
              {
                icon: Timer,
                title: 'Self‑Learners',
                desc: 'Building expertise on your own terms? Decompose learning paths into stellar milestones and hold yourself accountable.',
              },
              {
                icon: Orbit,
                title: 'Career Pivoters',
                desc: 'Switching domains? Map your transition as a trajectory, track new skills as constellations, and orbit your daily plan.',
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-surface-low border border-outline-variant/40 flex items-center justify-center">
                    <Icon className="text-primary-container" size={24} />
                  </div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-tight mb-2">
                    {a.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 text-center pb-32 px-6"
      >
        <Zap
          className="mx-auto text-primary/30 mb-6"
          size={36}
          fill="currentColor"
        />
        <h2 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Ready to Launch?
        </h2>
        <p className="text-on-surface-variant max-w-lg mx-auto mb-10 text-base">
          Your trajectories are waiting. Open the dashboard and start clocking
          in your mental space — today.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-on-primary font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.25)] hover:shadow-[0_0_80px_rgba(0,242,255,0.4)] transition-all duration-300 hover:scale-105"
        >
          Enter Mission Control
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-[0.3em] mt-8">
          100% Local‑First · Zero Cloud Lock‑In · Open Architecture
        </p>
      </motion.section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-outline-variant/20 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Box className="text-primary" size={18} />
          <span className="font-display text-sm font-black text-white uppercase tracking-tighter">
            Space<span className="text-primary">Clocker</span>
          </span>
        </div>
        <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
          Clock In Your Mental Space
        </p>
        <p className="text-[10px] text-on-surface-variant/30 mt-4">
          &copy; {new Date().getFullYear()} Space Clocker. Engineered for
          ambitious minds.
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
