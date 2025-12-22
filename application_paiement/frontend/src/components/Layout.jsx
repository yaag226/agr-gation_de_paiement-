import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiList, FiBarChart2, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';

const Layout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: FiHome },
    { name: 'Transactions', to: '/transactions', icon: FiList },
    { name: 'Analytics', to: '/analytics', icon: FiBarChart2 },
    { name: 'Paramètres', to: '/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar fixe */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
            <h1 className="text-xl font-bold text-white">Agrégation Paiement</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200 text-2xl font-light"
            >
              ×
            </button>
          </div>

          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-3 p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Backdrop pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Contenu principal avec marge pour le sidebar fixe */}
        <div className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
            <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMenu className="w-6 h-6" />
              </button>

              <div className="flex-1 lg:flex lg:items-center lg:justify-between">
                <div className="hidden lg:block">
                  <h2 className="text-xl font-semibold text-gray-800">Plateforme d'Agrégation de Paiement</h2>
                  <p className="text-sm text-gray-500">Burkina Faso</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
