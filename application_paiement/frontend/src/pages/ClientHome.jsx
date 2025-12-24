import { Link } from 'react-router-dom';

const ClientHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            💳 Espace Client
          </h1>
          <p className="text-2xl text-gray-600">
            Plateforme d'Agrégation de Paiement
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Orange Money & MTN Mobile Money
          </p>
        </div>

        {/* Menu principal */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Paiement simple */}
          <Link
            to="/client/payer"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Paiement Simple
              </h2>
              <p className="text-gray-600 mb-4">
                Payez une facture rapidement
              </p>
              <div className="bg-green-50 rounded-lg p-4 text-left">
                <p className="text-sm text-green-800 font-semibold mb-2">Fonctionnalités :</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Montant personnalisé</li>
                  <li>✓ Orange Money ou MTN</li>
                  <li>✓ Résultat instantané</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Agrégation */}
          <Link
            to="/client/aggregation"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💳</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Agrégation
              </h2>
              <p className="text-gray-600 mb-4">
                Payez plusieurs factures en une fois
              </p>
              <div className="bg-purple-50 rounded-lg p-4 text-left">
                <p className="text-sm text-purple-800 font-semibold mb-2">Fonctionnalités :</p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✓ Plusieurs factures (eau, électricité, etc.)</li>
                  <li>✓ Traçage en temps réel</li>
                  <li>✓ Un seul paiement</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Historique simple */}
          <Link
            to="/client/dashboard"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Historique Simple
              </h2>
              <p className="text-gray-600 mb-4">
                Consultez vos paiements simples
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800 font-semibold mb-2">Fonctionnalités :</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Recherche par téléphone</li>
                  <li>✓ Statistiques détaillées</li>
                  <li>✓ Historique complet</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Historique agrégation */}
          <Link
            to="/client/aggregation/history"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Historique Agrégation
              </h2>
              <p className="text-gray-600 mb-4">
                Voir vos agrégations avec logs
              </p>
              <div className="bg-teal-50 rounded-lg p-4 text-left">
                <p className="text-sm text-teal-800 font-semibold mb-2">Fonctionnalités :</p>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>✓ Traçage complet</li>
                  <li>✓ Logs détaillés</li>
                  <li>✓ Liste des factures</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Guide rapide */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🚀 Guide de Démarrage Rapide
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">1️⃣ Paiement Simple</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>→ Cliquez sur "Paiement Simple"</li>
                <li>→ Entrez montant : 5000 XOF</li>
                <li>→ Choisissez Orange Money 🟠</li>
                <li>→ Téléphone : +226 70 12 34 56</li>
                <li>→ Cliquez "Payer"</li>
              </ol>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">2️⃣ Agrégation</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>→ Cliquez sur "Agrégation"</li>
                <li>→ Ajoutez 3 factures :</li>
                <li>   • Eau : 5000 XOF</li>
                <li>   • Électricité : 10000 XOF</li>
                <li>   • Internet : 7000 XOF</li>
                <li>→ Regardez les logs en direct !</li>
              </ol>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">3️⃣ Historique</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>→ Cliquez sur "Historique"</li>
                <li>→ Entrez votre numéro</li>
                <li>→ Voir toutes vos transactions</li>
                <li>→ Cliquez sur une agrégation</li>
                <li>→ Voir les logs complets</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Information importante</h3>
              <p className="text-blue-800">
                Ces pages sont <strong>publiques</strong> et ne nécessitent <strong>aucune connexion</strong>.
                Vous pouvez les utiliser directement avec juste un numéro de téléphone.
              </p>
            </div>
          </div>
        </div>

        {/* Lien vers espace marchand */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Vous êtes un marchand ?</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            🏪 Accéder à l'espace marchand
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
