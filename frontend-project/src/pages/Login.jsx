import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.post('/auth/register', { username, email, password });
        setIsRegister(false);
        setError('Account created! Please login.');
        setLoading(false);
        return;
      }
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 8 + 2}px`, height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 12 + 8}s`,
            }}
          />
        ))}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md mx-3 md:mx-4 animate-slide-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 mb-4 animate-pulse-glow hover:scale-110 transition-transform duration-300">📦</div>
            <h1 className="text-2xl font-bold text-white">StockHub Ltd</h1>
            <p className="text-slate-400 mt-1 text-sm">Stock Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 outline-none transition-all duration-300 hover:border-slate-400"
                placeholder="Enter your username" required />
            </div>
            {isRegister && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 outline-none transition-all duration-300 hover:border-slate-400"
                  placeholder="Enter your email" required />
              </div>
            )}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:bg-white/[0.08] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 outline-none transition-all duration-300 pr-11 hover:border-slate-400"
                  placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-all duration-200 text-lg hover:scale-110"
                >{showPwd ? '🙈' : '👁️'}</button>
              </div>
            </div>
            {error && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium animate-pop-in flex items-center gap-2 ${
                error.includes('created') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                <span>{error.includes('created') ? '✅' : '❌'}</span>
                <span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="ml-1">{isRegister ? 'Registering...' : 'Logging in...'}</span>
                </span>
              ) : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
            {!isRegister && (
              <p className="text-center animate-fade-in">
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline">Forgot password?</Link>
              </p>
            )}
          </form>

          <p className="text-center mt-6 text-sm text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 hover:underline">
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
        <p className="text-center mt-4 text-xs text-slate-500 animate-fade-in">© 2026 StockHub Ltd. All rights reserved.</p>
      </div>
    </div>
  );
}
