import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import useCosmicPrefs from '../../hooks/useCosmicPrefs';
import CosmicPlanets from './CosmicPlanets';
import CosmicUnicorn from './CosmicUnicorn';
import NeuralParticles from './NeuralParticles';

const StarField = memo(function StarField({ count }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || count <= 0) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.pulse += 0.01;
        const o = s.opacity * (0.7 + 0.3 * Math.sin(s.pulse));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${o})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = canvas.height;
          s.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  if (count <= 0) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
});

const blobs = [
  { top: '10%', left: '5%', w: 500, color: 'rgba(124,58,237,0.12)', delay: 0, dur: 18 },
  { top: '60%', right: '5%', w: 400, color: 'rgba(34,211,238,0.08)', delay: 3, dur: 22 },
  { top: '30%', left: '55%', w: 350, color: 'rgba(244,114,182,0.07)', delay: 6, dur: 20 },
  { top: '75%', left: '20%', w: 300, color: 'rgba(124,58,237,0.08)', delay: 1.5, dur: 16 },
];

function CosmicBackground({
  intensity = 1,
  cinematic = false,
  showUnicorn = false,
  variant = 'full',
}) {
  const { starCount, particleCount, planetCount, showUnicorn: canShowUnicorn, reduceMotion } =
    useCosmicPrefs();

  const effectiveIntensity = cinematic ? Math.min(intensity * 1.25, 1) : intensity;
  const planets = variant === 'subtle' ? Math.min(planetCount, 2) : planetCount;
  const particles = variant === 'subtle' ? Math.floor(particleCount * 0.5) : particleCount;

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Layer 1: space gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: cinematic
            ? 'radial-gradient(ellipse at 25% 15%, #1a1040 0%, #0B1020 42%, #060c18 100%)'
            : 'radial-gradient(ellipse at 20% 20%, #130d2e 0%, #0B1020 40%, #060c18 100%)',
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Layer 2: starfield */}
      <StarField count={reduceMotion ? 0 : starCount} />

      {/* Layer 3: planets */}
      {planets > 0 && <CosmicPlanets count={planets} cinematic={cinematic} />}

      {/* Nebula + fog */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 90% 55% at 20% 10%, rgba(124,58,237,${0.1 * effectiveIntensity}) 0%, transparent 58%),
            radial-gradient(ellipse 70% 45% at 85% 75%, rgba(34,211,238,${0.08 * effectiveIntensity}) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(244,114,182,${0.05 * effectiveIntensity}) 0%, transparent 50%)
          `,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 1, background: 'linear-gradient(180deg, transparent 0%, rgba(11,16,32,0.4) 85%, rgba(11,16,32,0.75) 100%)' }}
        animate={{ opacity: cinematic ? [0.5, 0.65, 0.5] : 0.55 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 4: neural particles */}
      <NeuralParticles count={reduceMotion ? 0 : particles} intensity={effectiveIntensity} />

      {/* Layer 5: unicorn guide */}
      {showUnicorn && canShowUnicorn && (
        <CosmicUnicorn isGlowing={cinematic} cinematic={cinematic} />
      )}

      {/* Floating nebula blobs */}
      {!reduceMotion &&
        blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w * effectiveIntensity,
              height: b.w * effectiveIntensity,
              top: b.top,
              left: b.left,
              right: b.right,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              zIndex: 1,
            }}
            animate={{ scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -16, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          />
        ))}

      {/* Subtle grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          opacity: 0.025 * effectiveIntensity,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        animate={cinematic ? { opacity: [0.02, 0.04, 0.02] } : {}}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </motion.div>
  );
}

export default memo(CosmicBackground);
