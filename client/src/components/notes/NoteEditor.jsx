import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Archive, Share2, Tag, Sparkles, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import useNotesStore from '../../store/notesStore';

const COLOR_OPTIONS = [
  { id: 'default', hex: '#64748b' },
  { id: 'violet',  hex: '#7c3aed' },
  { id: 'cyan',    hex: '#22d3ee' },
  { id: 'pink',    hex: '#f472b6' },
];

export default function NoteEditor({ note, onDelete, onAIPanel }) {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags]       = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor]     = useState('default');
  const [copied, setCopied]   = useState(false);
  const { updateNote, shareNote, isSaving } = useNotesStore();
  const saveTimer = useRef(null);
  const noteId    = note?._id;

  // Sync local state when note changes
  useEffect(() => {
    if (!note) return;
    setTitle(note.title || '');
    setContent(note.content || '');
    setTags((note.tags || []).join(', '));
    setCategory(note.category || 'General');
    setColor(note.color || 'default');
  }, [noteId]);

  // Auto-save helper
  const scheduleSave = useCallback((patch) => {
    if (!noteId) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateNote(noteId, patch).catch(() => {});
    }, 700);
  }, [noteId, updateNote]);

  const handleTitle = (v) => {
    setTitle(v);
    scheduleSave({ title: v });
  };

  const handleContent = (v) => {
    setContent(v);
    scheduleSave({ content: v });
  };

  const handleTags = (v) => {
    setTags(v);
    const arr = v.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    scheduleSave({ tags: arr });
  };

  const handleCategory = (v) => {
    setCategory(v);
    scheduleSave({ category: v });
  };

  const handleColor = (v) => {
    setColor(v);
    if (noteId) updateNote(noteId, { color: v }).catch(() => {});
  };

  const handleShare = async () => {
    try {
      const shareId = await shareNote(noteId);
      const url = `${window.location.origin}/shared/${shareId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Share link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('Failed to generate share link.'); }
  };

  const handleArchive = async () => {
    try {
      await updateNote(noteId, { archived: !note.archived });
      toast.success(note.archived ? 'Unarchived.' : 'Archived.');
    } catch { toast.error('Failed to archive.'); }
  };

  // Empty state
  if (!note) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(124,58,237,0.2)' }}
        >
          <Sparkles size={28} color="#a78bfa" />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif', fontSize: 16 }}>
          Select a note or create a new one
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
          Your thoughts await in the cosmos
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={noteId}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0, flexWrap: 'wrap', gap: 8,
      }}>
        {/* Color picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {COLOR_OPTIONS.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => handleColor(c.id)}
              title={c.id}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: color === c.id ? 1.25 : 1,
                opacity: color === c.id ? 1 : 0.45,
                boxShadow: color === c.id ? `0 0 12px ${c.hex}88` : '0 0 0 transparent',
              }}
              style={{
                width: 18, height: 18, borderRadius: '50%', background: c.hex,
                border: color === c.id ? `3px solid ${c.hex}` : '2px solid transparent',
                outline: color === c.id ? `2px solid rgba(255,255,255,0.3)` : 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Save indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 6 }}>
            {isSaving ? (
              <motion.div
                style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)', borderTopColor: '#a78bfa' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              />
            ) : (
              <Check size={12} color="#10b981" />
            )}
            <span style={{ color: isSaving ? '#7c3aed' : '#10b981', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
              {isSaving ? 'Saving…' : 'Saved'}
            </span>
          </div>

          {/* AI button */}
          <motion.button
            onClick={onAIPanel}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9,
              background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#a78bfa', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500,
            }}
          >
            <Sparkles size={13} /> AI Assist
          </motion.button>

          {/* Share */}
          <motion.button onClick={handleShare} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            style={{ padding: 8, borderRadius: 9, background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#10b981' : '#475569' }}
            title="Copy share link"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </motion.button>

          {/* Archive */}
          <motion.button onClick={handleArchive} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            style={{ padding: 8, borderRadius: 9, background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}
            title={note.archived ? 'Unarchive' : 'Archive'}
          >
            <Archive size={16} />
          </motion.button>

          {/* Delete */}
          <motion.button onClick={() => onDelete(noteId)} whileHover={{ scale: 1.08, color: '#f472b6' }} whileTap={{ scale: 0.92 }}
            style={{ padding: 8, borderRadius: 9, background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}
            title="Delete note"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* ── Scrollable editing area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Title */}
        <textarea
          value={title}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="Untitled Note"
          rows={1}
          style={{
            background: 'transparent', border: 'none', outline: 'none', resize: 'none',
            color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 28, lineHeight: 1.3, width: '100%', overflow: 'hidden',
            placeholder: '#1e293b',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Tag size={12} color="#334155" />
            <input
              value={tags}
              onChange={(e) => handleTags(e.target.value)}
              placeholder="tags, comma, separated"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif',
                minWidth: 180,
              }}
            />
          </div>
          <input
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
            placeholder="Category"
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif',
              minWidth: 80,
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => handleContent(e.target.value)}
          placeholder="Start writing your thoughts… The AI is ready to help when you click AI Assist →"
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', color: '#cbd5e1', fontSize: 15, lineHeight: 1.8,
            fontFamily: 'Inter, sans-serif', width: '100%', minHeight: '60vh',
          }}
        />
      </div>
    </motion.div>
  );
}
