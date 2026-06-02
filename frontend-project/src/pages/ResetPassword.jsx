import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: location.state?.email || '', code: '', newPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await api.post('/auth/reset-password', form);
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting...' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Reset failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4 animate-slide-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 mb-4 animate-pulse-glow">🔐</div>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-slate-400 mt-1 text-sm">Enter the code from your email and set a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 outline-none transition-all duration-300"
                placeholder="Your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Verification Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 outline-none transition-all duration-300 text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000" maxLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 outline-none transition-all duration-300 pr-11"
                  placeholder="New password" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors text-lg"
                >{showPwd ? '🙈' : '👁️'}</button>
              </div>
            </div>
            {message.text && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                <span>{message.type === 'success' ? '✅' : '❌'}</span>
                <span>{message.text}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span>Resetting...</span>
                </span>
              ) : '🔐 Reset Password'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">← Resend Code</Link>
            {' | '}
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
