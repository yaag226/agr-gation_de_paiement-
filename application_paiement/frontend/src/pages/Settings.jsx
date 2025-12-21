import React, { useState, useEffect } from 'react';
import { merchantAPI, transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    provider: 'stripe',
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
    isActive: true
  });
  const [testPayment, setTestPayment] = useState({
    amount: 100,
    currency: 'EUR',
    customerEmail: 'test@example.com',
    provider: ''
  });

  useEffect(() => {
    if (user?.merchant) {
      loadMerchant();
    }
  }, [user]);

  const loadMerchant = async () => {
    try {
      const response = await merchantAPI.getById(user.merchant._id);
      setMerchant(response.data.data.merchant);
    } catch (error) {
      console.error('Error loading merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    try {
      await merchantAPI.addProviderConfig(newProvider);
      await loadMerchant();
      setShowAddProvider(false);
      setNewProvider({
        provider: 'stripe',
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        isActive: true
      });
      alert('Provider ajouté avec succès!');
    } catch (error) {
      alert('Erreur lors de l\'ajout du provider: ' + error.response?.data?.message);
    }
  };

  const handleTestPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await transactionAPI.initiate(testPayment);
      alert('Paiement test initié avec succès!\nTransaction ID: ' + response.data.data.transaction.transactionId);
    } catch (error) {
      alert('Erreur lors du test de paiement: ' + error.response?.data?.message);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Configuration de votre compte marchand</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du marchand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
            <p className="text-gray-900">{merchant?.businessName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <p className="text-gray-900 capitalize">{merchant?.businessType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <div className="flex gap-2">
              <span className={`badge ${merchant?.isVerified ? 'badge-success' : 'badge-warning'}`}>
                {merchant?.isVerified ? 'Vérifié' : 'Non vérifié'}
              </span>
              <span className={`badge ${merchant?.isActive ? 'badge-success' : 'badge-danger'}`}>
                {merchant?.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Providers de paiement</h2>
          <button
            onClick={() => setShowAddProvider(true)}
            className="btn btn-primary"
          >
            Ajouter un provider
          </button>
        </div>

        {showAddProvider && (
          <form onSubmit={handleAddProvider} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">Nouveau Provider</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  className="input"
                  value={newProvider.provider}
                  onChange={(e) => setNewProvider({ ...newProvider, provider: e.target.value })}
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="wave">Wave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="text"
                  className="input"
                  value={newProvider.apiKey}
                  onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  className="input"
                  value={newProvider.secretKey}
                  onChange={(e) => setNewProvider({ ...newProvider, secretKey: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret (optionnel)</label>
                <input
                  type="text"
                  className="input"
                  value={newProvider.webhookSecret}
                  onChange={(e) => setNewProvider({ ...newProvider, webhookSecret: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">Ajouter</button>
              <button
                type="button"
                onClick={() => setShowAddProvider(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {merchant?.providers?.map((provider) => (
            <div key={provider.provider} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium capitalize">{provider.provider}</p>
                <p className="text-sm text-gray-600">Priorité: {provider.priority}</p>
              </div>
              <span className={`badge ${provider.isActive ? 'badge-success' : 'badge-danger'}`}>
                {provider.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          ))}
          {(!merchant?.providers || merchant.providers.length === 0) && (
            <p className="text-gray-600 text-center py-4">Aucun provider configuré</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test de paiement</h2>
        <form onSubmit={handleTestPayment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                type="number"
                className="input"
                value={testPayment.amount}
                onChange={(e) => setTestPayment({ ...testPayment, amount: parseFloat(e.target.value) })}
                min="1"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select
                className="input"
                value={testPayment.currency}
                onChange={(e) => setTestPayment({ ...testPayment, currency: e.target.value })}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email client</label>
              <input
                type="email"
                className="input"
                value={testPayment.customerEmail}
                onChange={(e) => setTestPayment({ ...testPayment, customerEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider (optionnel)</label>
              <select
                className="input"
                value={testPayment.provider}
                onChange={(e) => setTestPayment({ ...testPayment, provider: e.target.value })}
              >
                <option value="">Auto (premier actif)</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="wave">Wave</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Initier un paiement test</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
