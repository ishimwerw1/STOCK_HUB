import { useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

export default function Reports() {
  const [period, setPeriod] = useState('daily');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (p) => {
    setPeriod(p);
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/${p}`);
      setReport(data);
    } catch (err) {
      setReport(null);
    }
    setTimeout(() => setLoading(false), 300);
  };

  const periods = [
    { key: 'daily', label: 'Daily', icon: '📅', desc: 'Today' },
    { key: 'weekly', label: 'Weekly', icon: '📆', desc: 'This Week' },
    { key: 'monthly', label: 'Monthly', icon: '📊', desc: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap items-center animate-slide-in">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => fetchReport(p.key)}
            className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2.5 ${
              period === p.key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            <span className={period === p.key ? 'animate-pop-in' : ''}>{p.icon}</span>
            <div className="text-left">
              <p className="font-semibold">{p.label}</p>
              <p className={`text-xs ${period === p.key ? 'text-blue-200' : 'text-slate-400'}`}>{p.desc}</p>
            </div>
          </button>
        ))}
        {report && (
          <button
            onClick={() => window.print()}
            className="px-5 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 ml-auto active:scale-95"
          >
            <span>🖨️</span>
            <span>Print Report</span>
          </button>
        )}
      </div>

      {loading && <Loading text={`Loading ${period} report`} />}

      {report && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Available Stock', value: report.availableStock, icon: '📦', color: 'blue' },
              { label: 'Stock In', value: `+${report.stockIn}`, icon: '📥', color: 'emerald' },
              { label: 'Stock Out', value: `-${report.stockOut}`, icon: '📤', color: 'red' },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scale-in group" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${
                      stat.color === 'blue' ? 'text-blue-600' : stat.color === 'emerald' ? 'text-emerald-600' : 'text-red-600'
                    }`}>{stat.value}</p>
                  </div>
                  <span className="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.15s' }}>
            <div className="mb-3">
              <h2 className="text-lg font-bold text-slate-900">Products Stock Levels</h2>
              <p className="text-sm text-slate-400">{report.products?.length || 0} products</p>
            </div>
            {report.products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {report.products.map((p, i) => (
                  <div key={p._id} className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 animate-slide-in flex items-center gap-3 group" style={{ animationDelay: `${i * 0.03}s` }}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{p.productName}</p>
                      <p className="text-xs text-slate-400 font-mono">{p.productCode}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-slate-900">{p.quantityInStock}</p>
                      <p className="text-xs text-slate-400">{p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/60 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400">No products</p>
              </div>
            )}
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="mb-3">
              <h2 className="text-lg font-bold text-slate-900">{period.charAt(0).toUpperCase() + period.slice(1)} Transactions</h2>
              <p className="text-sm text-slate-400">{report.transactions?.length || 0} transactions</p>
            </div>
            {report.transactions?.length > 0 ? (
              <div className="space-y-2">
                {report.transactions.map((t, i) => {
                  const isIn = t.transactionType === 'stock in';
                  return (
                    <div key={t._id} className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-slide-in flex items-center gap-3 group" style={{ animationDelay: `${i * 0.03}s` }}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${isIn ? 'bg-emerald-100' : 'bg-red-100'} group-hover:scale-110 transition-transform`}>
                        {isIn ? '📥' : '📤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-slate-400">Product</p>
                            <p className="font-medium text-slate-900 truncate">{t.product?.productName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Warehouse</p>
                            <p className="text-slate-700">{t.warehouse?.warehouseName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Quantity</p>
                            <p className="font-semibold text-slate-900">{t.quantityMoved}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Date</p>
                            <p className="text-slate-600">{new Date(t.transactionDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                        isIn ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>{t.transactionType}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/60 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400">No transactions this {period}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
