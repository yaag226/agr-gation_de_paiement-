import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { formatCurrency } from '../utils/currencyFormatter';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, providersRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getProviders()
      ]);

      setStats(statsRes.data.data);
      setProviders(providersRes.data.data.providers);
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Analyse de vos performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card hover:scale-105 transition-transform duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Revenus Totaux</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary-600 break-words">
            {formatCurrency(stats?.lifetime?.totalRevenue || 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {stats?.lifetime?.totalTransactions || 0} transactions
          </p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Ce mois</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 break-words">
            {formatCurrency(stats?.thisMonth?.totalRevenue || 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {stats?.thisMonth?.transactionCount || 0} transactions
          </p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-200 md:col-span-2 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Aujourd'hui</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 break-words">
            {formatCurrency(stats?.today?.totalRevenue || 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {stats?.today?.transactionCount || 0} transactions
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Performance par Provider</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenus</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant moyen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider._id}>
                  <td className="px-4 py-3 text-sm font-medium capitalize">{provider._id}</td>
                  <td className="px-4 py-3 text-sm">{provider.totalTransactions}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(provider.totalRevenue)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(provider.avgTransactionAmount)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(provider.totalCommission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
