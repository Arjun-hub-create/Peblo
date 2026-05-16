import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Music, X, ArrowRight, Brain, Zap, Globe, Mic } from 'lucide-react';
import CosmicBackground from '../components/ui/CosmicBackground';
import AIOrb from '../components/ui/AIOrb';
import WelcomeBanner from '../components/ui/WelcomeBanner';

const features = [
  { icon: Brain,    title: 'AI Summaries',       desc: 'GPT-4 powered intelligent summaries, action items, and insights extracted from your notes.' },
  { icon: Mic,      title: 'Voice Interaction',   desc: 'Speak your thoughts. Voice-to-text, AI voice responses, and conversational queries.' },
  { icon: Zap,      title: 'Smart Tags & Titles', desc: 'AI automatically suggests relevant tags and compelling titles for every note.' },
  { icon: Globe,    title: 'Public Sharing',      desc: 'Share notes via beautiful public pages. No login required for viewers.' },
  { icon: Sparkles, title: 'Neural Workspace',    desc: 'A living, breathing workspace that adapts to your thinking patterns.' },
];

export default function Landing() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const iframeRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const toggleMusic = () => {
    setMusicOn((v) => !v);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-body" style={{ background: '#0B1020' }}>
      <CosmicBackground intensity={1} cinematic={musicOn} showUnicorn />
      <WelcomeBanner forceShow={musicOn} />

      {/* Hidden YouTube iframe for ambient music */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/heubljqtJ0I?autoplay=${musicOn ? 1 : 0}&loop=1&playlist=heubljqtJ0I&controls=0&mute=0`}
        style={{ display: 'none' }}
        allow="autoplay"
        title="Peblo Ambient"
      />

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #a78bfa, #7c3aed)' }} />
          <span className="font-display font-bold text-white text-lg tracking-wide">Peblo</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          {/* Music toggle */}
          <motion.button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: musicOn ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${musicOn ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`,
              color: musicOn ? '#a78bfa' : '#94a3b8',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Music size={14} />
            {musicOn ? 'Music On' : '♫ Enter Peblo Universe'}
          </motion.button>

          <Link to="/login">
            <motion.button
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.03 }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              className="px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero */}
      <motion.section
        className="relative z-10 cosmic-ui-layer flex flex-col items-center justify-center text-center px-6 pt-16 pb-32"
        style={{ y: heroY }}
      >
        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-12"
        >
          <AIOrb size={140} isGenerating={musicOn} />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
        >
          <Sparkles size={12} />
          AI-Powered Neural Workspace
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display font-bold leading-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', maxWidth: 900 }}
        >
          <span className="text-white">Every Curious Mind</span>
          <br />
          <span className="gradient-text">is Born to Thrive</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="text-slate-400 text-xl mb-10 max-w-xl leading-relaxed"
        >
          Write. Organize. Summarize. Think Faster.
          <br />
          <span className="text-slate-500 text-base">An immersive AI-powered thought universe where notes become living intelligence.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/signup">
            <motion.button
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #22d3ee 100%)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(124,58,237,0.6)' }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free <ArrowRight size={16} />
            </motion.button>
          </Link>
          <motion.button
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-300 text-base glass"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(124,58,237,0.5)', color: 'white' }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={16} /> Watch Peblo Universe
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex items-center gap-8 mt-16 text-center"
        >
          {[
            { val: 'GPT-4.1', label: 'AI Engine' },
            { val: 'Voice', label: 'Interaction' },
            { val: '∞', label: 'Notes' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-2xl gradient-text">{s.val}</div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features section */}
      <section className="relative z-10 cosmic-ui-layer px-6 pb-32 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-white text-4xl mb-4">
            A New Way to <span className="gradient-text">Think</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Built for the curious minds who demand more than a basic notes app.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-6 rounded-2xl glass"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <f.icon size={18} className="text-violet-400" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 cosmic-ui-layer px-6 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-12 rounded-3xl"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <AIOrb size={80} className="mx-auto mb-6" />
          <h2 className="font-display font-bold text-white text-3xl mb-4">
            Ready to Enter the<br /><span className="gradient-text">Neural Universe?</span>
          </h2>
          <p className="text-slate-400 mb-8">Join the workspace where ideas become intelligence.</p>
          <Link to="/signup">
            <motion.button
              className="px-10 py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Start for Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10 text-slate-600 text-sm">
        © {new Date().getFullYear()} Peblo Neural Workspace · Every Curious Mind is Born to Thrive
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(124,58,237,0.3)', background: '#0B1020' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <span className="font-display font-semibold text-white">Peblo Universe</span>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/heubljqtJ0I?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                title="Peblo Universe Video"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
