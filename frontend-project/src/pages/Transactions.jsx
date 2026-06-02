import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { product: '', warehouse: '', transactionDate: '', quantityMoved: '', transactionType: 'stock in' };

export default function Transactions() {
  const [form, setForm] = useState(emptyForm);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [txnRes, prodRes, wareRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/products'),
        api.get('/warehouses'),
      ]);
      setTransactions(txnRes.data);
      setProducts(prodRes.data);
      setWarehouses(wareRes.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, { ...form, quantityMoved: Number(form.quantityMoved) });
        setMessage({ type: 'success', text: 'Transaction updated!' });
        setEditingId(null);
      } else {
        await api.post('/transactions', { ...form, quantityMoved: Number(form.quantityMoved) });
        setMessage({ type: 'success', text: 'Transaction added!' });
      }
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (txn) => {
    setForm({
      product: txn.product?._id || '',
      warehouse: txn.warehouse?._id || '',
      transactionDate: txn.transactionDate ? new Date(txn.transactionDate).toISOString().split('T')[0] : '',
      quantityMoved: txn.quantityMoved,
      transactionType: txn.transactionType,
    });
    setEditingId(txn._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      setMessage({ type: 'success', text: 'Transaction deleted!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    }
  };

  if (loading) return <Loading text="Loading transactions" />;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-5 md:p-8 border border-purple-100/50 shadow-lg shadow-purple-500/5 animate-slide-in">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${editingId ? 'bg-amber-100 text-amber-600 animate-shake' : 'bg-purple-100 text-purple-600'}`}>
            {editingId ? '✏️' : '🔄'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
            <p className="text-xs text-slate-400">{editingId ? 'Update transaction details' : 'Record stock movement'}</p>
          </div>
        </div>
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium animate-slide-in flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <select name="product" value={form.product} onChange={handleChange} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-300 hover:shadow-sm shadow-sm" required>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.productName} ({p.productCode})</option>
              ))}
            </select>
            <select name="warehouse" value={form.warehouse} onChange={handleChange} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-300 hover:shadow-sm shadow-sm" required>
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w._id} value={w._id}>{w.warehouseName}</option>
              ))}
            </select>
            <input name="transactionDate" type="date" value={form.transactionDate} onChange={handleChange} className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-300 hover:shadow-sm shadow-sm" required />
            <input name="quantityMoved" type="number" min="1" value={form.quantityMoved} onChange={handleChange} placeholder="Quantity" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-300 hover:shadow-sm shadow-sm" required />
            <div className="flex gap-2">
              {['stock in', 'stock out'].map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 font-medium text-sm ${
                    form.transactionType === type
                      ? type === 'stock in' ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-red-400 bg-red-50 text-red-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <input type="radio" name="transactionType" value={type} checked={form.transactionType === type} onChange={handleChange} className="hidden" />
                  <span className={form.transactionType === type ? 'animate-pop-in' : ''}>{type === 'stock in' ? '📥' : '📤'}</span>
                  <span>{type === 'stock in' ? 'Stock In' : 'Stock Out'}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-[0.98]">
              <span>{editingId ? '✏️' : '➕'}</span>
              <span>{editingId ? 'Update' : 'Record Transaction'}</span>
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="w-full sm:px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
          <p className="text-sm text-slate-400">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded</p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/60 rounded-2xl p-12 md:p-16 text-center border-2 border-dashed border-slate-200">
            <span className="text-5xl block mb-4">🔄</span>
            <p className="text-slate-400 font-medium">No transactions yet</p>
            <p className="text-slate-300 text-sm mt-1">Record your first stock movement above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t, i) => {
              const isIn = t.transactionType === 'stock in';
              return (
                <div
                  key={t._id}
                  className="group bg-white rounded-2xl p-4 md:p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-slide-in flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isIn ? 'bg-emerald-100' : 'bg-red-100'} group-hover:scale-110 transition-transform`}>
                      {isIn ? '📥' : '📤'}
                    </div>
                    <div className="w-0.5 h-full min-h-[2rem] bg-slate-200 group-last:hidden hidden sm:block" />
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{t.product?.productName || 'N/A'}</h3>
                      <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isIn ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>{t.transactionType}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">🏭 {t.warehouse?.warehouseName || 'N/A'}</span>
                      <span className="flex items-center gap-1">📅 {new Date(t.transactionDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">Qty: {t.quantityMoved}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shrink-0 self-end sm:self-auto">
                    <button onClick={() => handleEdit(t)} className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-sm hover:shadow-md active:scale-90" title="Edit">✏️</button>
                    <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all text-sm hover:shadow-md active:scale-90" title="Delete">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
