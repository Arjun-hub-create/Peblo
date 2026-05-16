import { useEffect, useState } from 'react';

/** Responsive + accessibility prefs for cosmic effects. */
export default function useCosmicPrefs() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (e) => setReduceMotion(e.matches);

    setReduceMotion(mq.matches);
    window.addEventListener('resize', onResize);
    mq.addEventListener('change', onMotion);
    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener('change', onMotion);
    };
  }, []);

  return {
    isMobile,
    reduceMotion,
    starCount: isMobile ? 90 : reduceMotion ? 60 : 180,
    particleCount: isMobile ? 24 : reduceMotion ? 16 : 48,
    planetCount: isMobile ? 2 : reduceMotion ? 0 : 4,
    showUnicorn: !isMobile && !reduceMotion,
  };
}
