import { useState } from 'react';
import axios from 'axios';

const AggregationHistory = () => {
  const [phone, setPhone] = useState('');
  const [aggregations, setAggregations] = useState([]);
  const [selectedAggregation, setSelectedAggregation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAggregations = async () => {
    if (!phone) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/aggregation/customer/history', {
        params: { phone }
      });

      setAggregations(response.data.data.aggregations);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération');
      setAggregations([]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (aggregation) => {
    setSelectedAggregation(aggregation);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: '✅',
      partial: '⚠️',
      failed: '❌',
      pending: '⏳',
      processing: '🔄'
    };
    return icons[status] || '📝';
  };

  const getLogIcon = (status) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '🔵'
    };
    return icons[status] || '📝';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      facture_eau: '💧',
      facture_electricite: '⚡',
      internet: '🌐',
      telephone: '📱',
      achat: '🛒',
      autre: '📌'
    };
    return icons[category] || '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📚 Historique d'Agrégation
            </h1>
            <p className="text-xl text-gray-600">
              Consultez toutes vos agrégations de paiements avec traçage détaillé
            </p>
          </div>

          {/* Recherche */}
          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Entrez votre numéro de téléphone"
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
              <button
                onClick={fetchAggregations}
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? '⏳ Chargement...' : '🔍 Rechercher'}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Liste des agrégations */}
          {aggregations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {aggregations.length} agrégation(s) trouvée(s)
              </h2>
              <div className="grid gap-4">
                {aggregations.map((agg) => (
                  <div
                    key={agg._id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedAggregation?._id === agg._id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                    onClick={() => viewDetails(agg)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {getStatusIcon(agg.status)} Agrégation {agg.aggregationId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(agg.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(agg.status)}`}>
                        {agg.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Total factures</div>
                        <div className="text-2xl font-bold text-gray-800">{agg.payments.length}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Montant total</div>
                        <div className="text-2xl font-bold text-teal-600">
                          {agg.totalAmount.toLocaleString()} XOF
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Provider</div>
                        <div className="text-lg font-semibold">
                          {agg.provider === 'orange_money' ? '🟠 Orange' : '🟡 MTN'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Logs activité</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {agg.activityLog.length}
                        </div>
                      </div>
                    </div>

                    {selectedAggregation?._id !== agg._id && (
                      <div className="text-center">
                        <button className="text-teal-600 font-semibold hover:text-teal-700">
                          👁️ Cliquez pour voir les détails
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aucune agrégation */}
          {!loading && aggregations.length === 0 && phone && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Aucune agrégation trouvée
              </h3>
              <p className="text-gray-500">
                Aucune agrégation n'a été trouvée pour ce numéro.
              </p>
            </div>
          )}
        </div>

        {/* Détails de l'agrégation sélectionnée */}
        {selectedAggregation && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                📋 Détails complets
              </h2>
              <button
                onClick={() => setSelectedAggregation(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
              >
                ✖️ Fermer
              </button>
            </div>

            {/* Factures payées */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💳 Factures incluses ({selectedAggregation.payments.length})
              </h3>
              <div className="space-y-3">
                {selectedAggregation.payments.map((payment, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(payment.category)}</div>
                        <div>
                          <div className="font-semibold text-gray-800">{payment.description}</div>
                          {payment.reference && (
                            <div className="text-xs text-gray-500">Réf: {payment.reference}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-teal-600">
                          {payment.amount.toLocaleString()} XOF
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {payment.category.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traçage des activités */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🔍 Traçage complet ({selectedAggregation.activityLog.length} événements)
              </h3>
              <div className="bg-gray-900 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                <div className="space-y-3">
                  {selectedAggregation.activityLog.map((log, index) => (
                    <div
                      key={index}
                      className={`border-l-4 pl-4 py-2 ${
                        log.status === 'error' ? 'border-red-500' :
                        log.status === 'success' ? 'border-green-500' :
                        log.status === 'warning' ? 'border-yellow-500' :
                        'border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getLogIcon(log.status)}
                        </span>
                        <div className="flex-1 font-mono text-sm">
                          <div className="text-gray-500 text-xs mb-1">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </div>
                          <div className={`font-bold mb-1 ${
                            log.status === 'error' ? 'text-red-400' :
                            log.status === 'success' ? 'text-green-400' :
                            log.status === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            {log.action}
                          </div>
                          <div className="text-gray-300">{log.details}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions associées */}
            {selectedAggregation.transactions && selectedAggregation.transactions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🔗 Transactions backend ({selectedAggregation.transactions.length})
                </h3>
                <div className="space-y-3">
                  {selectedAggregation.transactions.map((tx, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">ID Transaction</div>
                          <div className="font-mono text-sm font-semibold">{tx.transactionId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Montant</div>
                          <div className="font-semibold">{tx.amount.toLocaleString()} XOF</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Statut</div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Référence provider</div>
                          <div className="font-mono text-xs">{tx.providerTransactionId}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AggregationHistory;
