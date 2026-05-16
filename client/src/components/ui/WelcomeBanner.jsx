import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'peblo_welcome_seen';

export default function WelcomeBanner({ forceShow = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      return;
    }
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [forceShow]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-24 left-1/2 z-[60] -translate-x-1/2 px-5 py-3 rounded-2xl flex items-center gap-3 max-w-md w-[calc(100%-2rem)]"
          style={{
            background: 'rgba(17, 20, 45, 0.88)',
            border: '1px solid rgba(167, 139, 250, 0.35)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(124, 58, 237, 0.25)',
          }}
        >
          <Sparkles size={18} className="text-violet-300 flex-shrink-0" />
          <p className="text-sm text-slate-200 font-medium flex-1">
            ✨ Welcome to the Peblo Universe
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="text-slate-500 hover:text-white transition-colors p-1"
            aria-label="Dismiss welcome"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
