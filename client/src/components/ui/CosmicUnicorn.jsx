import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const TRAIL = [
  { x: '72%', y: '18%', o: 0.5 },
  { x: '65%', y: '22%', o: 0.35 },
  { x: '58%', y: '26%', o: 0.2 },
];

function CosmicUnicorn({ isGlowing = false, isListening = false, cinematic = false }) {
  const path = useMemo(
    () =>
      cinematic
        ? [
            { x: '78%', y: '14%' },
            { x: '55%', y: '28%' },
            { x: '32%', y: '22%' },
            { x: '48%', y: '38%' },
            { x: '70%', y: '32%' },
            { x: '78%', y: '14%' },
          ]
        : [
            { x: '70%', y: '20%' },
            { x: '45%', y: '30%' },
            { x: '62%', y: '24%' },
            { x: '70%', y: '20%' },
          ],
    [cinematic],
  );

  const glow = isGlowing || isListening;

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ zIndex: 3, width: 120, height: 120, left: 0, top: 0 }}
      animate={path}
      transition={{ duration: cinematic ? 48 : 36, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Particle trail */}
      {TRAIL.map((t, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: t.x,
            top: t.y,
            width: 8 - i * 2,
            height: 8 - i * 2,
            background: 'radial-gradient(circle, rgba(167,139,250,0.9), transparent)',
            filter: 'blur(2px)',
          }}
          animate={{ opacity: [0.1, t.o, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-2, 2, -2],
          filter: glow
            ? ['drop-shadow(0 0 20px rgba(167,139,250,0.6))', 'drop-shadow(0 0 36px rgba(34,211,238,0.5))', 'drop-shadow(0 0 20px rgba(167,139,250,0.6))']
            : ['drop-shadow(0 0 12px rgba(167,139,250,0.35))', 'drop-shadow(0 0 20px rgba(244,114,182,0.25))', 'drop-shadow(0 0 12px rgba(167,139,250,0.35))'],
        }}
        transition={{ duration: glow ? 2 : 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
          <defs>
            <linearGradient id="uniBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="45%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="uniMane" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="uniHorn" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          {/* Wing */}
          <motion.path
            d="M28 58 Q8 42 18 28 Q38 38 42 52 Z"
            fill="url(#uniMane)"
            fillOpacity="0.35"
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Body */}
          <ellipse cx="58" cy="68" rx="28" ry="22" fill="url(#uniBody)" />
          {/* Neck & head */}
          <path
            d="M72 52 Q88 38 82 28 Q78 22 68 26 Q62 32 64 42 Q66 50 72 52Z"
            fill="url(#uniBody)"
          />
          {/* Mane */}
          <path
            d="M68 30 Q58 18 52 32 Q48 44 56 48 Q64 42 68 30Z"
            fill="url(#uniMane)"
            fillOpacity="0.75"
          />
          {/* Horn */}
          <path d="M80 26 L86 8 L84 26 Z" fill="url(#uniHorn)" />
          {/* Eye */}
          <circle cx="76" cy="34" r="2.5" fill="#1e1b4b" />
          <circle cx="76.8" cy="33.2" r="0.8" fill="white" fillOpacity="0.9" />
          {/* Tail */}
          <motion.path
            d="M32 72 Q12 62 18 48 Q28 58 36 68"
            stroke="url(#uniMane)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M32 72 Q12 62 18 48 Q28 58 36 68', 'M32 72 Q10 58 20 44 Q30 56 36 68', 'M32 72 Q12 62 18 48 Q28 58 36 68'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Legs hint */}
          <path d="M44 86 L42 96 M56 88 L54 98 M66 86 L68 96" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </motion.div>

      {glow && (
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)' }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export default memo(CosmicUnicorn);
