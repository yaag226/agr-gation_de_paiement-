# Application d'Agrégation de Paiement

Une application complète d'agrégation de paiement permettant aux marchands d'accepter des paiements via plusieurs providers (Stripe, PayPal, Wave, etc.) avec un système de routage intelligent et de gestion des commissions.

## Fonctionnalités

### 1. Authentification & Autorisation
- Inscription et connexion des utilisateurs
- Gestion des rôles (Admin, Merchant, Customer)
- Authentification JWT sécurisée
- Gestion de session

### 2. Gestion des Marchands
- Enregistrement et profil des marchands
- Configuration des méthodes de paiement
- Gestion des clés API pour chaque provider
- Tableau de bord personnalisé

### 3. Agrégation de Paiement
- Support multi-providers (Stripe, PayPal, Wave)
- Routage intelligent basé sur les règles métier
- Gestion automatique des commissions
- Fallback automatique en cas d'échec

### 4. Gestion des Transactions
- Initiation de paiement
- Suivi en temps réel du statut
- Historique complet des transactions
- Webhooks pour notifications
- Remboursements

### 5. Rapports & Analytics
- Statistiques de revenus par période
- Analyse par provider
- Export de données (CSV, PDF)
- Graphiques et visualisations

## Architecture

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── config/          # Configuration (DB, env, constants)
│   ├── controllers/     # Contrôleurs API
│   ├── middlewares/     # Middlewares (auth, validation)
│   ├── models/          # Modèles MongoDB (Mongoose)
│   ├── routes/          # Routes API
│   ├── services/        # Logique métier
│   ├── utils/           # Utilitaires
│   └── app.js           # Configuration Express
├── tests/               # Tests unitaires et d'intégration
└── server.js            # Point d'entrée
```

### Frontend (React)
```
frontend/
├── public/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services API
│   ├── context/         # Context API (état global)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilitaires
│   └── App.js           # Composant principal
└── package.json
```

## Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe
- **Joi** - Validation des données
- **dotenv** - Variables d'environnement

### Frontend
- **React** - Library UI
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Chart.js** - Graphiques
- **Tailwind CSS** - Styling

## Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)
- npm ou yarn

### Étapes d'installation

#### 1. Cloner le repository
```bash
git clone <url-du-repo>
cd application_paiement
```

#### 2. Installation du Backend
```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier backend :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d

# Provider API Keys (pour tests)
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

#### 3. Installation du Frontend
```bash
cd ../frontend
npm install
```

Créer un fichier `.env` dans le dossier frontend :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Démarrage de l'application

### 1. Démarrer MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 2. Démarrer le Backend
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:5000`

### 3. Démarrer le Frontend
```bash
cd frontend
npm start
```
L'application démarre sur `http://localhost:3000`

## Données de Test

### Importer les données de test
```bash
cd backend
npm run seed
```

Cela créera automatiquement :
- 1 utilisateur admin
- 3 marchands avec leurs configurations
- Des transactions de test

### Comptes de test

**Admin**
- Email: admin@payment.com
- Password: Admin123!

**Merchant 1**
- Email: merchant1@test.com
- Password: Merchant123!

**Merchant 2**
- Email: merchant2@test.com
- Password: Merchant123!

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion
GET    /api/auth/me                - Profil utilisateur
PUT    /api/auth/update-profile    - Mise à jour profil
```

### Merchants
```
GET    /api/merchants              - Liste des marchands (Admin)
GET    /api/merchants/:id          - Détails marchand
PUT    /api/merchants/:id          - Mise à jour marchand
POST   /api/merchants/config       - Configuration provider
GET    /api/merchants/stats        - Statistiques marchand
```

### Transactions
```
POST   /api/transactions/initiate  - Initier un paiement
GET    /api/transactions           - Liste des transactions
GET    /api/transactions/:id       - Détails transaction
POST   /api/transactions/:id/refund - Remboursement
POST   /api/webhooks/:provider     - Webhooks providers
```

### Analytics
```
GET    /api/analytics/revenue      - Revenus par période
GET    /api/analytics/providers    - Stats par provider
GET    /api/analytics/export       - Export données
```

## Tests

### Tests Backend
```bash
cd backend
npm test
```

### Tests Frontend
```bash
cd frontend
npm test
```

## Test de l'Application

### Scénario de test complet

1. **Inscription et Connexion**
   - Créer un compte marchand
   - Se connecter avec les credentials

2. **Configuration Provider**
   - Aller dans Settings
   - Configurer au moins un provider (Stripe en test mode)
   - Activer le provider

3. **Créer une Transaction**
   - Utiliser l'API ou l'interface de test
   - Initier un paiement de 100 EUR
   - Vérifier le statut en temps réel

4. **Consulter les Rapports**
   - Aller dans Dashboard
   - Voir les statistiques
   - Exporter un rapport

### Tester avec cURL

**Inscription**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Merchant",
    "email": "test@merchant.com",
    "password": "Test123!",
    "role": "merchant"
  }'
```

**Initier un paiement**
```bash
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100,
    "currency": "EUR",
    "provider": "stripe",
    "customerEmail": "customer@test.com"
  }'
```

## Structure de la Base de Données

### Collections MongoDB

**users**
- Utilisateurs (Admin, Merchant, Customer)
- Authentification et profils

**merchants**
- Informations marchands
- Configuration providers
- Clés API

**transactions**
- Toutes les transactions
- Statut et historique
- Références providers

**commissions**
- Règles de commission
- Calculs automatiques

## Sécurité

- Mots de passe hachés avec bcrypt
- JWT pour l'authentification
- Validation des entrées avec Joi
- Protection CORS
- Rate limiting sur les APIs
- Clés API chiffrées en base

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

MIT License

## Contact

Pour toute question : votre-email@example.com
