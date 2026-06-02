import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { warehouseCode: '', warehouseName: '', warehouseLocation: '' };

export default function Warehouses() {
  const [form, setForm] = useState(emptyForm);
  const [warehouses, setWarehouses] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = () => {
    api.get('/warehouses').then(({ data }) => setWarehouses(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingId) {
        await api.put(`/warehouses/${editingId}`, form);
        setMessage({ type: 'success', text: 'Warehouse updated!' });
      } else {
        await api.post('/warehouses', form);
        setMessage({ type: 'success', text: 'Warehouse added!' });
      }
      resetForm();
      fetchWarehouses();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (w) => {
    setForm({ warehouseCode: w.warehouseCode, warehouseName: w.warehouseName, warehouseLocation: w.warehouseLocation });
    setEditingId(w._id);
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this warehouse?')) return;
    try {
      await api.delete(`/warehouses/${id}`);
      setMessage({ type: 'success', text: 'Warehouse deleted!' });
      fetchWarehouses();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl p-6 md:p-8 border border-emerald-100/50 shadow-lg shadow-emerald-500/5 animate-slide-in">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {editingId ? '✏️' : '🏭'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
            <p className="text-xs text-slate-400">
              {editingId ? 'Update warehouse details' : 'Register a new storage facility'}
            </p>
          </div>
        </div>
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input name="warehouseCode" value={form.warehouseCode} onChange={handleChange} placeholder="Warehouse Code" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300 shadow-sm" required />
            <input name="warehouseName" value={form.warehouseName} onChange={handleChange} placeholder="Warehouse Name" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300 shadow-sm" required />
            <input name="warehouseLocation" value={form.warehouseLocation} onChange={handleChange} placeholder="Warehouse Location" className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300 shadow-sm" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <span>{editingId ? '✏️' : '➕'}</span>
              <span>{editingId ? 'Update Warehouse' : 'Add Warehouse'}</span>
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Storage Facilities</h2>
            <p className="text-sm text-slate-400">{warehouses.length} warehouse{warehouses.length !== 1 ? 's' : ''} registered</p>
          </div>
        </div>

        {loading ? <Loading text="Loading warehouses" /> : warehouses.length === 0 ? (
          <div className="bg-white/60 rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
            <span className="text-5xl block mb-4">🏭</span>
            <p className="text-slate-400 font-medium">No warehouses yet</p>
            <p className="text-slate-300 text-sm mt-1">Add your first warehouse above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {warehouses.map((w, i) => (
              <div
                key={w._id}
                className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-xl">
                      🏭
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{w.warehouseName}</h3>
                      <span className="text-xs text-slate-400 font-mono">{w.warehouseCode}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>📍</span>
                    <span className="text-sm font-medium">{w.warehouseLocation}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(w)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 border border-blue-200">
                    <span>✏️</span> Edit
                  </button>
                  <button onClick={() => handleDelete(w._id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 border border-red-200">
                    <span>🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
