import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

const cards = [
  {
    label: 'Total Products', key: 'products', icon: '📦',
    gradient: 'from-blue-500 to-blue-600', lightBg: 'from-blue-50 to-blue-100/50',
    iconBg: 'bg-blue-500/10',
  },
  {
    label: 'Total Warehouses', key: 'warehouses', icon: '🏭',
    gradient: 'from-emerald-500 to-emerald-600', lightBg: 'from-emerald-50 to-emerald-100/50',
    iconBg: 'bg-emerald-500/10',
  },
  {
    label: 'Total Transactions', key: 'transactions', icon: '🔄',
    gradient: 'from-purple-500 to-purple-600', lightBg: 'from-purple-50 to-purple-100/50',
    iconBg: 'bg-purple-500/10',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, wareRes, txnRes] = await Promise.all([
          api.get('/products'),
          api.get('/warehouses'),
          api.get('/transactions'),
        ]);
        setStats({
          products: prodRes.data.length,
          warehouses: wareRes.data.length,
          transactions: txnRes.data.length,
        });
      } catch (err) {}
      setTimeout(() => setLoading(false), 400);
    };
    fetchStats();
  }, []);

  if (loading) return <Loading text="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Welcome back, {username}! 👋</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">Here's an overview of your inventory system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => {
          const value = stats?.[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className="relative group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100`} />
              <div className={`relative bg-white bg-gradient-to-br ${card.lightBg} rounded-2xl p-5 md:p-6 border border-slate-200/60 hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-xl group-hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 group-hover:text-white/80 transition-colors duration-500">{card.label}</p>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 group-hover:text-white transition-colors duration-500 mt-2 animate-count-up">
                      {value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${card.iconBg} group-hover:bg-white/20 rounded-xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-slate-400 group-hover:text-white/60 transition-colors duration-500">
                  <span>Real-time data</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-slate-200/60 shadow-sm animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Quick Actions</h2>
        <p className="text-sm text-slate-500 mb-4">Navigate to manage your inventory</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', href: '/products', icon: '📦', color: 'blue' },
            { label: 'Add Warehouse', href: '/warehouses', icon: '🏭', color: 'emerald' },
            { label: 'New Transaction', href: '/transactions', icon: '🔄', color: 'purple' },
            { label: 'View Reports', href: '/reports', icon: '📈', color: 'amber' },
          ].map((action, i) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group animate-slide-in"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            >
              <span className="text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">{action.icon}</span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
