# 🚀 APPLICATION D'AGRÉGATION DE PAIEMENT

> **Projet académique** - Application complète de paiement simulé avec Node.js, React et MongoDB

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Démarrage rapide](#-démarrage-rapide)
- [Comptes de test](#-comptes-de-test)
- [Technologies](#-technologies)
- [Fonctionnalités](#-fonctionnalités)
- [Documentation](#-documentation)

---

## 🎯 Vue d'ensemble

Application full-stack de **simulation de paiements** permettant de gérer des transactions entre **clients**, **marchands** et **administrateurs**.

### Points clés
✅ Fonctionne 100% en local
✅ Paiements simulés (mock) - pas de vrais services
✅ 3 types d'utilisateurs (Client, Marchand, Admin)
✅ Interface moderne avec React + Tailwind CSS
✅ API REST complète avec JWT

---

## ⚡ Démarrage rapide

### Prérequis
- Node.js >= 14.0.0
- MongoDB (local ou Compass)
- npm ou yarn

### Installation en 3 étapes

```bash
# 1. Installer les dépendances
cd application_paiement
npm run install:all

# 2. Lancer MongoDB (dans un terminal séparé)
mongod

# 3. Seed la base de données (données de test)
npm run seed
```

### Lancer l'application

```bash
# Terminal 1 - Backend (Port 5000)
npm run dev:backend

# Terminal 2 - Frontend (Port 3000)
npm run dev:frontend
```

🌐 **Frontend** : http://localhost:3000
🔌 **Backend API** : http://localhost:5000
✅ **Health Check** : http://localhost:5000/health

---

## 🔑 Comptes de test

Après avoir lancé `npm run seed`, utilisez ces comptes :

### 👨‍💼 Admin
- **Email** : `admin@payment.com`
- **Mot de passe** : `Admin123!`
- **Accès** : Dashboard admin, gestion complète

### 🏪 Marchand 1 (Tech Store)
- **Email** : `merchant1@test.com`
- **Mot de passe** : `Merchant123!`
- **Accès** : Dashboard marchand, transactions, analytics

### 🏪 Marchand 2 (Fashion)
- **Email** : `merchant2@test.com`
- **Mot de passe** : `Merchant123!`

### 🏪 Marchand 3 (Eco Products)
- **Email** : `merchant3@test.com`
- **Mot de passe** : `Merchant123!`

### 👤 Client 1
- **Email** : `customer1@test.com`
- **Mot de passe** : `Customer123!`
- **Accès** : Dashboard client, historique

### 👤 Client 2
- **Email** : `customer2@test.com`
- **Mot de passe** : `Customer123!`

---

## 🛠️ Technologies

### Backend
| Technologie | Version | Usage |
|------------|---------|-------|
| Node.js | 14+ | Runtime JavaScript |
| Express | 4.18.2 | Framework web |
| MongoDB | Latest | Base de données NoSQL |
| Mongoose | 8.0.0 | ODM pour MongoDB |
| JWT | 9.0.2 | Authentification |
| bcryptjs | 2.4.3 | Hashage de mots de passe |

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.2.0 | Bibliothèque UI |
| Vite | 5.0.5 | Build tool |
| Tailwind CSS | 3.3.6 | Styling |
| React Router | 6.20.0 | Navigation |
| Axios | 1.6.2 | HTTP client |
| Chart.js | 4.4.0 | Graphiques |

---

## ✨ Fonctionnalités

### 🧑‍💼 Pour le CLIENT
- ✅ Effectuer des paiements simulés
- ✅ Choisir le moyen de paiement (Orange Money, MTN, Moov, etc.)
- ✅ Consulter l'historique des transactions
- ✅ Voir le statut des paiements (SUCCESS/FAILED/PENDING)

### 🏪 Pour le MARCHAND
- ✅ Dashboard avec statistiques en temps réel
- ✅ Liste des paiements reçus
- ✅ Revenus totaux et commissions
- ✅ Analytics avec graphiques (Chart.js)
- ✅ Filtres par date et statut
- ✅ Configuration des moyens de paiement

### 👨‍💼 Pour l'ADMIN
- ✅ Dashboard global de supervision
- ✅ Gestion des utilisateurs (voir, modifier, supprimer)
- ✅ Gestion des marchands (activer/désactiver, vérifier)
- ✅ Vue de toutes les transactions
- ✅ Statistiques globales
- ✅ Contrôle des accès

---

## 💳 Moyens de paiement simulés

| Provider | Taux de succès | Commission |
|----------|----------------|------------|
| Orange Money | 80% | 1.5% |
| MTN Mobile Money | 80% | 1.5% |
| Moov Money | 80% | 1.5% |
| Coris Bank | 80% | 2% |
| Ecobank | 80% | 2% |
| Stripe | - | 2.9% |
| PayPal | - | 3.4% |
| Wave | - | 1% |

---

## 📡 API REST - Endpoints principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Paiements (Client)
- `POST /api/payment/payer` - Effectuer un paiement
- `GET /api/payment/historique` - Historique des transactions

### Marchands
- `GET /api/merchants/stats` - Statistiques du marchand
- `POST /api/merchants/provider-config` - Config provider

### Transactions
- `GET /api/transactions` - Liste des transactions
- `GET /api/transactions/:id` - Détails d'une transaction
- `GET /api/transactions/stats` - Statistiques

### Admin
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/users` - Liste des utilisateurs
- `PUT /api/admin/users/:id` - Modifier un utilisateur
- `POST /api/admin/merchants/:id/verify` - Vérifier un marchand
- `POST /api/admin/merchants/:id/toggle-status` - Activer/Désactiver

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/revenue` - Rapport de revenus

📖 **Documentation complète** : [GUIDE_COMPLET_APPLICATION.md](./GUIDE_COMPLET_APPLICATION.md)

---

## 📂 Structure du projet

```
application_paiement/
├── backend/
│   ├── server.js                    # Point d'entrée
│   ├── src/
│   │   ├── app.js                   # Config Express
│   │   ├── config/                  # Configuration
│   │   ├── models/                  # Modèles Mongoose
│   │   ├── controllers/             # Logique métier
│   │   ├── routes/                  # Routes API
│   │   ├── middlewares/             # Middlewares (auth, validation)
│   │   ├── services/                # Services (payment)
│   │   └── utils/                   # Utilitaires (seed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Routes principales
    │   ├── context/                 # Context API (Auth)
    │   ├── components/              # Composants réutilisables
    │   ├── pages/                   # Pages
    │   ├── services/                # API client (Axios)
    │   └── utils/                   # Utilitaires
    └── package.json
```

---

## 🧪 Tester rapidement

### Test 1 : Paiement client (sans auth)
```bash
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670123456",
    "customerEmail": "test@example.com",
    "customerName": "Test User"
  }'
```

### Test 2 : Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

---

## 🎓 Utilisation pour présentation académique

### Scénario de démonstration

1. **Connexion Admin** → Voir le dashboard global
2. **Connexion Marchand** → Voir les transactions et stats
3. **Page Client** → Effectuer un paiement simulé
4. **Retour Marchand** → Voir la nouvelle transaction
5. **Retour Admin** → Gérer les utilisateurs

### Points à mettre en avant
- Architecture MVC complète
- API REST bien structurée
- Sécurité (JWT, bcrypt, validation)
- 3 rôles distincts avec permissions
- Simulation réaliste des paiements
- Interface moderne et responsive
- Graphiques et analytics

---

## 🔧 Scripts disponibles

### Racine
```bash
npm run install:all      # Installer toutes les dépendances
npm run dev:backend      # Lancer backend en dev
npm run dev:frontend     # Lancer frontend en dev
npm run seed             # Seed database
npm run clean            # Nettoyer node_modules
```

### Backend
```bash
npm start      # Mode production
npm run dev    # Mode développement (nodemon)
npm run seed   # Générer données de test
npm test       # Tests (Jest)
```

### Frontend
```bash
npm run dev      # Développement (Vite)
npm run build    # Build production
npm run preview  # Prévisualiser le build
```

---

## 🐛 Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier le statut
sudo systemctl status mongod

# Démarrer MongoDB
sudo systemctl start mongod

# OU lancer manuellement
mongod
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Tuer le processus
kill -9 <PID>
```

### Erreur de connexion DB
Vérifier `.env` dans le backend :
```env
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
```

---

## 📚 Documentation complète

Pour une documentation détaillée avec tous les endpoints API, schémas de données, et guides d'utilisation :

📖 **[GUIDE_COMPLET_APPLICATION.md](./GUIDE_COMPLET_APPLICATION.md)**

---

## 🔒 Sécurité

- ✅ Hashage bcrypt (12 rounds)
- ✅ JWT avec expiration
- ✅ Protection CORS
- ✅ Helmet.js (headers sécurisés)
- ✅ Rate limiting (100 req/15min)
- ✅ Sanitization NoSQL
- ✅ Validation Joi

---

## 📄 Licence

MIT License - Projet à but éducatif uniquement.

---

## 🤝 Support

Pour toute question ou problème :
1. Consulter [GUIDE_COMPLET_APPLICATION.md](./GUIDE_COMPLET_APPLICATION.md)
2. Vérifier que MongoDB tourne
3. Vérifier les logs du backend et frontend

---

## 🎉 Bon développement !

**Stack** : MERN (MongoDB, Express, React, Node.js)
**Type** : Projet académique full-stack
**Niveau** : Licence / Master

---

**Créé avec ❤️ pour l'apprentissage du développement full-stack**
