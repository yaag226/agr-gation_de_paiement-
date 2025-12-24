import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientPayment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'orange_money',
    customerPhone: '',
    customerName: '',
    customerEmail: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/payment/payer', formData);

      setResult(response.data);

      // Réinitialiser le formulaire si succès
      if (response.data.success) {
        setFormData({
          amount: '',
          paymentMethod: 'orange_money',
          customerPhone: '',
          customerName: '',
          customerEmail: '',
          description: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
                <p className="text-xs text-gray-500">Paiement simple</p>
              </div>
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Retour
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Paiement Instantané
              </h1>
              <p className="text-gray-600">Effectuez votre paiement en toute sécurité avec Orange Money ou MTN</p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (XOF)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 5000"
              />
            </div>

            {/* Moyen de paiement */}
            <div>
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

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: +226 70 00 00 00"
              />
            </div>

            {/* Nom (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom (optionnel)
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre nom"
              />
            </div>

            {/* Email (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optionnel)
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            {/* Description (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Motif du paiement..."
              />
            </div>

            {/* Bouton Payer */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </span>
              ) : (
                '💳 Payer maintenant'
              )}
            </button>
          </form>

          {/* Résultat */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {result.success ? '✅' : '❌'}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </h3>
                  {result.success && result.data && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Référence:</strong> {result.data.reference}
                      </p>
                      <p>
                        <strong>Montant:</strong> {result.data.amount} {result.data.currency}
                      </p>
                      <p>
                        <strong>Moyen:</strong> {result.data.paymentMethod === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}
                      </p>
                      <p>
                        <strong>ID Transaction:</strong> {result.data.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-2xl mr-3">❌</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">Erreur</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Info */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Information importante</h4>
                <p className="text-sm text-blue-800">
                  Cette plateforme simule les paiements Orange Money et MTN Mobile Money à des fins de démonstration.
                  Les transactions ont un taux de succès simulé de 80%.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <Link to="/client/aggregation" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Payer plusieurs factures →
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/client/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Voir l'historique
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ClientPayment;
