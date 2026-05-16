import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from './CosmicBackground';
import AIOrb from './AIOrb';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#0B1020' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CosmicBackground intensity={0.6} variant="subtle" />
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AIOrb size={72} isGenerating className="mx-auto mb-6" />
        <motion.p
          className="text-violet-300 font-display text-sm tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing Neural Workspace…
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
