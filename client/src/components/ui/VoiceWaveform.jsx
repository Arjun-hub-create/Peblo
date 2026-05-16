import React, { memo } from 'react';
import { motion } from 'framer-motion';

function VoiceWaveform({ active = false, bars = 7, color = '#22d3ee', className = '' }) {
  if (!active) return null;

  return (
    <div className={`flex items-end justify-center gap-0.5 ${className}`} style={{ height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 3, background: color, transformOrigin: 'bottom' }}
          animate={{ height: [6, 10 + (i % 4) * 5, 6] }}
          transition={{
            duration: 0.42 + (i % 3) * 0.06,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.06,
          }}
        />
      ))}
    </div>
  );
}

export default memo(VoiceWaveform);
