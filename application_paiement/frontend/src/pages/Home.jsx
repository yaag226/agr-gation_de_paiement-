import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">💳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PayAggregate</h1>
                <p className="text-xs text-gray-500">Vos paiements simplifiés</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/client/payer" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Paiements
              </Link>
              <Link to="/client/aggregation" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Agrégation
              </Link>
              <Link to="/client/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Historique
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Espace Marchand
              </Link>
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Link to="/client/payer" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Paiements
              </Link>
              <Link to="/client/aggregation" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Agrégation
              </Link>
              <Link to="/client/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Historique
              </Link>
              <Link to="/login" className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center">
                Espace Marchand
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Plateforme sécurisée et certifiée</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Simplifiez vos
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> paiements mobiles</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Une solution complète d'agrégation de paiement intégrant Orange Money et MTN Mobile Money.
              Payez plusieurs factures en une seule transaction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/client/aggregation"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg"
              >
                Commencer maintenant →
              </Link>
              <Link
                to="/client/payer"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all border-2 border-indigo-200 text-lg"
              >
                Paiement simple
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Instantané</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Sans inscription</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez comment notre plateforme simplifie la gestion de vos paiements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paiements instantanés</h3>
              <p className="text-gray-600 mb-4">
                Effectuez vos paiements en quelques secondes avec Orange Money ou MTN Mobile Money
              </p>
              <Link to="/client/payer" className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center">
                Essayer maintenant
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Agrégation multiple</h3>
              <p className="text-gray-600 mb-4">
                Payez plusieurs factures (eau, électricité, internet) en une seule transaction
              </p>
              <Link to="/client/aggregation" className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center">
                Découvrir
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Traçabilité complète</h3>
              <p className="text-gray-600 mb-4">
                Suivez toutes vos transactions avec un historique détaillé et des logs en temps réel
              </p>
              <Link to="/client/dashboard" className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center">
                Voir l'historique
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Providers Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Moyens de paiement acceptés
              </h2>
              <p className="text-gray-600">
                Intégration avec les principaux opérateurs de paiement mobile
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="flex items-center space-x-3 bg-white px-8 py-4 rounded-xl shadow-md">
                <div className="text-4xl">🟠</div>
                <div>
                  <div className="font-bold text-xl text-gray-900">Orange Money</div>
                  <div className="text-sm text-gray-500">Paiement mobile sécurisé</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white px-8 py-4 rounded-xl shadow-md">
                <div className="text-4xl">🟡</div>
                <div>
                  <div className="font-bold text-xl text-gray-900">MTN Mobile Money</div>
                  <div className="text-sm text-gray-500">Transfert instantané</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Merchants Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Vous êtes un marchand ?
                  </h2>
                  <p className="text-indigo-100 mb-6 text-lg">
                    Créez votre compte professionnel pour accéder au dashboard complet, aux analytics avancés et à l'API d'intégration.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-indigo-100">Dashboard en temps réel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-indigo-100">Analytics et statistiques détaillés</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-indigo-100">API d'intégration complète</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/register"
                      className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all text-center shadow-lg"
                    >
                      Créer un compte marchand
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-all text-center border-2 border-indigo-400"
                    >
                      Se connecter
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                        <span className="text-indigo-100">Revenus du mois</span>
                        <span className="text-2xl font-bold">2.5M XOF</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                        <span className="text-indigo-100">Transactions</span>
                        <span className="text-2xl font-bold">1,234</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                        <span className="text-indigo-100">Taux de succès</span>
                        <span className="text-2xl font-bold">98.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Une plateforme qui a fait ses preuves
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600">Transactions traitées</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-gray-600">Taux de succès</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Marchands actifs</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">💳</span>
                </div>
                <span className="font-bold text-xl">PayAggregate</span>
              </div>
              <p className="text-gray-400 text-sm">
                Solution complète d'agrégation de paiement mobile pour simplifier vos transactions au Burkina Faso.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/client/payer" className="hover:text-white transition-colors">Paiement simple</Link></li>
                <li><Link to="/client/aggregation" className="hover:text-white transition-colors">Agrégation de factures</Link></li>
                <li><Link to="/client/dashboard" className="hover:text-white transition-colors">Historique</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Espace marchand</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Sécurité</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cryptage SSL/TLS
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Conforme PCI DSS
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Protection anti-fraude
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>
                © 2024 PayAggregate. Tous droits réservés.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
                <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>
                🎓 Projet académique - Plateforme de démonstration d'agrégation de paiement mobile
              </p>
              <p className="mt-1">
                Les transactions sont simulées à des fins éducatives • Taux de succès simulé: 80%
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
