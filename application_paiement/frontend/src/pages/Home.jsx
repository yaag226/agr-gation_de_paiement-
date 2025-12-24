import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Plateforme d'Agrégation de Paiement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solution complète pour gérer vos paiements mobiles en toute sécurité avec
            Orange Money et MTN Mobile Money
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Espace Client */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💳</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Espace Client
              </h2>
              <p className="text-gray-600">
                Effectuez vos paiements et consultez votre historique
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/client/payer"
                className="block w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-center hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                💰 Paiement simple
              </Link>

              <Link
                to="/client/aggregation"
                className="block w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold text-center hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                💳 Agrégation (Payer plusieurs factures)
              </Link>

              <Link
                to="/client/dashboard"
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold text-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                📊 Historique simple
              </Link>

              <Link
                to="/client/aggregation/history"
                className="block w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-center hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                📚 Historique agrégation
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">✨ Fonctionnalités</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Paiement instantané Orange Money & MTN</li>
                <li>✓ Agrégation de plusieurs factures</li>
                <li>✓ Traçage complet en temps réel</li>
                <li>✓ Historique avec logs détaillés</li>
                <li>✓ Aucune inscription nécessaire</li>
              </ul>
            </div>
          </div>

          {/* Espace Marchand */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Espace Marchand
              </h2>
              <p className="text-gray-600">
                Gérez vos transactions et analysez vos revenus
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                className="block w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                🔐 Se connecter
              </Link>

              <Link
                to="/register"
                className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold text-center hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                ✍️ Créer un compte
              </Link>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🎯 Avantages</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Dashboard en temps réel</li>
                <li>✓ Agrégation multi-opérateurs</li>
                <li>✓ Analytics avancés</li>
                <li>✓ API d'intégration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Pourquoi choisir notre plateforme ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Paiements instantanés
              </h3>
              <p className="text-gray-600">
                Transactions traitées en temps réel avec Orange Money et MTN Mobile Money
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sécurité maximale
              </h3>
              <p className="text-gray-600">
                Toutes les transactions sont sécurisées et cryptées de bout en bout
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Analytics complets
              </h3>
              <p className="text-gray-600">
                Suivez vos performances avec des statistiques détaillées
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-gray-600 max-w-4xl mx-auto">
          <p className="mb-4">
            <strong>Note:</strong> Cette plateforme est une démonstration fonctionnelle d'agrégation de paiement.
            Les transactions sont simulées avec un taux de succès de 80%.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span>🟠 Orange Money</span>
            <span>•</span>
            <span>🟡 MTN Mobile Money</span>
            <span>•</span>
            <span>💰 XOF (Franc CFA)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
