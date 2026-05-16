import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Archive, Share2, Brain, Tag, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const colorMap = {
  default: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', glow: 'rgba(124,58,237,0.2)' },
  violet:  { bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.25)',  glow: 'rgba(124,58,237,0.35)' },
  cyan:    { bg: 'rgba(34,211,238,0.06)',   border: 'rgba(34,211,238,0.2)',   glow: 'rgba(34,211,238,0.3)' },
  pink:    { bg: 'rgba(244,114,182,0.06)',  border: 'rgba(244,114,182,0.2)',  glow: 'rgba(244,114,182,0.3)' },
};

export default function NoteCard({ note, isActive, onClick, onDelete, onArchive, onShare }) {
  const colors = colorMap[note.color] || colorMap.default;
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleAction = (e, fn) => {
    e.stopPropagation();
    fn();
  };

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -4, y: x * 4 });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="note-card relative p-4 rounded-2xl cursor-pointer group overflow-hidden"
      style={{
        background: isActive ? 'rgba(124,58,237,0.14)' : colors.bg,
        border: `1px solid ${isActive ? 'rgba(124,58,237,0.55)' : colors.border}`,
        boxShadow: isActive ? `0 0 24px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        willChange: 'transform',
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 16px 48px ${colors.glow}, 0 0 0 1px rgba(167,139,250,0.15)`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, transparent 50%, rgba(34,211,238,0.06) 100%)',
        }}
      />

      {isActive && (
        <motion.div
          layoutId="note-active-edge"
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
          style={{ background: 'linear-gradient(to bottom, #7c3aed, #22d3ee)' }}
        />
      )}

      {note.summary && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
          style={{ background: 'rgba(124,58,237,0.22)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.35)' }}
        >
          <Brain size={10} /> AI
        </motion.div>
      )}

      <h3 className="font-display font-semibold text-white text-sm mb-1.5 pr-12 truncate relative z-[1]">
        {note.title}
      </h3>

      {note.content && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3 relative z-[1]">
          {note.content.replace(/[#*`]/g, '').slice(0, 120)}
        </p>
      )}

      {note.tags?.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-1 mb-3 relative z-[1]"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {note.tags.slice(0, 3).map((tag) => (
            <motion.span
              key={tag}
              variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
            >
              <Tag size={8} /> {tag}
            </motion.span>
          ))}
          {note.tags.length > 3 && <span className="text-slate-600 text-xs">+{note.tags.length - 3}</span>}
        </motion.div>
      )}

      <motion.div
        className="flex items-center justify-between relative z-[1]"
        initial={{ opacity: 0.85 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div className="flex items-center gap-1 text-slate-600 text-xs">
          <Clock size={10} /> {timeAgo}
        </motion.div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={(e) => handleAction(e, onShare)} title="Share"
            className="p-1.5 rounded-lg hover:bg-violet-500/20 text-slate-500 hover:text-violet-400 transition-all">
            <Share2 size={12} />
          </button>
          <button onClick={(e) => handleAction(e, onArchive)} title="Archive"
            className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-400 transition-all">
            <Archive size={12} />
          </button>
          <button onClick={(e) => handleAction(e, onDelete)} title="Delete"
            className="p-1.5 rounded-lg hover:bg-pink-500/20 text-slate-500 hover:text-pink-400 transition-all">
            <Trash2 size={12} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
