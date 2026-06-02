import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products Management',
  '/warehouses': 'Warehouses Management',
  '/transactions': 'Stock Transactions',
  '/reports': 'Inventory Reports',
};

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'StockHub Ltd';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between no-print sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all duration-200 hover:scale-105"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-400">Stock Management System</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-sm hover:shadow-md transition-all duration-300">
          <span className="text-base animate-pop-in">👤</span>
          <span className="font-medium text-slate-700">{localStorage.getItem('username') || 'User'}</span>
        </div>
      </div>
    </header>
  );
}

function PrivateRoute({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/warehouses" element={<PrivateRoute><Warehouses /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
