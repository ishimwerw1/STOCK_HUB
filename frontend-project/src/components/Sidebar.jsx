import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/warehouses', label: 'Warehouses', icon: '🏭' },
  { to: '/transactions', label: 'Transactions', icon: '🔄' },
  { to: '/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-lg animate-pulse-glow shrink-0">
            📦
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">StockHub Ltd</h1>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            onClick={() => { if (onClose) onClose(); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-lg transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700/50 space-y-2">
        <div className="px-4 py-3 rounded-xl bg-white/5">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">{localStorage.getItem('username') || 'User'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-300 w-full group"
        >
          <span className="group-hover:scale-110 transition-transform">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex-col shadow-2xl sidebar shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl lg:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0 animate-slide-in-left' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
