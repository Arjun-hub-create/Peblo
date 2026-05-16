import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Archive, BarChart2, LogOut, Home, X, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useNotesStore from '../../store/notesStore';
import { staggerContainer, staggerItem } from '../../utils/motionVariants';

export default function Sidebar({ onNewNote, tags = [] }) {
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag, showArchived, setShowArchived, fetchNotes } = useNotesStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 220,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10,13,30,0.98)',
        borderRight: '1px solid rgba(124,58,237,0.15)',
        backdropFilter: 'blur(30px)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.div
          animate={{ boxShadow: ['0 0 10px rgba(124,58,237,0.25)', '0 0 18px rgba(124,58,237,0.45)', '0 0 10px rgba(124,58,237,0.25)'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)', flexShrink: 0 }}
        />
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'white', fontSize: 15 }}>Peblo</div>
          <div style={{ color: '#475569', fontSize: 10, letterSpacing: 1 }}>NEURAL WORKSPACE</div>
        </div>
      </div>

      {/* New Note Button */}
      <div style={{ padding: '14px 12px 8px' }}>
        <motion.button
          onClick={onNewNote}
          className="animate-cta-glow"
          whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.7), rgba(34,211,238,0.5))',
            border: '1px solid rgba(124,58,237,0.5)', color: 'white',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
          }}
        >
          <Plus size={15} /> New Note
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); fetchNotes(); }}
            placeholder="Search notes…"
            className="cosmic-input"
            style={{
              width: '100%', paddingLeft: 30, paddingRight: 28, paddingTop: 9, paddingBottom: 9,
              borderRadius: 10, fontSize: 12, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'Inter, sans-serif', transition: 'border-color 0.25s, box-shadow 0.25s',
            }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); fetchNotes(); }}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <div style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { icon: Home, label: 'All Notes', action: () => { setShowArchived(false); setSelectedTag(''); fetchNotes(); }, active: !showArchived },
          { icon: Archive, label: 'Archived', action: () => { setShowArchived(true); setSelectedTag(''); fetchNotes(); }, active: showArchived },
          { icon: BarChart2, label: 'Dashboard', action: () => navigate('/dashboard'), active: false },
        ].map((item) => (
          <motion.button
            key={item.label}
            onClick={item.action}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              background: 'transparent', border: 'none',
              color: item.active ? '#a78bfa' : '#64748b',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: item.active ? 500 : 400,
            }}
          >
            {item.active && (
              <motion.div
                layoutId="sidebar-active"
                style={{
                  position: 'absolute', inset: 0, borderRadius: 10,
                  background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.28)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <item.icon size={14} style={{ position: 'relative', zIndex: 1 }} />
            <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ padding: '12px 8px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', marginBottom: 6 }}>
            <Tag size={11} style={{ color: '#334155' }} />
            <span style={{ color: '#334155', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Inter, sans-serif' }}>Tags</span>
          </div>
          <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tags.map((tag, i) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ x: 3, background: 'rgba(34,211,238,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedTag(selectedTag === tag ? '' : tag); fetchNotes(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: selectedTag === tag ? 'rgba(34,211,238,0.1)' : 'transparent',
                  border: 'none', color: selectedTag === tag ? '#22d3ee' : '#475569',
                  fontFamily: 'Inter, sans-serif', fontSize: 12,
                }}
              >
                <motion.span
                  animate={selectedTag === tag ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: selectedTag === tag ? '#22d3ee' : '#334155', flexShrink: 0 }}
                />
                #{tag}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px', marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ color: '#334155', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          whileHover={{ background: 'rgba(244,114,182,0.1)', color: '#f472b6' }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
            background: 'transparent', border: 'none', color: '#475569',
            fontFamily: 'Inter, sans-serif', fontSize: 12, transition: 'all 0.2s',
          }}
        >
          <LogOut size={13} /> Sign Out
        </motion.button>
      </div>
    </motion.aside>
  );
}
