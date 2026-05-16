import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, FileText, Archive, Brain, Tag, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import useNotesStore from '../store/notesStore';
import CosmicBackground from '../components/ui/CosmicBackground';
import AIOrb from '../components/ui/AIOrb';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchStats } = useNotesStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Notes',    value: stats.total,   icon: FileText, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
    { label: 'Archived',       value: stats.archived, icon: Archive,  color: '#22d3ee', bg: 'rgba(34,211,238,0.10)' },
    { label: 'AI Analyzed',    value: stats.aiUsed,  icon: Brain,    color: '#f472b6', bg: 'rgba(244,114,182,0.10)' },
    { label: 'Unique Tags',    value: stats.topTags?.length || 0, icon: Tag, color: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
  ] : [];

  const maxActivity = Math.max(...(stats?.weeklyActivity?.map((d) => d.count) || [1]), 1);

  return (
    <div className="relative min-h-screen font-body" style={{ background: '#0B1020' }}>
      <CosmicBackground intensity={0.45} variant="subtle" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/workspace')}
            className="p-2 rounded-xl text-slate-500 hover:text-white transition-colors glass">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <AIOrb size={44} />
            <div>
              <h1 className="font-display font-bold text-white text-2xl">Neural Dashboard</h1>
              <p className="text-slate-500 text-sm">Your thought universe at a glance</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => (
                <motion.div key={card.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3, boxShadow: `0 12px 40px ${card.bg}` }}
                  className="p-5 rounded-2xl" style={{ background: card.bg, border: `1px solid ${card.color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <card.icon size={18} style={{ color: card.color }} />
                    <div className="text-3xl font-display font-bold text-white">{card.value}</div>
                  </div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider">{card.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Weekly Activity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
                  <BarChart2 size={16} className="text-violet-400" /> Weekly Activity
                </h3>
                <div className="flex items-end gap-2 h-28">
                  {DAYS.map((day, i) => {
                    const found = stats?.weeklyActivity?.find((d) => d._id === i + 1);
                    const count = found?.count || 0;
                    const pct = (count / maxActivity) * 100;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          className="w-full rounded-t-lg"
                          style={{ background: pct > 0 ? 'linear-gradient(to top, #7c3aed, #22d3ee)' : 'rgba(255,255,255,0.05)' }}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(pct, 4)}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                        />
                        <span className="text-slate-600 text-xs">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Top Tags */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
                  <Tag size={16} className="text-cyan-400" /> Most Used Tags
                </h3>
                {stats?.topTags?.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.topTags.slice(0, 6).map((tag, i) => (
                      <motion.div key={tag._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}
                        className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs w-20 truncate">#{tag._id}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #7c3aed, #22d3ee)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(tag.count / (stats.topTags[0]?.count || 1)) * 100}%` }}
                            transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-slate-600 text-xs w-6 text-right">{tag.count}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">No tags yet. Add tags to your notes!</p>
                )}
              </motion.div>
            </div>

            {/* Recent Notes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
                <Clock size={16} className="text-pink-400" /> Recently Edited
              </h3>
              {stats?.recentNotes?.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentNotes.map((note, i) => (
                    <motion.div key={note._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.05 }}
                      onClick={() => navigate('/workspace')}
                      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }} />
                        <span className="text-slate-300 text-sm">{note.title}</span>
                      </div>
                      <span className="text-slate-600 text-xs">{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">No notes yet. Start writing!</p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
