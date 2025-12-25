# 📱 APPLICATION D'AGRÉGATION DE PAIEMENT - GUIDE COMPLET

## 🎯 DESCRIPTION DU PROJET

Application full-stack de paiement simulé permettant de gérer des transactions entre clients, marchands et administrateurs.

**Type** : Projet académique (Licence/Master)
**Fonctionnement** : 100% local avec paiements simulés (mock)

---

## 🛠️ STACK TECHNIQUE

### Backend
- **Runtime** : Node.js v14+
- **Framework** : Express.js
- **Base de données** : MongoDB (local ou MongoDB Compass)
- **ORM** : Mongoose
- **Authentification** : JWT (jsonwebtoken)
- **Sécurité** : bcryptjs, helmet, cors, express-rate-limit
- **Validation** : Joi

### Frontend
- **Framework** : React 18 (avec Vite)
- **Routing** : React Router DOM v6
- **HTTP Client** : Axios
- **Styling** : Tailwind CSS
- **Charts** : Chart.js + react-chartjs-2
- **Icons** : React Icons

---

## 📂 STRUCTURE DU PROJET

```
application_paiement/
├── backend/
│   ├── server.js                    # Point d'entrée
│   ├── src/
│   │   ├── app.js                   # Configuration Express
│   │   ├── config/
│   │   │   ├── constants.js         # Constantes (rôles, providers, etc.)
│   │   │   └── database.js          # Configuration MongoDB
│   │   ├── models/
│   │   │   ├── User.model.js        # Modèle utilisateur
│   │   │   ├── Merchant.model.js    # Modèle marchand
│   │   │   ├── Transaction.model.js # Modèle transaction
│   │   │   └── AggregatedPayment.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── merchant.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   └── aggregation.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── merchant.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   └── aggregation.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # Protection JWT
│   │   │   └── validation.middleware.js
│   │   ├── services/
│   │   │   └── payment.service.js   # Simulation de paiements
│   │   └── utils/
│   │       └── seed.js              # Données de test
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Routes principales
    │   ├── main.jsx                 # Point d'entrée React
    │   ├── context/
    │   │   └── AuthContext.jsx      # Context d'authentification
    │   ├── components/
    │   │   └── Layout.jsx           # Layout avec navigation
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx        # Dashboard marchand
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ClientDashboard.jsx
    │   │   ├── ClientPayment.jsx    # Page de paiement client
    │   │   ├── Transactions.jsx
    │   │   ├── Analytics.jsx
    │   │   ├── Settings.jsx
    │   │   ├── AggregatedPayment.jsx
    │   │   └── AggregationHistory.jsx
    │   ├── services/
    │   │   └── api.js               # Configuration Axios
    │   └── utils/
    │       └── currencyFormatter.js
    └── package.json
```

---

## 👥 TYPES D'UTILISATEURS ET RÔLES

### 1️⃣ **CLIENT (Customer)**
- Effectue des paiements simulés
- Consulte son historique de transactions
- Choisit le marchand et le moyen de paiement

### 2️⃣ **MARCHAND (Merchant)**
- Reçoit les paiements
- Consulte ses transactions
- Visualise ses statistiques (revenue, nombre de transactions)
- Configure ses moyens de paiement

### 3️⃣ **ADMINISTRATEUR (Admin)**
- Gère tous les utilisateurs
- Supervise toutes les transactions
- Active/désactive les marchands
- Accède aux statistiques globales

---

## 🔌 API REST - DOCUMENTATION COMPLÈTE

### Base URL
```
http://localhost:5000/api
```

---

### 🔐 AUTHENTIFICATION (`/api/auth`)

#### 1. Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // "customer" | "merchant" | "admin"
}

Response 201:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### 2. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

#### 3. Profil utilisateur (protégé)
```http
GET /api/auth/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": { "user": { ... } }
}
```

#### 4. Mise à jour du profil
```http
PUT /api/auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+226 70 12 34 56"
}
```

#### 5. Changement de mot de passe
```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

### 💳 PAIEMENTS (`/api/payment`)

#### 1. Effectuer un paiement (PUBLIC - Client)
```http
POST /api/payment/payer
Content-Type: application/json

{
  "amount": 5000,
  "paymentMethod": "orange_money",
  "customerPhone": "+226 70 12 34 56",
  "customerEmail": "client@example.com",
  "customerName": "Client Test",
  "description": "Achat de produit",
  "merchantId": "merchant_id_here"
}

Response 201:
{
  "success": true,
  "message": "✅ Paiement réussi !",
  "data": {
    "transactionId": "TXN_1234567890_ABCDEF",
    "amount": 5000,
    "currency": "XOF",
    "status": "completed",
    "paymentMethod": "orange_money",
    "provider": "orange_money",
    "reference": "OM-1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Moyens de paiement disponibles** :
- `orange_money` (Orange Money)
- `mtn_money` (MTN Mobile Money)
- `moov_money` (Moov Money)
- `coris_bank` (Coris Bank)
- `ecobank` (Ecobank)

#### 2. Historique des transactions d'un client
```http
GET /api/payment/historique?phone=+22670123456&limit=20&page=1

Response 200:
{
  "success": true,
  "count": 15,
  "totalPages": 1,
  "currentPage": 1,
  "data": {
    "transactions": [ ... ]
  }
}
```

---

### 🏪 MARCHANDS (`/api/merchants`)

#### 1. Liste des marchands (Admin uniquement)
```http
GET /api/merchants
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "data": [ ... ]
}
```

#### 2. Statistiques du marchand
```http
GET /api/merchants/stats
Authorization: Bearer {merchant_token}

Response 200:
{
  "success": true,
  "data": {
    "totalTransactions": 150,
    "totalRevenue": 750000,
    "balance": 745000,
    "activeProviders": [ "orange_money", "mtn_money" ]
  }
}
```

#### 3. Récupérer un marchand
```http
GET /api/merchants/:id
Authorization: Bearer {token}
```

#### 4. Mettre à jour un marchand
```http
PUT /api/merchants/:id
Authorization: Bearer {merchant_token}
Content-Type: application/json

{
  "businessName": "Ma Boutique",
  "description": "Vente de produits",
  "website": "https://maboutique.bf"
}
```

#### 5. Ajouter une config provider
```http
POST /api/merchants/provider-config
Authorization: Bearer {merchant_token}
Content-Type: application/json

{
  "provider": "orange_money",
  "apiKey": "test_api_key",
  "secretKey": "test_secret",
  "isActive": true
}
```

---

### 📊 TRANSACTIONS (`/api/transactions`)

#### 1. Liste des transactions (selon le rôle)
```http
GET /api/transactions?status=completed&limit=50&page=1
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "count": 45,
  "data": {
    "transactions": [ ... ]
  }
}
```

#### 2. Détails d'une transaction
```http
GET /api/transactions/:id
Authorization: Bearer {token}
```

#### 3. Statistiques des transactions (Merchant)
```http
GET /api/transactions/stats
Authorization: Bearer {merchant_token}

Response 200:
{
  "success": true,
  "data": {
    "totalTransactions": 150,
    "completedTransactions": 140,
    "failedTransactions": 10,
    "totalRevenue": 750000,
    "avgTransactionAmount": 5000
  }
}
```

---

### 📈 ANALYTICS (`/api/analytics`)

#### 1. Dashboard Analytics (Merchant)
```http
GET /api/analytics/dashboard?period=7d
Authorization: Bearer {merchant_token}

Response 200:
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 750000,
      "totalTransactions": 150,
      "avgTransactionValue": 5000,
      "successRate": 93.33
    },
    "revenueByDay": [ ... ],
    "transactionsByProvider": [ ... ],
    "topCustomers": [ ... ]
  }
}
```

#### 2. Rapport de revenue
```http
GET /api/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {merchant_token}
```

---

### 👨‍💼 ADMIN (`/api/admin`)

#### 1. Statistiques globales
```http
GET /api/admin/stats
Authorization: Bearer {admin_token}

Response 200:
{
  "success": true,
  "data": {
    "totalUsers": 45,
    "totalMerchants": 10,
    "totalTransactions": 500,
    "totalRevenue": 2500000,
    "recentTransactions": [ ... ]
  }
}
```

#### 2. Liste des utilisateurs
```http
GET /api/admin/users?role=merchant&page=1&limit=20
Authorization: Bearer {admin_token}
```

#### 3. Détails d'un utilisateur
```http
GET /api/admin/users/:id
Authorization: Bearer {admin_token}
```

#### 4. Mettre à jour un utilisateur
```http
PUT /api/admin/users/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "isActive": false
}
```

#### 5. Supprimer un utilisateur
```http
DELETE /api/admin/users/:id
Authorization: Bearer {admin_token}
```

#### 6. Vérifier un marchand
```http
POST /api/admin/merchants/:id/verify
Authorization: Bearer {admin_token}
```

#### 7. Activer/Désactiver un marchand
```http
POST /api/admin/merchants/:id/toggle-status
Authorization: Bearer {admin_token}
```

---

### 🔗 AGRÉGATION (`/api/aggregation`)

Routes pour gérer les paiements groupés et l'agrégation.

---

## ⚙️ INSTALLATION ET LANCEMENT

### 1. Prérequis
```bash
# Vérifier les versions
node --version  # v14 ou supérieur
npm --version   # v6 ou supérieur
mongod --version  # MongoDB installé et lancé
```

### 2. Installation
```bash
# Depuis la racine du projet
cd application_paiement

# Installer toutes les dépendances
npm run install:all

# OU installer séparément
npm run install:backend
npm run install:frontend
```

### 3. Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Éditer `backend/.env` :
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/payment_aggregator

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_ici
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Limits
MAX_TRANSACTION_AMOUNT=1000000
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Éditer `frontend/.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Lancer MongoDB
```bash
# Dans un terminal séparé
mongod
# OU si MongoDB est un service
sudo systemctl start mongod
```

### 5. Seed (Données de test)
```bash
cd backend
npm run seed
```

Cela va créer :
- 1 Admin : `admin@example.com` / `password123`
- 1 Marchand : `merchant@example.com` / `password123`
- 1 Client : `customer@example.com` / `password123`
- Quelques transactions de test

### 6. Lancer l'application

#### Option A : En développement (2 terminaux)
```bash
# Terminal 1 - Backend
cd application_paiement
npm run dev:backend

# Terminal 2 - Frontend
cd application_paiement
npm run dev:frontend
```

#### Option B : Depuis la racine (package.json global)
```bash
# Backend
npm run dev:backend

# Frontend (nouveau terminal)
npm run dev:frontend
```

### 7. Accéder à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Health Check** : http://localhost:5000/health

---

## 🎮 UTILISATION DE L'APPLICATION

### Pour le CLIENT

#### Via l'interface web
1. Aller sur http://localhost:3000/client/payer
2. Remplir le formulaire :
   - Montant (ex: 5000 XOF)
   - Moyen de paiement (Orange Money, MTN, etc.)
   - Téléphone
   - Email (optionnel)
   - Nom (optionnel)
3. Cliquer sur "Payer"
4. Le paiement est simulé (70% succès, 30% échec)

#### Voir l'historique
1. Aller sur http://localhost:3000/client/dashboard
2. Entrer votre numéro de téléphone
3. Voir toutes vos transactions

### Pour le MARCHAND

1. **Connexion** : http://localhost:3000/login
   - Email : `merchant@example.com`
   - Mot de passe : `password123`

2. **Dashboard** : Voir les statistiques
   - Total des revenus
   - Nombre de transactions
   - Graphiques

3. **Transactions** : Menu "Transactions"
   - Liste complète
   - Filtres par statut
   - Détails de chaque transaction

4. **Analytics** : Menu "Analytics"
   - Revenus par jour
   - Transactions par provider
   - Top clients

5. **Settings** : Menu "Settings"
   - Modifier le profil
   - Configurer les providers

### Pour l'ADMIN

1. **Connexion** : http://localhost:3000/login
   - Email : `admin@example.com`
   - Mot de passe : `password123`

2. **Dashboard Admin** : http://localhost:3000/admin/dashboard
   - Statistiques globales
   - Liste des utilisateurs
   - Liste des marchands
   - Toutes les transactions

3. **Gestion des utilisateurs**
   - Voir tous les utilisateurs
   - Activer/Désactiver
   - Supprimer

4. **Gestion des marchands**
   - Vérifier les marchands
   - Activer/Désactiver
   - Voir les détails

---

## 🧪 TESTS VIA API (Postman/cURL)

### 1. Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 2. Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Paiement
```bash
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670123456",
    "customerEmail": "client@test.bf",
    "customerName": "Client Test",
    "description": "Test de paiement"
  }'
```

---

## 📊 SIMULATION DES PAIEMENTS

Le système simule les paiements avec :
- **70% de succès** (status: `completed`)
- **30% d'échec** (status: `failed`)

Chaque paiement génère :
- Un ID unique de transaction
- Une référence provider
- Des commissions calculées automatiquement
- Un montant net pour le marchand

---

## 🔒 SÉCURITÉ

- **Hashage des mots de passe** : bcryptjs (12 rounds)
- **JWT** : Tokens sécurisés avec expiration
- **Helmet** : Protection des headers HTTP
- **CORS** : Configuration stricte
- **Rate Limiting** : 100 requêtes / 15 min
- **Mongo Sanitize** : Protection contre les injections NoSQL
- **Validation** : Joi pour toutes les entrées

---

## 🎨 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Authentification
- [x] Inscription avec rôles
- [x] Connexion JWT
- [x] Protection des routes
- [x] Gestion du profil
- [x] Changement de mot de passe

### ✅ Client
- [x] Effectuer des paiements simulés
- [x] Choisir le moyen de paiement
- [x] Consulter l'historique
- [x] Voir le statut des paiements

### ✅ Marchand
- [x] Dashboard avec statistiques
- [x] Liste des transactions
- [x] Revenus totaux
- [x] Analytics avancés
- [x] Configuration des providers
- [x] Graphiques (Chart.js)

### ✅ Admin
- [x] Dashboard global
- [x] Gestion des utilisateurs
- [x] Gestion des marchands
- [x] Vérification des marchands
- [x] Activation/Désactivation
- [x] Vue de toutes les transactions
- [x] Statistiques globales

### ✅ Transactions
- [x] Création automatique
- [x] Calcul des commissions
- [x] Statuts (pending, completed, failed, refunded)
- [x] Historique complet
- [x] Filtrage et pagination

### ✅ Paiements simulés
- [x] Orange Money
- [x] MTN Money
- [x] Moov Money
- [x] Coris Bank
- [x] Ecobank
- [x] Simulation réaliste (70% succès)

---

## 🐛 DÉBOGAGE

### Backend ne démarre pas
```bash
# Vérifier MongoDB
sudo systemctl status mongod

# Vérifier le port
lsof -i :5000

# Logs
cd backend
npm run dev
```

### Frontend ne démarre pas
```bash
# Vérifier les dépendances
cd frontend
npm install

# Vérifier .env
cat .env

# Lancer en mode dev
npm run dev
```

### Erreurs de connexion
- Vérifier que MongoDB tourne
- Vérifier le MONGODB_URI dans .env
- Vérifier que le backend écoute sur le bon port

---

## 📝 SCRIPTS DISPONIBLES

### Racine (`application_paiement/`)
```bash
npm run install:all      # Installer toutes les dépendances
npm run install:backend  # Installer backend uniquement
npm run install:frontend # Installer frontend uniquement
npm run dev:backend      # Lancer backend en dev
npm run dev:frontend     # Lancer frontend en dev
npm run seed             # Générer données de test
npm run clean            # Nettoyer node_modules
```

### Backend
```bash
npm start      # Production
npm run dev    # Développement (nodemon)
npm run seed   # Seed database
npm test       # Tests (Jest)
```

### Frontend
```bash
npm run dev      # Développement (Vite)
npm run build    # Build production
npm run preview  # Prévisualiser le build
```

---

## 🎓 PRÉSENTATION DU PROJET

### Points clés à mentionner :

1. **Architecture MVC** : Séparation claire des responsabilités
2. **Sécurité** : JWT, bcrypt, validation, rate limiting
3. **Simulation réaliste** : Paiements simulés avec succès/échec aléatoire
4. **3 rôles distincts** : Client, Marchand, Admin
5. **API REST complète** : CRUD, analytics, gestion
6. **Interface moderne** : React + Tailwind CSS
7. **Graphiques** : Visualisation avec Chart.js
8. **Gestion des commissions** : Calcul automatique
9. **Pagination** : Gestion efficace des grandes listes
10. **Responsive** : Fonctionne sur mobile et desktop

---

## 📚 RESSOURCES

- **MongoDB** : https://www.mongodb.com/docs/
- **Express** : https://expressjs.com/
- **React** : https://react.dev/
- **Vite** : https://vitejs.dev/
- **Tailwind CSS** : https://tailwindcss.com/
- **JWT** : https://jwt.io/

---

## 👨‍💻 AUTEUR

Projet académique pour l'apprentissage du développement full-stack JavaScript.

**Stack** : MERN (MongoDB, Express, React, Node.js)

---

## 📄 LICENCE

MIT License - Projet à but éducatif uniquement.

---

## 🚀 AMÉLIORATIONS FUTURES (Optionnel)

- [ ] Tests unitaires et d'intégration
- [ ] Webhooks pour notifications
- [ ] Export PDF des factures
- [ ] Remboursements
- [ ] Multi-devises
- [ ] 2FA (authentification à deux facteurs)
- [ ] Logs système
- [ ] Dashboard temps réel (WebSocket)

---

**Bonne chance pour ta présentation ! 🎉**
