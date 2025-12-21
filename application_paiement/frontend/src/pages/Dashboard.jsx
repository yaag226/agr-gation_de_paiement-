import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { FiDollarSign, FiTrendingUp, FiCreditCard, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyFormatter';

const StatCard = ({ title, value, icon: Icon, change, color = 'primary' }) => (
  <div className="card hover:scale-105 transition-transform duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
        {change && (
          <p className={`text-xs sm:text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
      <div className={`p-2 sm:p-3 bg-${color}-100 rounded-lg flex-shrink-0 ml-2`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isMerchant } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isMerchant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenue, {user?.name}!
        </h2>
        <p className="text-gray-600">
          Cette plateforme est réservée aux marchands. Veuillez créer un compte marchand pour accéder au tableau de bord.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Solde Total"
          value={formatCurrency(dashboard?.lifetime?.balance || 0)}
          icon={FiDollarSign}
          color="primary"
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrency(dashboard?.thisMonth?.totalRevenue || 0)}
          icon={FiTrendingUp}
          color="green"
        />
        <StatCard
          title="Transactions aujourd'hui"
          value={dashboard?.today?.transactionCount || 0}
          icon={FiCreditCard}
          color="blue"
        />
        <StatCard
          title="Transactions totales"
          value={dashboard?.lifetime?.totalTransactions || 0}
          icon={FiActivity}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'aujourd'hui</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transactions</span>
              <span className="font-semibold">{dashboard?.today?.transactionCount || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenus</span>
              <span className="font-semibold">{formatCurrency(dashboard?.today?.totalRevenue || 0)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques du mois</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transactions</span>
              <span className="font-semibold">{dashboard?.thisMonth?.transactionCount || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenus</span>
              <span className="font-semibold">{formatCurrency(dashboard?.thisMonth?.totalRevenue || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Transactions récentes</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboard?.recentTransactions?.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-4 py-3 text-sm font-mono">{transaction.transactionId}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="capitalize">{transaction.provider}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge ${
                      transaction.status === 'completed' ? 'badge-success' :
                      transaction.status === 'pending' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
