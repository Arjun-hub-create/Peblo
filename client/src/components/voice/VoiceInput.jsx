import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpeechRecognition, startSpeechRecognition } from '../../utils/speechRecognition';
import VoiceWaveform from '../ui/VoiceWaveform';
import PulseRings from '../ui/PulseRings';

export default function VoiceInput({ onTranscript, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!getSpeechRecognition()) setError('Use Chrome or Edge for voice input.');
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const startListening = () => {
    if (!getSpeechRecognition()) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    setError('');
    setTranscript('');

    const recognition = startSpeechRecognition({
      continuous: true,
      onStart: () => setIsListening(true),
      onResult: (text) => setTranscript(text),
      onEnd: () => setIsListening(false),
      onError: (message) => {
        setIsListening(false);
        if (message) setError(message);
      },
    });

    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleApply = () => {
    const text = transcript.trim() || manualText.trim();
    if (!text) return toast.error('No text to add.');
    onTranscript(text);
    onClose();
  };

  const finalText = transcript.trim() || manualText.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
        padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, borderRadius: 24, overflow: 'hidden',
          background: 'rgba(12,15,35,0.98)',
          border: '1px solid rgba(124,58,237,0.35)',
          boxShadow: '0 0 80px rgba(124,58,237,0.3)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span style={{ color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15 }}>Voice Note</span>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}>
            <X size={18} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '28px 24px 24px', textAlign: 'center' }}
        >
          <motion.div className="relative mx-auto mb-3" style={{ width: 88, height: 88 }}>
            <PulseRings active={isListening} color="rgba(34,211,238,0.45)" size={88} />
            <motion.button
              type="button"
              onClick={isListening ? stopListening : startListening}
              whileTap={{ scale: 0.93 }}
              style={{
                width: 88, height: 88, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isListening
                  ? 'radial-gradient(circle at 35% 35%, #67e8f9, #22d3ee, #0891b2)'
                  : 'radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed, #4c1d95)',
                boxShadow: isListening
                  ? '0 0 40px rgba(34,211,238,0.7), 0 0 80px rgba(34,211,238,0.3)'
                  : '0 0 30px rgba(124,58,237,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              animate={isListening ? { scale: [1, 1.07, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {isListening ? <MicOff size={34} color="white" /> : <Mic size={34} color="white" />}
            </motion.button>
          </motion.div>

          <VoiceWaveform active={isListening} bars={9} color="#22d3ee" className="mb-3" />

          <p style={{ color: isListening ? '#22d3ee' : '#64748b', fontSize: 14, fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>
            {isListening ? 'Listening… speak now' : 'Tap mic to start speaking'}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.25)', display: 'flex', alignItems: 'flex-start', gap: 8, textAlign: 'left' }}
              >
                <AlertCircle size={14} style={{ color: '#f472b6', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: '#f472b6', fontSize: 12, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', textAlign: 'left' }}
              >
                <p style={{ color: '#e2e8f0', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0 }}>{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div style={{ marginBottom: 16 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <p style={{ color: '#334155', fontSize: 11, fontFamily: 'Inter, sans-serif', marginBottom: 6, textAlign: 'left' }}>Or type manually:</p>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your note here…"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10, resize: 'vertical',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', fontSize: 13, fontFamily: 'Inter, sans-serif',
                outline: 'none', boxSizing: 'border-box', lineHeight: 1.5,
              }}
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={handleApply}
            disabled={!finalText}
            whileHover={finalText ? { scale: 1.03, boxShadow: '0 0 30px rgba(124,58,237,0.5)' } : {}}
            whileTap={finalText ? { scale: 0.97 } : {}}
            style={{
              width: '100%', padding: '12px', borderRadius: 12, border: 'none', cursor: finalText ? 'pointer' : 'not-allowed',
              background: finalText ? 'linear-gradient(135deg, #7c3aed, #22d3ee)' : 'rgba(255,255,255,0.06)',
              color: finalText ? 'white' : '#475569',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Check size={16} /> Add to Note
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
