import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Plateforme de Paiement
            </h1>
            <p className="text-gray-600">Effectuez vos paiements en toute sécurité</p>
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
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:scale-98'
              }`}
            >
              {loading ? 'Traitement en cours...' : '💳 Payer'}
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Information</h4>
          <p className="text-sm text-blue-800">
            Cette plateforme simule les paiements Orange Money et MTN Mobile Money.
            Les transactions ont 80% de chances de réussir pour la démonstration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPayment;
