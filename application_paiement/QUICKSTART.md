# Guide de Démarrage Rapide - Application d'Agrégation de Paiement

## Installation rapide (5 minutes)

### Prérequis
- Node.js v14+ installé
- MongoDB installé et en cours d'exécution
- Git (optionnel)

### Étape 1 : Configuration du Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Ouvrir `.env` et configurer :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
JWT_SECRET=votre_secret_super_securise_changez_moi
JWT_EXPIRE=7d
```

### Étape 2 : Configuration du Frontend

```bash
# Dans un nouveau terminal, naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Le fichier `.env` du frontend :
```env
VITE_API_URL=http://localhost:5000/api
```

### Étape 3 : Démarrer MongoDB

**Windows :**
```bash
net start MongoDB
```

**Linux/Mac :**
```bash
sudo systemctl start mongod
# ou
mongod
```

### Étape 4 : Initialiser la base de données avec des données de test

```bash
# Dans le dossier backend
cd backend
npm run seed
```

Cela créera :
- 1 compte admin
- 3 comptes marchands avec configurations
- 23 transactions de test

### Étape 5 : Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:5000`

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```
L'application démarre sur `http://localhost:3000`

---

## Comptes de Test

### Admin
- **Email:** admin@payment.com
- **Password:** Admin123!
- **Accès:** Tous les marchands, toutes les fonctionnalités

### Marchands

**Merchant 1 - Tech Store**
- **Email:** merchant1@test.com
- **Password:** Merchant123!
- **Providers:** Stripe, PayPal (actifs)
- **Données:** 15 transactions de test

**Merchant 2 - Fashion Boutique**
- **Email:** merchant2@test.com
- **Password:** Merchant123!
- **Providers:** Stripe (actif)
- **Données:** 8 transactions de test

**Merchant 3 - Eco Products**
- **Email:** merchant3@test.com
- **Password:** Merchant123!
- **Providers:** Wave (actif)
- **Statut:** Non vérifié

---

## Test de l'Application (5 minutes)

### 1. Connexion
1. Ouvrir `http://localhost:3000`
2. Se connecter avec `merchant1@test.com` / `Merchant123!`
3. Vous verrez le dashboard avec les statistiques

### 2. Voir les Transactions
1. Cliquer sur "Transactions" dans le menu
2. Filtrer par statut ou provider
3. Voir les détails des transactions

### 3. Configurer un Provider
1. Aller dans "Paramètres"
2. Cliquer sur "Ajouter un provider"
3. Sélectionner un provider et remplir les informations :
   - **Pour tests Stripe:**
     - API Key: `pk_test_51234567890`
     - Secret Key: `sk_test_51234567890`
   - Activer le provider
4. Cliquer sur "Ajouter"

### 4. Créer une Transaction Test
1. Dans "Paramètres", section "Test de paiement"
2. Remplir :
   - Montant: 100
   - Devise: EUR
   - Email client: test@example.com
3. Cliquer sur "Initier un paiement test"
4. Vérifier la nouvelle transaction dans l'onglet "Transactions"

### 5. Voir les Analytics
1. Cliquer sur "Analytics"
2. Voir les statistiques par période
3. Voir les performances par provider

---

## Test avec l'API directement

### 1. Login et obtenir un token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

Copier le `token` de la réponse.

### 2. Créer une transaction
```bash
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "amount": 150.50,
    "currency": "EUR",
    "customerEmail": "client@example.com",
    "customerName": "John Doe",
    "description": "Test payment via API"
  }'
```

### 3. Obtenir les statistiques
```bash
curl -X GET http://localhost:5000/api/merchants/stats \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 4. Lister les transactions
```bash
curl -X GET "http://localhost:5000/api/transactions?status=completed" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## Fonctionnalités Principales

### ✅ Authentification
- Inscription et connexion sécurisées
- Gestion des rôles (Admin, Merchant, Customer)
- JWT tokens avec expiration

### ✅ Gestion des Marchands
- Profil complet avec informations business
- Configuration multi-providers
- Vérification et activation de compte

### ✅ Agrégation de Paiement
- Support de 3 providers : Stripe, PayPal, Wave
- Routage automatique ou manuel
- Calcul automatique des commissions
- Fallback en cas d'échec

### ✅ Transactions
- Initiation de paiement
- Suivi en temps réel
- Historique complet
- Filtrage avancé
- Remboursements

### ✅ Analytics & Rapports
- Dashboard en temps réel
- Statistiques par période
- Performance par provider
- Export de données (JSON, CSV)

---

## Structure des Dossiers

```
application_paiement/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration DB, constants
│   │   ├── controllers/     # Logique des endpoints
│   │   ├── middlewares/     # Auth, validation
│   │   ├── models/          # Schémas MongoDB
│   │   ├── routes/          # Définition des routes
│   │   ├── services/        # Services métier (payment)
│   │   └── utils/           # Utilitaires (seed)
│   ├── .env                 # Configuration environnement
│   ├── package.json
│   └── server.js            # Point d'entrée
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # Context API (Auth)
│   │   ├── pages/           # Pages de l'app
│   │   ├── services/        # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                 # Configuration frontend
│   └── package.json
│
├── API_DOCUMENTATION.md     # Doc complète API
├── README.md                # Documentation générale
└── QUICKSTART.md           # Ce fichier
```

---

## Endpoints API Principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Inscription |
| `/api/auth/login` | POST | Connexion |
| `/api/auth/me` | GET | Profil utilisateur |
| `/api/merchants/stats` | GET | Stats marchand |
| `/api/merchants/provider-config` | POST | Ajouter provider |
| `/api/transactions/initiate` | POST | Créer transaction |
| `/api/transactions` | GET | Liste transactions |
| `/api/analytics/dashboard` | GET | Dashboard |
| `/api/analytics/revenue` | GET | Revenus |

Voir `API_DOCUMENTATION.md` pour la documentation complète.

---

## Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier si MongoDB est installé
mongod --version

# Créer le dossier data si nécessaire
mkdir -p /data/db

# Démarrer MongoDB manuellement
mongod
```

### Port 5000 déjà utilisé
Changer le port dans `backend/.env` :
```env
PORT=5001
```

### Erreur CORS
Vérifier que le frontend est bien configuré pour pointer vers le backend dans `.env`

### Token invalide
Se reconnecter pour obtenir un nouveau token JWT

---

## Prochaines Étapes

1. **Intégration réelle des providers**
   - Configurer vos vraies clés API Stripe
   - Ajouter PayPal et Wave avec leurs credentials

2. **Webhooks**
   - Configurer les webhooks sur les dashboards des providers
   - Pointer vers : `http://your-domain/api/transactions/webhooks/stripe`

3. **Déploiement**
   - Backend : Heroku, DigitalOcean, AWS
   - Frontend : Vercel, Netlify, AWS S3
   - Database : MongoDB Atlas

4. **Sécurité**
   - Activer HTTPS
   - Configurer rate limiting production
   - Auditer les dépendances

---

## Support

Pour toute question :
- Consulter `README.md` pour la documentation complète
- Consulter `API_DOCUMENTATION.md` pour les détails API
- Ouvrir une issue sur GitHub

---

**Bon développement !** 🚀
