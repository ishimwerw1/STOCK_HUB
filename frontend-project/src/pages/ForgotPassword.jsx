import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage({ type: 'success', text: 'Verification code sent! Redirecting...' });
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send code' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 8 + 2}px`, height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 12 + 8}s`,
            }}
          />
        ))}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="relative w-full max-w-md mx-3 md:mx-4 animate-slide-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-4 animate-pulse-glow hover:scale-110 transition-transform duration-300">🔑</div>
            <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-slate-400 mt-1 text-sm">Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 outline-none transition-all duration-300 hover:border-slate-400"
                placeholder="Enter your registered email" required />
            </div>
            {message.text && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium animate-pop-in flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                <span>{message.type === 'success' ? '✅' : '❌'}</span>
                <span>{message.text}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg shadow-amber-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span>Sending...</span>
                </span>
              ) : '📧 Send Code'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
