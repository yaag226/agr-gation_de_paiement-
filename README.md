# 💳 PayAggregate - Plateforme d'Agrégation de Paiement Mobile

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0+-47A248.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Solution complète d'agrégation de paiement mobile pour le Burkina Faso**

[Démo](#démonstration) • [Installation](#installation) • [Documentation](#documentation) • [API](#api)

</div>

---

## 📋 Table des Matières

- [À Propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contributeurs](#contributeurs)

---

## 🎯 À Propos

**PayAggregate** est une plateforme moderne d'agrégation de paiement mobile conçue spécifiquement pour le marché burkinabè. Elle permet aux utilisateurs de :

- 💰 Effectuer des paiements instantanés via **Orange Money** et **MTN Mobile Money**
- 📋 Agréger plusieurs factures en une seule transaction
- 📊 Suivre toutes les transactions avec un traçage complet en temps réel
- 🏪 Gérer un compte marchand avec dashboard professionnel et analytics

### Projet Académique

Cette plateforme a été développée dans un cadre académique pour démontrer une architecture fullstack moderne et professionnelle utilisant les meilleures pratiques de développement web.

---

## ✨ Fonctionnalités

### Pour les Clients

- ✅ **Paiement Simple** : Payer une facture en quelques clics
- 📦 **Agrégation de Paiements** : Payer plusieurs factures (eau, électricité, internet) en une seule fois
- 📱 **Sans Inscription** : Utilisation directe sans création de compte
- 📊 **Historique Complet** : Consulter toutes les transactions avec détails
- 🔍 **Traçage en Temps Réel** : Suivre le statut de chaque paiement avec logs détaillés
- 💳 **Multi-Opérateurs** : Support Orange Money et MTN Mobile Money

### Pour les Marchands

- 📈 **Dashboard Professionnel** : Vue d'ensemble des performances en temps réel
- 💼 **Gestion des Transactions** : Liste complète avec filtres et recherche
- 📊 **Analytics Avancés** : Statistiques détaillées par période, opérateur, etc.
- 🔐 **Authentification Sécurisée** : Système d'authentification JWT
- 🛠️ **API d'Intégration** : Endpoints REST pour intégration externe
- 💰 **Suivi des Revenus** : Calcul automatique des commissions et revenus nets

---

## 🛠️ Technologies

### Frontend

- **React 18** - Framework UI moderne
- **React Router** - Navigation SPA
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Vite** - Build tool ultra-rapide

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hashage des mots de passe

### Outils de Développement

- **ESLint** - Linter JavaScript
- **Prettier** - Formateur de code
- **Morgan** - Logger HTTP
- **Helmet** - Sécurité HTTP headers
- **Express Rate Limit** - Protection contre les abus

---

## 📦 Installation

### Prérequis

- **Node.js** >= 16.0.0
- **MongoDB** >= 6.0
- **npm** ou **yarn**

### 1. Cloner le Repository

```bash
git clone https://github.com/yaag226/agrégation_de_paiement-.git
cd agrégation_de_paiement-/application_paiement
```

### 2. Installer les Dépendances

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configuration

Créer les fichiers d'environnement :

#### Backend `.env`

```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/payment_aggregator

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialiser la Base de Données

```bash
cd backend
npm run seed
```

Ceci créera :
- Un compte admin : `admin@payment.com` / `Admin123!`
- Des comptes marchands de test
- Des transactions d'exemple

### 5. Démarrer l'Application

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Le backend démarre sur `http://localhost:5000`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

---

## 🚀 Utilisation

### Accès Rapide

1. **Page d'Accueil** : `http://localhost:3000`
2. **Paiement Simple** : Cliquez sur "Paiement simple"
3. **Agrégation** : Cliquez sur "Agrégation de paiements"
4. **Espace Marchand** : Connexion avec les identifiants de test

### Comptes de Test

#### Admin
- Email : `admin@payment.com`
- Mot de passe : `Admin123!`

#### Marchand
- Email : `merchant1@test.com`
- Mot de passe : `Merchant123!`

### Workflow Client

1. **Paiement Simple** :
   - Aller sur `/client/payer`
   - Remplir le formulaire (montant, téléphone, opérateur)
   - Soumettre le paiement
   - Voir le résultat instantanément

2. **Agrégation de Paiements** :
   - Aller sur `/client/aggregation`
   - Ajouter plusieurs factures à payer
   - Choisir l'opérateur
   - Soumettre l'agrégation
   - Suivre le traitement en temps réel avec les logs

3. **Consulter l'Historique** :
   - Aller sur `/client/dashboard`
   - Entrer votre numéro de téléphone
   - Voir toutes vos transactions

### Workflow Marchand

1. Se connecter à `/login`
2. Accéder au dashboard `/merchant`
3. Voir les statistiques en temps réel
4. Consulter les transactions `/merchant/transactions`
5. Analyser les performances `/merchant/analytics`

---

## 📡 API Endpoints

### Authentification

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Paiements (Public)

```http
POST /api/payment/payer
GET  /api/payment/historique?phone={phone}
```

### Agrégation (Public)

```http
POST /api/aggregation/create
GET  /api/aggregation/:id
GET  /api/aggregation/:id/logs
GET  /api/aggregation/customer/history?phone={phone}
```

### Marchands (Protégé)

```http
GET  /api/merchants
GET  /api/merchants/:id
PUT  /api/merchants/:id
```

### Transactions (Protégé)

```http
GET  /api/transactions
GET  /api/transactions/:id
GET  /api/transactions/merchant/:merchantId
```

### Analytics (Protégé)

```http
GET  /api/analytics/dashboard
GET  /api/analytics/transactions-by-period
GET  /api/analytics/revenue-by-provider
```

### Exemples de Requêtes

#### Paiement Simple

```bash
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670000000",
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "description": "Facture eau Janvier 2024"
  }'
```

#### Agrégation de Paiements

```bash
curl -X POST http://localhost:5000/api/aggregation/create \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "orange_money",
    "customerPhone": "+22670000000",
    "customerName": "Jean Dupont",
    "payments": [
      {
        "description": "Facture eau",
        "amount": 5000,
        "category": "facture_eau"
      },
      {
        "description": "Facture électricité",
        "amount": 15000,
        "category": "facture_electricite"
      }
    ]
  }'
```

---

## 🏗️ Architecture

### Structure du Projet

```
application_paiement/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Contrôleurs
│   │   ├── middlewares/     # Middlewares
│   │   ├── models/          # Modèles Mongoose
│   │   ├── routes/          # Routes Express
│   │   ├── services/        # Services métier
│   │   └── utils/           # Utilitaires
│   ├── server.js            # Point d'entrée
│   └── package.json
│
└── frontend/
    ├── public/              # Assets statiques
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   ├── context/         # Context API
    │   ├── pages/           # Pages de l'application
    │   ├── services/        # Services API
    │   ├── utils/           # Utilitaires
    │   ├── App.jsx          # Composant principal
    │   └── main.jsx         # Point d'entrée
    └── package.json
```

### Flux de Données

```
Client → Frontend → API → Controller → Service → Model → MongoDB
                                              ↓
                                    Payment Provider
```

### Modèles de Données

#### Transaction
- ID de transaction unique
- Marchand référencé
- Montant et devise
- Provider (Orange Money, MTN)
- Détails du client
- Statut et timestamps
- Commissions calculées

#### AggregatedPayment
- ID d'agrégation unique
- Informations client
- Liste de paiements
- Montant total
- Transactions référencées
- Logs d'activité détaillés
- Statut (pending, processing, completed, failed, partial)

---

## 🧪 Tests

### Tests Manuels

1. **Paiement Simple** :
   - ✅ Vérifier que le paiement Orange Money fonctionne
   - ✅ Vérifier que le paiement MTN Money fonctionne
   - ✅ Vérifier la gestion des erreurs
   - ✅ Vérifier l'historique

2. **Agrégation** :
   - ✅ Créer une agrégation avec 3 factures
   - ✅ Vérifier le traçage en temps réel
   - ✅ Vérifier les statuts (completed, partial, failed)
   - ✅ Consulter l'historique d'agrégation

3. **Dashboard Marchand** :
   - ✅ Voir les statistiques
   - ✅ Filtrer les transactions
   - ✅ Voir les analytics

### Lancer les Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🌐 Déploiement

### Production Build

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
```

Les fichiers optimisés seront dans `frontend/dist/`

### Variables d'Environnement Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=secret_production_tres_securise
FRONTEND_URL=https://votre-domaine.com
```

### Hébergement Recommandé

- **Backend** : Heroku, Railway, Render
- **Frontend** : Vercel, Netlify, Cloudflare Pages
- **Database** : MongoDB Atlas

---

## 📝 Notes Importantes

### Simulation

Cette application est une **démonstration** :
- Les paiements Orange Money et MTN sont **simulés**
- Taux de succès : **80%** (aléatoire)
- Aucune vraie transaction n'est effectuée
- Les références générées sont fictives

### Production

Pour utiliser en production :
1. Intégrer les **vraies API** Orange Money et MTN
2. Configurer les **webhooks** pour les notifications
3. Implémenter la **2FA** pour les marchands
4. Ajouter des **tests unitaires et d'intégration**
5. Configurer le **monitoring et les alertes**
6. Mettre en place un **système de logs centralisé**

---

## 🤝 Contributeurs

- **Développeur Principal** : [Votre Nom]
- **Projet Académique** : Plateforme d'agrégation de paiement mobile
- **Institution** : [Votre Université]

---

## 📄 License

MIT License - Voir le fichier LICENSE pour plus de détails

---

## 📧 Contact

Pour toute question concernant ce projet académique :

- Email : [votre.email@example.com]
- GitHub : [@yaag226](https://github.com/yaag226)

---

<div align="center">

**Fait avec ❤️ pour le Burkina Faso 🇧🇫**

[⬆ Retour en haut](#-payaggregate---plateforme-dagrégation-de-paiement-mobile)

</div>
