import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import PulseRings from './PulseRings';
import VoiceWaveform from './VoiceWaveform';

function AIOrb({
  size = 120,
  isGenerating = false,
  isSpeaking = false,
  isListening = false,
  className = '',
}) {
  const [hovered, setHovered] = useState(false);
  const active = isGenerating || isSpeaking || isListening;

  const getBoxShadow = () => {
    if (isListening) return '0 0 40px rgba(34,211,238,0.65), 0 0 80px rgba(34,211,238,0.3)';
    if (isSpeaking) return '0 0 40px rgba(244,114,182,0.65), 0 0 80px rgba(244,114,182,0.3)';
    if (isGenerating) return '0 0 60px rgba(124,58,237,0.9), 0 0 120px rgba(124,58,237,0.45)';
    if (hovered) return '0 0 50px rgba(124,58,237,0.7), 0 0 90px rgba(34,211,238,0.25)';
    return '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)';
  };

  const ringColor = isListening
    ? 'rgba(34,211,238,0.45)'
    : isSpeaking
      ? 'rgba(244,114,182,0.45)'
      : 'rgba(124,58,237,0.4)';

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <PulseRings active={active} color={ringColor} size={size * 1.35} />

      {!active && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: i % 2 ? '#22d3ee' : '#a78bfa',
                transform: `rotate(${(i / 6) * 360}deg) translateX(${size * 0.55}px)`,
                opacity: 0.55,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        className="absolute rounded-full border border-violet-500/20"
        style={{ width: size * 1.5, height: size * 1.5 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-cyan-500/15"
        style={{ width: size * 1.28, height: size * 1.28 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="relative rounded-full cursor-pointer"
        style={{
          width: size,
          height: size,
          background:
            'radial-gradient(circle at 30% 30%, #c4b5fd 0%, #7c3aed 40%, #1e1b4b 70%, #0f172a 100%)',
          willChange: 'transform',
        }}
        animate={{
          scale: isGenerating
            ? [1, 1.1, 1]
            : isSpeaking || isListening
              ? [1, 1.07, 1]
              : hovered
                ? [1, 1.05, 1]
                : [1, 1.03, 1],
          boxShadow: [getBoxShadow(), getBoxShadow(), getBoxShadow()],
        }}
        transition={{
          duration: isGenerating ? 1.2 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '40%',
            top: '15%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
          }}
        />

        {(isSpeaking || isListening) && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <VoiceWaveform
              active
              bars={5}
              color={isListening ? '#22d3ee' : '#f472b6'}
            />
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-300 border-r-cyan-400/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default memo(AIOrb);
