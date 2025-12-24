import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientDashboard = () => {
  const [phone, setPhone] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    totalAmount: 0
  });

  const fetchTransactions = async () => {
    if (!phone) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/payment/historique', {
        params: { phone, limit: 50 }
      });

      const txs = response.data.data.transactions;
      setTransactions(txs);

      // Calculer les statistiques
      const completed = txs.filter((t) => t.status === 'completed').length;
      const failed = txs.filter((t) => t.status === 'failed').length;
      const totalAmount = txs
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        total: txs.length,
        completed,
        failed,
        totalAmount
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      completed: '✅ Réussi',
      failed: '❌ Échoué',
      pending: '⏳ En attente',
      processing: '🔄 En cours'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getProviderIcon = (provider) => {
    const icons = {
      orange_money: '🟠',
      mtn_money: '🟡',
      wave: '🌊',
      stripe: '💳',
      paypal: '💙'
    };
    return icons[provider] || '💰';
  };

  const getProviderName = (provider) => {
    const names = {
      orange_money: 'Orange Money',
      mtn_money: 'MTN Mobile Money',
      wave: 'Wave',
      stripe: 'Stripe',
      paypal: 'PayPal'
    };
    return names[provider] || provider;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">💳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PayAggregate</h1>
                <p className="text-xs text-gray-500">Historique des transactions</p>
              </div>
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Retour
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Historique des Transactions
              </h1>
              <p className="text-gray-600">Consultez toutes vos transactions et statistiques</p>
            </div>

          {/* Recherche */}
          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Entrez votre numéro de téléphone"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={fetchTransactions}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {loading ? 'Chargement...' : '🔍 Rechercher'}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Statistiques */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-blue-100 text-sm">Total transactions</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-green-100 text-sm">Réussies</div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-2xl font-bold">{stats.failed}</div>
                <div className="text-red-100 text-sm">Échouées</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString()}</div>
                <div className="text-purple-100 text-sm">XOF dépensés</div>
              </div>
            </div>
          )}

          {/* Liste des transactions */}
          {transactions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Historique des transactions
              </h2>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">
                          {getProviderIcon(transaction.provider)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {getProviderName(transaction.provider)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Montant</p>
                        <p className="font-semibold text-lg">
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Référence</p>
                        <p className="font-mono text-sm">{transaction.transactionId}</p>
                      </div>
                    </div>

                    {transaction.description && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-sm text-gray-700">{transaction.description}</p>
                      </div>
                    )}

                    {transaction.paymentDetails && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Détails du paiement</p>
                        <div className="text-sm text-gray-700">
                          <p>
                            <strong>Téléphone:</strong> {transaction.paymentDetails.phoneNumber}
                          </p>
                          <p>
                            <strong>Référence:</strong> {transaction.paymentDetails.reference}
                          </p>
                        </div>
                      </div>
                    )}

                    {transaction.status === 'failed' && transaction.failureReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Raison de l'échec:</strong> {transaction.failureReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aucune transaction */}
          {!loading && transactions.length === 0 && phone && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune transaction trouvée
              </h3>
              <p className="text-gray-500">
                Aucune transaction n'a été trouvée pour ce numéro de téléphone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
