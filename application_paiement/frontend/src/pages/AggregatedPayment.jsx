import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AggregatedPayment = () => {
  const [formData, setFormData] = useState({
    paymentMethod: 'orange_money',
    customerPhone: '',
    customerName: '',
    customerEmail: ''
  });

  const [payments, setPayments] = useState([
    { description: '', amount: '', category: 'facture_eau', reference: '' }
  ]);

  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'facture_eau', label: '💧 Facture d\'eau' },
    { value: 'facture_electricite', label: '⚡ Facture d\'électricité' },
    { value: 'internet', label: '🌐 Internet' },
    { value: 'telephone', label: '📱 Téléphone' },
    { value: 'achat', label: '🛒 Achat' },
    { value: 'autre', label: '📌 Autre' }
  ];

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...payments];
    newPayments[index][field] = value;
    setPayments(newPayments);
  };

  const addPayment = () => {
    setPayments([...payments, { description: '', amount: '', category: 'facture_eau', reference: '' }]);
  };

  const removePayment = (index) => {
    if (payments.length > 1) {
      const newPayments = payments.filter((_, i) => i !== index);
      setPayments(newPayments);
    }
  };

  const addLog = (action, details, status) => {
    const newLog = {
      timestamp: new Date(),
      action,
      details,
      status
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setResult(null);
    setLogs([]);

    // Validation
    const validPayments = payments.filter(p => p.description && p.amount > 0);
    if (validPayments.length === 0) {
      setError('Veuillez ajouter au moins un paiement valide');
      setProcessing(false);
      return;
    }

    addLog('START', `Début de l'agrégation de ${validPayments.length} paiement(s)`, 'info');

    try {
      const totalAmount = validPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      addLog('VALIDATION', `Montant total: ${totalAmount.toLocaleString()} XOF`, 'info');

      const requestData = {
        payments: validPayments.map(p => ({
          ...p,
          amount: parseFloat(p.amount)
        })),
        provider: formData.paymentMethod,
        customerPhone: formData.customerPhone,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail
      };

      addLog('SEND_REQUEST', `Envoi de la requête au backend...`, 'info');

      const response = await axios.post('http://localhost:5000/api/aggregation/create', requestData);

      addLog('RESPONSE_RECEIVED', `Réponse reçue du backend`, 'success');

      // Afficher les logs du backend
      if (response.data.data.aggregation.activityLog) {
        response.data.data.aggregation.activityLog.forEach(log => {
          addLog(log.action, log.details, log.status);
        });
      }

      setResult(response.data);

      // Réinitialiser le formulaire si succès complet
      if (response.data.data.aggregation.status === 'completed') {
        setPayments([{ description: '', amount: '', category: 'facture_eau', reference: '' }]);
        setFormData({
          ...formData,
          customerPhone: '',
          customerName: '',
          customerEmail: ''
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'agrégation';
      setError(errorMsg);
      addLog('ERROR', errorMsg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  };

  const getLogIcon = (status) => {
    const icons = {
      info: '🔵',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    return icons[status] || '📝';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                <p className="text-xs text-gray-500">Agrégation de paiements</p>
              </div>
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Retour
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Agrégation de Paiements
              </h1>
              <p className="text-xl text-gray-600">
                Payez plusieurs factures en une seule transaction
              </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations client */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                👤 Informations du client
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+226 70 00 00 00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Moyen de paiement */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moyen de paiement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'orange_money' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🟠</div>
                      <div className="font-semibold">Orange Money</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'mtn_money' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === 'mtn_money'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🟡</div>
                      <div className="font-semibold">MTN Mobile Money</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des paiements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  📋 Factures à payer ({payments.length})
                </h3>
                <button
                  type="button"
                  onClick={addPayment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  ➕ Ajouter
                </button>
              </div>

              <div className="space-y-4">
                {payments.map((payment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-700">Paiement #{index + 1}</span>
                      {payments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePayment(index)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          ❌ Retirer
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={payment.category}
                          onChange={(e) => handlePaymentChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={payment.description}
                          onChange={(e) => handlePaymentChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ex: Facture eau Janvier 2024"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Montant (XOF) *
                        </label>
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                          min="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          placeholder="5000"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Référence (optionnel)
                      </label>
                      <input
                        type="text"
                        value={payment.reference}
                        onChange={(e) => handlePaymentChange(index, 'reference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Numéro de facture"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">Montant Total</span>
                <span className="text-3xl font-bold text-purple-600">
                  {getTotalAmount().toLocaleString()} XOF
                </span>
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={processing}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {processing ? '⏳ Traitement en cours...' : '💳 Payer tout maintenant'}
            </button>
          </form>
        </div>

        {/* Logs en temps réel */}
        {logs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Traçage en temps réel
            </h2>
            <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2 font-mono text-sm">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      log.status === 'error' ? 'text-red-400' :
                      log.status === 'success' ? 'text-green-400' :
                      log.status === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}
                  >
                    <span className="flex-shrink-0">{getLogIcon(log.status)}</span>
                    <div className="flex-1">
                      <div className="text-gray-500 text-xs">
                        [{log.timestamp.toLocaleTimeString()}]
                      </div>
                      <div className="font-semibold">{log.action}</div>
                      <div className="text-gray-300">{log.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className={`bg-white rounded-2xl shadow-xl p-8 border-4 ${
            result.data.aggregation.status === 'completed' ? 'border-green-500' :
            result.data.aggregation.status === 'partial' ? 'border-yellow-500' :
            'border-red-500'
          }`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {result.data.aggregation.status === 'completed' ? '✅' :
                 result.data.aggregation.status === 'partial' ? '⚠️' : '❌'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {result.message}
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.data.summary.total}
                </div>
                <div className="text-sm text-gray-600">Total paiements</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.data.summary.success}
                </div>
                <div className="text-sm text-gray-600">Réussis</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.data.summary.failed}
                </div>
                <div className="text-sm text-gray-600">Échoués</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {result.data.summary.totalAmount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">XOF Total</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>ID d'agrégation:</strong> {result.data.aggregation.aggregationId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Statut:</strong>{' '}
                <span className={`font-semibold ${
                  result.data.aggregation.status === 'completed' ? 'text-green-600' :
                  result.data.aggregation.status === 'partial' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {result.data.aggregation.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border-4 border-red-500 rounded-2xl p-8">
            <div className="flex items-start">
              <div className="text-4xl mr-4">❌</div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AggregatedPayment;
