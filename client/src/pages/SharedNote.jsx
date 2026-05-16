import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Clock, Brain, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import CosmicBackground from '../components/ui/CosmicBackground';
import AIOrb from '../components/ui/AIOrb';

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shared/${shareId}`)
      .then((r) => setNote(r.data.note))
      .catch(() => setError('This note is not available or the link has expired.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  return (
    <div className="relative min-h-screen font-body" style={{ background: '#0B1020' }}>
      <CosmicBackground intensity={0.5} variant="subtle" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #a78bfa, #7c3aed)' }} />
          <span className="font-display font-bold text-white">Peblo</span>
        </Link>
        <Link to="/signup">
          <motion.button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
            whileHover={{ scale: 1.05 }}
          >
            Get Started <ArrowRight size={14} />
          </motion.button>
        </Link>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 rounded-xl shimmer" />
            <div className="h-4 w-1/3 rounded shimmer" />
            <div className="h-64 rounded-2xl shimmer" />
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <AIOrb size={80} className="mx-auto mb-6" />
            <h2 className="font-display font-bold text-white text-2xl mb-3">Note Not Found</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link to="/">
              <motion.button className="px-6 py-3 rounded-xl text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
                whileHover={{ scale: 1.05 }}>
                Go Home
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Shared via Peblo Neural Workspace
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
              {note.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center flex-wrap gap-4 mb-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </div>
              {note.category && <span className="text-slate-600">#{note.category}</span>}
            </div>

            {/* Tags */}
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {note.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                    <Tag size={9} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Summary */}
            {note.summary && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mb-8 p-5 rounded-2xl"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} className="text-violet-400" />
                  <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{note.summary}</p>
              </motion.div>
            )}

            {/* Divider */}
            <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
                {note.content || <span className="text-slate-600 italic">No content.</span>}
              </div>
            </div>

            {/* Action items */}
            {note.actionItems?.length > 0 && (
              <div className="mt-10 p-5 rounded-2xl"
                style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
                <h3 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">Action Items</h3>
                <ul className="space-y-2">
                  {note.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                      <div className="w-3.5 h-3.5 rounded border mt-0.5 flex-shrink-0" style={{ borderColor: 'rgba(34,211,238,0.4)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 text-center p-8 rounded-2xl"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p className="text-slate-400 text-sm mb-4">Create your own AI-powered notes with Peblo</p>
              <Link to="/signup">
                <motion.button className="px-8 py-3 rounded-xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
                  whileHover={{ scale: 1.05 }}>
                  Start for Free
                </motion.button>
              </Link>
            </div>
          </motion.article>
        )}
      </div>
    </div>
  );
}
