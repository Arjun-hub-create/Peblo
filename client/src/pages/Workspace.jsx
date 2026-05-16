import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import useNotesStore from '../store/notesStore';
import CosmicBackground from '../components/ui/CosmicBackground';
import Sidebar from '../components/layout/Sidebar';
import NoteCard from '../components/notes/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';
import AIPanel from '../components/ai/AIPanel';
import VoiceInput from '../components/voice/VoiceInput';

export default function Workspace() {
  const {
    notes, activeNote, isLoading,
    fetchNotes, createNote, updateNote, deleteNote,
    setActiveNote, shareNote,
  } = useNotesStore();

  const [showAI, setShowAI] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  useEffect(() => { fetchNotes(); }, []);

  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];

  const handleNewNote = async () => {
    try {
      const note = await createNote({ title: 'Untitled Note', content: '' });
      setActiveNote(note);
      toast.success('New note created!');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create note.';
      toast.error(msg);
      console.error('Create note error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      toast.success('Note deleted.');
    } catch { toast.error('Failed to delete note.'); }
  };

  const handleArchive = async (note) => {
    try {
      await updateNote(note._id, { archived: !note.archived });
      toast.success(note.archived ? 'Unarchived.' : 'Archived.');
      fetchNotes();
    } catch { toast.error('Failed to archive note.'); }
  };

  const handleShare = async (note) => {
    try {
      const shareId = await shareNote(note._id);
      const url = `${window.location.origin}/shared/${shareId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied!');
    } catch { toast.error('Failed to share note.'); }
  };

  const handleVoiceTranscript = (text) => {
    if (!activeNote) { toast.error('Select a note first.'); return; }
    const newContent = activeNote.content ? activeNote.content + '\n' + text : text;
    updateNote(activeNote._id, { content: newContent });
    toast.success('Voice added to note!');
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: '#0B1020' }}>

      {/* Cosmic background — behind everything */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <CosmicBackground intensity={0.45} variant="subtle" />
      </div>

      {/* ── SIDEBAR ── */}
      <div className="relative flex-shrink-0" style={{ zIndex: 20 }}>
        <Sidebar onNewNote={handleNewNote} tags={allTags} />
      </div>

      {/* ── NOTES LIST ── */}
      <div
        className="flex-shrink-0 flex flex-col h-full"
        style={{
          width: 272,
          zIndex: 20,
          background: 'rgba(13,17,38,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* List header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="font-display font-semibold text-white text-sm">
            Notes{' '}
            <span className="text-slate-600 font-normal">({notes.length})</span>
          </span>
          <motion.button
            onClick={handleNewNote}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.22)', border: 'none', cursor: 'pointer', color: '#a78bfa' }}
          >
            <Plus size={14} />
          </motion.button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl shimmer" />
            ))
          ) : notes.length === 0 ? (
            <motion.div className="text-center pt-14" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.15)' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-violet-400" />
              </motion.div>
              <p className="text-slate-500 text-sm mb-2">No notes yet</p>
              <motion.button
                onClick={handleNewNote}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="text-violet-400 text-xs"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                + Create your first note
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  isActive={activeNote?._id === note._id}
                  onClick={() => setActiveNote(note)}
                  onDelete={() => handleDelete(note._id)}
                  onArchive={() => handleArchive(note)}
                  onShare={() => handleShare(note)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── EDITOR + AI PANEL ── */}
      <div className="flex flex-1 h-full overflow-hidden" style={{ zIndex: 20, background: 'rgba(11,16,32,0.75)', backdropFilter: 'blur(16px)' }}>
        <NoteEditor
          note={activeNote}
          onDelete={handleDelete}
          onAIPanel={() => setShowAI((v) => !v)}
        />
        <AnimatePresence>
          {showAI && activeNote && (
            <AIPanel note={activeNote} onClose={() => setShowAI(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* ── VOICE FAB ── */}
      <motion.div className="fixed bottom-8 right-8" style={{ zIndex: 200, width: 56, height: 56 }}>
        {showVoice && (
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-400/40"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.button
          onClick={() => setShowVoice(true)}
          title="Voice Note"
          className="relative flex items-center justify-center rounded-full w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
            boxShadow: showVoice
              ? '0 0 48px rgba(34,211,238,0.7)'
              : '0 0 32px rgba(124,58,237,0.65)',
            border: 'none', cursor: 'pointer',
          }}
          whileHover={{ scale: 1.12, boxShadow: '0 0 52px rgba(124,58,237,0.9)' }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Mic size={22} color="white" />
        </motion.button>
      </motion.div>

      {/* ── VOICE MODAL ── */}
      <AnimatePresence>
        {showVoice && (
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onClose={() => setShowVoice(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
