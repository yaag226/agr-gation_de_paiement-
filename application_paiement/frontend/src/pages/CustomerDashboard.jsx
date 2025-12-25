import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiCreditCard, FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { formatCurrency } from '../utils/currencyFormatter';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Charger les transactions du client via l'API publique
      const response = await axios.get('http://localhost:5000/api/payment/historique', {
        params: {
          email: user?.email,
          limit: 50
        }
      });

      const txs = response.data.data.transactions || [];
      setTransactions(txs);

      // Calculer les statistiques
      const completed = txs.filter(t => t.status === 'completed').length;
      const pending = txs.filter(t => t.status === 'pending' || t.status === 'processing').length;
      const failed = txs.filter(t => t.status === 'failed').length;
      const totalAmount = txs
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        total: txs.length,
        completed,
        pending,
        failed,
        totalAmount
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: 'badge-success', label: 'Réussi', icon: FiCheckCircle },
      failed: { class: 'badge-danger', label: 'Échoué', icon: FiXCircle },
      pending: { class: 'badge-warning', label: 'En attente', icon: FiClock },
      processing: { class: 'badge-info', label: 'En cours', icon: FiClock }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getProviderName = (provider) => {
    const names = {
      orange_money: 'Orange Money',
      mtn_money: 'MTN Mobile Money',
      moov_money: 'Moov Money',
      coris_bank: 'Coris Bank',
      ecobank: 'Ecobank',
      wave: 'Wave',
      stripe: 'Stripe',
      paypal: 'PayPal'
    };
    return names[provider] || provider;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Dashboard</h1>
        <p className="text-gray-600">Bienvenue, {user?.name}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats.total}
          icon={FiCreditCard}
          color="primary"
        />
        <StatCard
          title="Réussies"
          value={stats.completed}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="En attente"
          value={stats.pending}
          icon={FiClock}
          color="blue"
        />
        <StatCard
          title="Montant Total"
          value={formatCurrency(stats.totalAmount)}
          icon={FiDollarSign}
          color="purple"
        />
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transactions réussies</span>
              <span className="font-semibold text-green-600">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En attente</span>
              <span className="font-semibold text-blue-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Échouées</span>
              <span className="font-semibold text-red-600">{stats.failed}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Téléphone</span>
              <span className="font-medium">{user?.phone || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Type de compte</span>
              <span className="badge badge-info">Client</span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mes transactions récentes
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore effectué de transaction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {transaction.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getProviderName(transaction.provider)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {transaction.description || 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/client/payer"
            className="flex items-center justify-center gap-2 btn btn-primary"
          >
            <FiCreditCard />
            Effectuer un paiement
          </a>
          <button
            onClick={loadTransactions}
            className="flex items-center justify-center gap-2 btn btn-secondary"
          >
            <FiClock />
            Actualiser les transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
