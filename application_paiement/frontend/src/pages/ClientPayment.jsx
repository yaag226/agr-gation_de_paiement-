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

  // Définition des moyens de paiement avec leurs styles
  const paymentMethods = [
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: '📱',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      hoverColor: 'hover:border-orange-300',
      textColor: 'text-orange-600',
      description: 'Paiement via Orange Money'
    },
    {
      id: 'mtn_money',
      name: 'MTN Mobile Money',
      icon: '💳',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      hoverColor: 'hover:border-yellow-300',
      textColor: 'text-yellow-600',
      description: 'Paiement via MTN Money'
    },
    {
      id: 'moov_money',
      name: 'Moov Money',
      icon: '💰',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      hoverColor: 'hover:border-blue-300',
      textColor: 'text-blue-600',
      description: 'Paiement via Moov Money'
    },
    {
      id: 'coris_bank',
      name: 'Coris Bank',
      icon: '🏦',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      hoverColor: 'hover:border-green-300',
      textColor: 'text-green-600',
      description: 'Paiement via Coris Bank'
    },
    {
      id: 'ecobank',
      name: 'Ecobank',
      icon: '🏛️',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      hoverColor: 'hover:border-purple-300',
      textColor: 'text-purple-600',
      description: 'Paiement via Ecobank'
    }
  ];

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

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <div className="text-5xl">💳</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Plateforme de Paiement Sécurisée
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Effectuez vos paiements rapidement et en toute sécurité avec nos partenaires de confiance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">📝</span>
                Informations de paiement
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Montant */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Montant à payer (XOF) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="100"
                      className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: 5000"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      XOF
                    </div>
                  </div>
                  {formData.amount && (
                    <p className="mt-2 text-sm text-gray-600">
                      Soit environ {(parseFloat(formData.amount) / 656).toFixed(2)} EUR
                    </p>
                  )}
                </div>

                {/* Moyen de paiement */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choisissez votre moyen de paiement *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-4 border-2 rounded-xl transition-all transform hover:scale-105 ${
                          formData.paymentMethod === method.id
                            ? `${method.borderColor} ${method.bgColor} shadow-lg`
                            : `border-gray-300 ${method.hoverColor} hover:shadow-md`
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{method.icon}</div>
                          <div className={`font-semibold text-sm ${
                            formData.paymentMethod === method.id ? method.textColor : 'text-gray-700'
                          }`}>
                            {method.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numéro de téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+226 70 00 00 00"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description du paiement
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Motif du paiement (optionnel)..."
                  />
                </div>

                {/* Bouton Payer */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Traitement en cours...
                    </span>
                  ) : (
                    `💳 Payer maintenant`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Résumé et informations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Résumé du paiement */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Résumé
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Moyen de paiement:</span>
                  <div className="flex items-center">
                    <span className="mr-2">{selectedMethod?.icon}</span>
                    <span className="font-semibold text-sm">{selectedMethod?.name}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formData.amount ? `${parseFloat(formData.amount).toLocaleString()} XOF` : '0 XOF'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Frais:</span>
                  <span className="font-semibold text-green-600">Inclus</span>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                Paiement sécurisé
              </h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cryptage SSL 256 bits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Conformité PCI-DSS</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Protection des données</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">💬</span>
                Besoin d'aide?
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Notre équipe est disponible 24/7
              </p>
              <a
                href="mailto:support@paiement.bf"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                support@paiement.bf
              </a>
            </div>
          </div>
        </div>

        {/* Résultat */}
        {result && (
          <div className="mt-6 max-w-3xl mx-auto">
            <div
              className={`rounded-2xl shadow-2xl p-6 md:p-8 border-4 ${
                result.success
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-500'
              }`}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {result.success ? '✅' : '❌'}
                </div>
                <h3
                  className={`text-3xl font-bold mb-2 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {result.message}
                </h3>
              </div>
              {result.success && result.data && (
                <div className="bg-white rounded-xl p-6 shadow-inner">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Référence</p>
                      <p className="font-bold text-gray-900">{result.data.reference}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">ID Transaction</p>
                      <p className="font-bold text-gray-900">{result.data.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Montant</p>
                      <p className="font-bold text-gray-900">
                        {result.data.amount} {result.data.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Moyen de paiement</p>
                      <p className="font-bold text-gray-900">
                        {paymentMethods.find(m => m.id === result.data.provider)?.name || result.data.provider}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-4 border-red-500 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start">
                <div className="text-4xl mr-4">❌</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-800 mb-2">Erreur de paiement</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information de démo */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="text-3xl mr-4">ℹ️</div>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Mode Démonstration</h4>
                <p className="text-sm text-amber-800">
                  Cette plateforme simule les paiements mobiles et bancaires. Les transactions ont 80% de chances
                  de réussir pour la démonstration. Aucun argent réel n'est débité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPayment;
