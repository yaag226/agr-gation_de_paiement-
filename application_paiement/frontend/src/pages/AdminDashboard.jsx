import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiDollarSign, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalCustomers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Charger les utilisateurs et marchands
      const [usersRes, merchantsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/merchants')
      ]);

      const allUsers = usersRes.data.data || [];
      const allMerchants = merchantsRes.data.data || [];

      setUsers(allUsers);
      setMerchants(allMerchants);

      // Calculer les statistiques
      const totalMerchants = allUsers.filter(u => u.role === 'merchant').length;
      const totalCustomers = allUsers.filter(u => u.role === 'customer').length;
      const activeUsers = allUsers.filter(u => u.isActive).length;

      setStats({
        totalUsers: allUsers.length,
        totalMerchants,
        totalCustomers,
        activeUsers,
        totalTransactions: 0, // À implémenter
        totalRevenue: 0 // À implémenter
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 bg-${color}-100 rounded-lg flex-shrink-0 ml-2`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrateur</h1>
        <p className="text-gray-600">Bienvenue, {user?.name}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          icon={FiUsers}
          color="primary"
        />
        <StatCard
          title="Marchands"
          value={stats.totalMerchants}
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title="Clients"
          value={stats.totalCustomers}
          icon={FiActivity}
          color="blue"
        />
        <StatCard
          title="Utilisateurs Actifs"
          value={stats.activeUsers}
          icon={FiCheckCircle}
          color="purple"
        />
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'merchants'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Marchands ({merchants.length})
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des utilisateurs</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Administrateurs</span>
                <span className="font-semibold">{users.filter(u => u.role === 'admin').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Marchands</span>
                <span className="font-semibold">{stats.totalMerchants}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Clients</span>
                <span className="font-semibold">{stats.totalCustomers}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des utilisateurs</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Actifs</span>
                <span className="font-semibold text-green-600">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inactifs</span>
                <span className="font-semibold text-red-600">{stats.totalUsers - stats.activeUsers}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des utilisateurs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        u.role === 'admin' ? 'badge-danger' :
                        u.role === 'merchant' ? 'badge-primary' :
                        'badge-info'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.isActive ? (
                        <span className="flex items-center text-green-600">
                          <FiCheckCircle className="mr-1" /> Actif
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <FiXCircle className="mr-1" /> Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleUserStatus(u._id, u.isActive)}
                        className={`btn ${u.isActive ? 'btn-danger' : 'btn-success'} btn-sm`}
                      >
                        {u.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'merchants' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des marchands</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {merchants.map((m) => (
                  <tr key={m._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{m.businessName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{m.description || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {m.balance?.toLocaleString() || 0} XOF
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${m.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {m.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
