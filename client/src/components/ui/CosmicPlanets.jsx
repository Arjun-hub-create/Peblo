import React, { memo } from 'react';
import { motion } from 'framer-motion';

function Planet({ size, style, colors, duration, delay, rotate = false }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        ...style,
        background: `radial-gradient(circle at 32% 28%, ${colors[0]} 0%, ${colors[1]} 38%, ${colors[2]} 72%, transparent 100%)`,
        boxShadow: `0 0 ${size * 0.4}px ${colors[3]}, inset -${size * 0.08}px -${size * 0.06}px ${size * 0.25}px rgba(0,0,0,0.35)`,
        filter: 'blur(0.5px)',
        opacity: style.opacity ?? 0.85,
      }}
      animate={{
        y: [0, -18, 6, 0],
        x: [0, 12, -8, 0],
        ...(rotate ? { rotate: [0, 8, -6, 0] } : {}),
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse 40% 30% at 28% 22%, rgba(255,255,255,0.35) 0%, transparent 55%)`,
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '18%',
          height: '12%',
          top: '38%',
          left: '52%',
          background: 'rgba(0,0,0,0.12)',
          filter: 'blur(8px)',
        }}
      />
    </motion.div>
  );
}

function CosmicPlanets({ count = 4, cinematic = false }) {
  const planets = [
    {
      size: cinematic ? 420 : 360,
      style: { top: '-12%', right: '-8%', opacity: 0.55 },
      colors: ['#c4b5fd', '#7c3aed', '#312e81', 'rgba(124,58,237,0.25)'],
      duration: 28,
      delay: 0,
      rotate: true,
    },
    {
      size: cinematic ? 220 : 180,
      style: { bottom: '-6%', left: '-4%', opacity: 0.45 },
      colors: ['#67e8f9', '#0891b2', '#0c4a6e', 'rgba(34,211,238,0.2)'],
      duration: 22,
      delay: 2,
    },
    {
      size: 100,
      style: { top: '42%', left: '8%', opacity: 0.22 },
      colors: ['#fbcfe8', '#ec4899', '#831843', 'rgba(244,114,182,0.15)'],
      duration: 18,
      delay: 4,
    },
    {
      size: 70,
      style: { top: '18%', left: '42%', opacity: 0.15 },
      colors: ['#e9d5ff', '#a78bfa', '#4c1d95', 'rgba(167,139,250,0.1)'],
      duration: 20,
      delay: 1,
    },
  ].slice(0, count);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {planets.map((p, i) => (
        <Planet key={i} {...p} />
      ))}
    </motion.div>
  );
}

export default memo(CosmicPlanets);
