import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, MicOff, Volume2, VolumeX, ChevronDown, ChevronUp, Lightbulb, ListChecks, Tag, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useNotesStore from '../../store/notesStore';
import useServerVoice from '../../hooks/useServerVoice';
import AIOrb from '../ui/AIOrb';
import VoiceWaveform from '../ui/VoiceWaveform';

export default function AIPanel({ note, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [showSummary, setShowSummary] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const { generateSummary, suggestTitle, voiceQuery: queryAI, updateNote } = useNotesStore();
  const {
    isRecording,
    isTranscribing,
    supportsRecording,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useServerVoice();
  const isListening = isRecording || isTranscribing;

  const handleGenerateSummary = async () => {
    if (!note?._id || !note.content?.trim()) return toast.error('Add some content first.');
    setIsGenerating(true);
    try {
      const result = await generateSummary(note._id);
      toast.success('AI analysis complete!');
      return result;
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestTitle = async () => {
    if (!note?._id || !note.content?.trim()) return toast.error('Add content first.');
    setIsGenerating(true);
    try {
      const title = await suggestTitle(note._id);
      setSuggestedTitle(title);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to suggest title.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTitle = async () => {
    if (!suggestedTitle) return;
    await updateNote(note._id, { title: suggestedTitle });
    setSuggestedTitle('');
    toast.success('Title applied!');
  };

  const handleSpeakSummary = () => {
    if (!note?.summary) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(note.summary);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceQuery = async () => {
    if (isTranscribing) return;

    if (isRecording) {
      try {
        const text = await stopRecording();
        setVoiceQuery(text);
        await handleVoiceQuery(text);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Voice transcription failed.';
        toast.error(msg);
      }
      return;
    }

    if (!supportsRecording) {
      return toast.error('Voice recording is not supported here. Type your question below.');
    }

    try {
      cancelRecording();
      await startRecording();
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Microphone access denied. Allow the mic in browser settings.'
        : err.message || 'Could not start microphone.';
      toast.error(msg);
    }
  };

  const handleVoiceQuery = async (query) => {
    if (!note?._id || !query.trim()) return;
    setIsGenerating(true);
    try {
      const answer = await queryAI(note._id, query);
      setAiAnswer(answer);
      // Speak answer
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI query failed.';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="w-80 flex flex-col h-full border-l overflow-y-auto"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(11,16,32,0.8)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <AIOrb size={28} isGenerating={isGenerating} isSpeaking={isSpeaking} isListening={isListening} />
          <span className="font-display font-semibold text-white text-sm">Peblo AI</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Main AI actions */}
        <div className="space-y-2">
          <motion.button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}
            whileHover={{ scale: 1.02, background: 'rgba(124,58,237,0.18)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.25)' }}>
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Analyze Note</div>
              <div className="text-slate-500 text-xs">Summary + action items + tags</div>
            </div>
          </motion.button>

          <motion.button
            onClick={handleSuggestTitle}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
            style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,211,238,0.15)' }}>
              <Lightbulb size={14} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Suggest Title</div>
              <div className="text-slate-500 text-xs">AI-generated title</div>
            </div>
          </motion.button>
        </div>

        {/* Suggested title */}
        <AnimatePresence>
          {suggestedTitle && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <p className="text-xs text-slate-400 mb-1.5">Suggested title:</p>
              <p className="text-cyan-300 text-sm font-medium mb-2">"{suggestedTitle}"</p>
              <button onClick={handleApplyTitle}
                className="text-xs px-3 py-1 rounded-lg text-white"
                style={{ background: 'rgba(34,211,238,0.3)' }}>
                Apply Title
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI generating state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="flex gap-1">
                {[0,1,2,3,4].map((i) => (
                  <motion.div key={i} className="w-1 rounded-full bg-violet-400"
                    animate={{ height: [6, 18, 6] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }} />
                ))}
              </div>
              <span className="text-violet-300 text-xs">Peblo is thinking…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        {note?.summary && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowSummary((v) => !v)}
              className="w-full flex items-center justify-between p-3 text-left"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">AI Summary</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); handleSpeakSummary(); }}
                  className="p-1 rounded hover:bg-violet-500/20 transition-colors"
                  title={isSpeaking ? 'Stop speaking' : 'Listen to summary'}>
                  {isSpeaking ? <VolumeX size={12} className="text-pink-400" /> : <Volume2 size={12} className="text-violet-400" />}
                </button>
                {showSummary ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
              </div>
            </button>
            <AnimatePresence>
              {showSummary && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden">
                  <p className="p-3 text-slate-400 text-xs leading-relaxed">{note.summary}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Items */}
        {note?.actionItems?.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowActions((v) => !v)}
              className="w-full flex items-center justify-between p-3 text-left"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2">
                <ListChecks size={12} className="text-cyan-400" />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Action Items</span>
              </div>
              {showActions ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <ul className="p-3 space-y-2">
                    {note.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <div className="w-3.5 h-3.5 rounded border flex-shrink-0 mt-0.5"
                          style={{ borderColor: 'rgba(34,211,238,0.4)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tags */}
        {note?.tags?.length > 0 && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={11} className="text-pink-400" />
              <span className="text-white text-xs font-semibold uppercase tracking-wider">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(244,114,182,0.1)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.2)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Voice Query */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={12} className="text-cyan-400" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">Ask AI</span>
          </div>
          <div className="relative">
            <input
              value={voiceQuery}
              onChange={(e) => setVoiceQuery(e.target.value)}
              placeholder="Ask anything about this note…"
              className="w-full pr-10 py-2.5 px-3 rounded-lg text-xs text-white placeholder-slate-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleVoiceQuery(voiceQuery)}
            />
            <button onClick={startVoiceQuery}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
              style={{ color: isListening ? '#22d3ee' : '#64748b' }}>
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>
          {isListening && (
            <motion.div
              className="mt-3 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <VoiceWaveform active={isRecording} bars={7} color="#22d3ee" />
              <span className="text-cyan-400 text-xs">
                {isTranscribing ? 'Transcribing…' : 'Recording… tap mic when done'}
              </span>
            </motion.div>
          )}

          {/* AI Answer */}
          <AnimatePresence>
            {aiAnswer && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <p className="text-slate-300 text-xs leading-relaxed">{aiAnswer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
