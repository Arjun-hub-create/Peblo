import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import CosmicBackground from '../components/ui/CosmicBackground';
import AIOrb from '../components/ui/AIOrb';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Welcome to Peblo Neural Workspace!');
      navigate('/workspace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name',     label: 'Full Name',  type: 'text',     icon: User,  placeholder: 'Your name' },
    { key: 'email',    label: 'Email',       type: 'email',    icon: Mail,  placeholder: 'you@example.com' },
    { key: 'password', label: 'Password',    type: showPw ? 'text' : 'password', icon: Lock, placeholder: '6+ characters' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 font-body" style={{ background: '#0B1020' }}>
      <CosmicBackground intensity={0.65} variant="subtle" />
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-10" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="flex flex-col items-center mb-8">
            <AIOrb size={70} isGenerating={loading} />
            <h1 className="font-display font-bold text-white text-2xl mt-4">Create Your Universe</h1>
            <p className="text-slate-400 text-sm mt-1">Join the neural workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{f.label}</label>
                <div className="relative">
                  <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  {f.key === 'password' && (
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                boxShadow: '0 0 30px rgba(124,58,237,0.3)',
              }}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 50px rgba(124,58,237,0.5)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <motion.div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
              ) : (
                <><span>Enter the Universe</span><ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
