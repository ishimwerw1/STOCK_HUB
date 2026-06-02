import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { productCode: '', productName: '', category: '', quantityInStock: '', unitPrice: '', supplierName: '', dateReceived: '' };

export default function Products() {
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products').then(({ data }) => setProducts(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const payload = { ...form, quantityInStock: Number(form.quantityInStock), unitPrice: Number(form.unitPrice) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Product updated!' });
      } else {
        await api.post('/products', payload);
        setMessage({ type: 'success', text: 'Product added!' });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (p) => {
    setForm({
      productCode: p.productCode, productName: p.productName, category: p.category,
      quantityInStock: String(p.quantityInStock), unitPrice: String(p.unitPrice),
      supplierName: p.supplierName, dateReceived: p.dateReceived ? p.dateReceived.slice(0, 10) : '',
    });
    setEditingId(p._id);
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted!' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 md:p-8 border border-blue-100/50 shadow-lg shadow-blue-500/5 animate-slide-in">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
            {editingId ? '✏️' : '📦'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-xs text-slate-400">
              {editingId ? 'Update product details below' : 'Fill in the product information'}
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
            {[
              { name: 'productCode', placeholder: 'Product Code', type: 'text' },
              { name: 'productName', placeholder: 'Product Name', type: 'text' },
              { name: 'category', placeholder: 'Category', type: 'text' },
              { name: 'quantityInStock', placeholder: 'Quantity in Stock', type: 'number', min: 0 },
              { name: 'unitPrice', placeholder: 'Unit Price ($)', type: 'number', min: 0, step: '0.01' },
              { name: 'supplierName', placeholder: 'Supplier Name', type: 'text' },
              { name: 'dateReceived', placeholder: 'Date Received', type: 'date' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                type={field.type || 'text'}
                min={field.min}
                step={field.step}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300 shadow-sm"
                required
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <span>{editingId ? '✏️' : '➕'}</span>
              <span>{editingId ? 'Update Product' : 'Add Product'}</span>
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product Cards Grid */}
      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Product Collection</h2>
            <p className="text-sm text-slate-400">{products.length} product{products.length !== 1 ? 's' : ''} registered</p>
          </div>
          <div className="flex gap-1">
            {['all', 'low'].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{f === 'all' ? 'All' : 'Low Stock'}</span>
            ))}
          </div>
        </div>

        {loading ? <Loading text="Loading products" /> : products.length === 0 ? (
          <div className="bg-white/60 rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
            <span className="text-5xl block mb-4">📦</span>
            <p className="text-slate-400 font-medium">No products yet</p>
            <p className="text-slate-300 text-sm mt-1">Add your first product above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <div
                key={p._id}
                className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-lg">
                      📦
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{p.productName}</h3>
                      <span className="text-xs text-slate-400 font-mono">{p.productCode}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{p.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Stock</p>
                    <p className={`text-lg font-bold ${p.quantityInStock < 10 ? 'text-red-500' : 'text-slate-900'}`}>
                      {p.quantityInStock}
                      {p.quantityInStock < 10 && <span className="text-xs text-red-400 ml-1">⚠️</span>}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Price</p>
                    <p className="text-lg font-bold text-emerald-600">${p.unitPrice?.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Supplier</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{p.supplierName}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Received</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(p.dateReceived).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 border border-blue-200">
                    <span>✏️</span> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 border border-red-200">
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
