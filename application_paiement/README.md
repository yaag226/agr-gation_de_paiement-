# 🇧🇫 PayBF Aggregator - Application d'Agrégation de Paiement

Application complète d'agrégation de paiement pour le Burkina Faso avec support FCFA.

## 🎨 Caractéristiques

- ✅ Authentification JWT
- ✅ 3 rôles : Client, Marchand, Admin
- ✅ Paiements simulés (Orange Money, Moov, Wave, Coris)
- ✅ Tableaux de bord interactifs avec graphiques
- ✅ Design aux couleurs du Burkina Faso 🇧🇫
- ✅ Gestion complète des transactions
- ✅ Statistiques en temps réel

## 🛠️ Stack Technique

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

### Frontend
- React 18 + Vite
- React Router v6
- Axios
- Recharts (graphiques)
- date-fns

## 📦 Installation

### Prérequis
- Node.js 18+
- MongoDB installé et en cours d'exécution

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd application_paiement
```

### 2. Backend
```bash
cd backend
npm install
```

Créer le fichier `.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aggregator_payment_bf
JWT_SECRET=bf_payment_secret_2024_mosshigh_uptime_secure
JWT_EXPIRE=7d
NODE_ENV=development
```

Lancer MongoDB (dans un nouveau terminal) :
```bash
mongod
```

Initialiser la base avec des données de test :
```bash
npm run seed
```

Démarrer le serveur backend :
```bash
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 👤 Comptes de test

### Admin
- **Email**: admin@payment-bf.com
- **Password**: admin123

### Marchands
- **Email**: amadou@boutique.bf | **Password**: merchant123
- **Email**: fatimata@restaurant.bf | **Password**: merchant123
- **Email**: ibrahim@tech.bf | **Password**: merchant123

### Clients
- **Email**: salif@email.com | **Password**: client123
- **Email**: awa@email.com | **Password**: client123

## 🎯 Fonctionnalités par rôle

### 👤 Client
- Effectuer des paiements
- Voir l'historique des transactions
- Consulter les statistiques personnelles
- Rechercher des marchands

### 🏪 Marchand
- Recevoir des paiements
- Tableau de bord avec graphiques
- Filtrer les transactions par date/statut
- Voir les statistiques de revenus

### 👑 Admin
- Vue d'ensemble complète
- Gérer tous les utilisateurs
- Activer/Désactiver des comptes
- Voir toutes les transactions
- Statistiques globales

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Client
- `POST /api/client/payments` - Créer un paiement
- `GET /api/client/payments` - Historique
- `GET /api/client/stats` - Statistiques
- `GET /api/client/merchants` - Liste des marchands

### Merchant
- `GET /api/merchant/payments` - Paiements reçus
- `GET /api/merchant/dashboard` - Tableau de bord
- `GET /api/merchant/stats` - Statistiques

### Admin
- `GET /api/admin/users` - Tous les utilisateurs
- `PATCH /api/admin/users/:id/toggle-status` - Activer/Désactiver
- `GET /api/admin/payments` - Toutes les transactions
- `GET /api/admin/dashboard` - Dashboard complet

## 🎨 Design

Le design utilise les couleurs officielles du Burkina Faso :
- **Rouge** (#EF2B2D) - Primaire
- **Vert** (#009E49) - Succès
- **Jaune** (#FCD116) - Accent

## 📱 Responsive

L'application est entièrement responsive et fonctionne sur :
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (375px+)

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Protection des routes backend
- Validation des données
- Gestion des rôles

## 🚀 Production

Pour déployer en production :

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Les fichiers compilés seront dans `frontend/dist/`

## 📄 License

MIT License - Projet académique

## 👨‍💻 Auteur

**Mosshigh** - Projet académique UPTIME

---

🇧🇫 **Fait avec ❤️ au Burkina Faso**