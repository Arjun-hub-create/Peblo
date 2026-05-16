import React, { memo } from 'react';
import { motion } from 'framer-motion';

function PulseRings({ active, color = 'rgba(124,58,237,0.4)', size = 120 }) {
  if (!active) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size,
            height: size,
            left: '50%',
            top: '50%',
            marginLeft: -size / 2,
            marginTop: -size / 2,
            border: `1px solid ${color}`,
          }}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: [0.6, 1.4 + i * 0.15], opacity: [0.5, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.55,
          }}
        />
      ))}
    </>
  );
}

export default memo(PulseRings);
