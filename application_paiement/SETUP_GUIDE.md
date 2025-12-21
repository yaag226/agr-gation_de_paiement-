# Guide de Configuration - Application d'Agrégation de Paiement

## ✅ Statut de Configuration

### Configuration Complétée
- ✅ Dépendances backend installées (431 packages)
- ✅ Dépendances frontend installées (159 packages)
- ✅ Fichier `.env` backend créé et configuré
- ✅ Fichier `.env` frontend créé et configuré

### Prochaines Étapes Requises
- ⏳ Installation et démarrage de MongoDB
- ⏳ Seed de la base de données
- ⏳ Test du serveur backend
- ⏳ Test de l'interface frontend

---

## 📋 Prérequis

### Logiciels Requis
1. **Node.js** v14+ ✅ (Installé)
2. **MongoDB** v4.4+ ⚠️ (À installer)
3. **npm** ✅ (Installé)

---

## 🚀 Installation MongoDB

### Option 1: Installation Locale (Recommandé pour Développement)

#### Ubuntu/Debian
```bash
# Importer la clé GPG MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajouter le repository MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Mettre à jour et installer
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

#### macOS
```bash
# Avec Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Démarrer MongoDB
brew services start mongodb-community@6.0
```

#### Windows
1. Télécharger MongoDB Community Server depuis https://www.mongodb.com/try/download/community
2. Installer en suivant l'assistant
3. MongoDB sera disponible comme service Windows

### Option 2: MongoDB Atlas (Cloud - Gratuit)

1. Créer un compte sur https://www.mongodb.com/cloud/atlas/register
2. Créer un cluster gratuit (M0)
3. Configurer l'accès réseau (Allow access from anywhere: 0.0.0.0/0)
4. Créer un utilisateur de base de données
5. Obtenir la chaîne de connexion

Modifier `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/payment_aggregator?retryWrites=true&w=majority
```

### Option 3: Docker (Rapide pour Tests)

```bash
# Démarrer MongoDB dans un container Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Vérifier que MongoDB est actif
docker ps | grep mongodb
```

---

## 🔧 Configuration du Projet

### 1. Vérifier la Configuration

Les fichiers de configuration ont déjà été créés :

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
JWT_SECRET=9f8e7d6c5b4a3210fedcba0987654321abcdef1234567890payment_aggregator_secret_key
JWT_EXPIRE=7d
...
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Initialiser la Base de Données

```bash
cd /home/user/agr-gation_de_paiement-/application_paiement/backend
npm run seed
```

Cela créera :
- 1 compte administrateur
- 3 comptes marchands avec configurations
- 23 transactions de test

### 3. Démarrer l'Application

#### Terminal 1 - Backend
```bash
cd /home/user/agr-gation_de_paiement-/application_paiement/backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd /home/user/agr-gation_de_paiement-/application_paiement/frontend
npm run dev
```

L'application démarre sur `http://localhost:5173` (Vite)

---

## 🧪 Tests de Vérification

### 1. Vérifier MongoDB
```bash
# Tester la connexion MongoDB
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

### 2. Vérifier le Backend
```bash
# Health check
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

### 3. Vérifier le Frontend
Ouvrir dans le navigateur : `http://localhost:5173`

---

## 📊 Comptes de Test

Une fois la base de données seedée, utilisez ces comptes :

### Admin
- **Email:** admin@payment.com
- **Password:** Admin123!

### Marchands
1. **Tech Store**
   - Email: merchant1@test.com
   - Password: Merchant123!

2. **Fashion Boutique**
   - Email: merchant2@test.com
   - Password: Merchant123!

3. **Eco Products**
   - Email: merchant3@test.com
   - Password: Merchant123!

---

## 🔍 Dépannage

### Erreur: "MongoServerError: connect ECONNREFUSED"
**Cause:** MongoDB n'est pas démarré

**Solution:**
```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community@6.0

# Docker
docker start mongodb
```

### Erreur: "Port 5000 already in use"
**Cause:** Le port 5000 est déjà utilisé

**Solution:** Modifier `backend/.env`
```env
PORT=5001
```

### Erreur: "Cannot find module"
**Cause:** Dépendances non installées

**Solution:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Frontend ne se connecte pas au Backend
**Cause:** URL de l'API incorrecte

**Solution:** Vérifier `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 Scripts npm Disponibles

### Backend
```bash
npm run dev          # Démarrer en mode développement (nodemon)
npm start            # Démarrer en mode production
npm run seed         # Initialiser la base de données
npm test             # Lancer les tests
```

### Frontend
```bash
npm run dev          # Démarrer le serveur de développement Vite
npm run build        # Build pour production
npm run preview      # Preview du build de production
```

---

## 🌐 URLs de l'Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health
- **API Documentation:** Voir API_DOCUMENTATION.md

---

## 📚 Documentation Complémentaire

- `README.md` - Documentation générale du projet
- `API_DOCUMENTATION.md` - Documentation complète des API (21 endpoints)
- `QUICKSTART.md` - Guide de démarrage rapide
- `TEST_DATA.md` - Données et scénarios de test
- `GITHUB_SETUP.md` - Guide pour soumettre sur GitHub
- `FEATURES.md` - Liste complète des fonctionnalités

---

## 🚀 Prêt pour le Développement

Une fois MongoDB installé et démarré, exécutez :

```bash
# Dans le dossier backend
cd /home/user/agr-gation_de_paiement-/application_paiement/backend
npm run seed
npm run dev

# Dans un autre terminal, pour le frontend
cd /home/user/agr-gation_de_paiement-/application_paiement/frontend
npm run dev
```

Puis ouvrez http://localhost:5173 dans votre navigateur.

---

## ✅ Checklist de Démarrage

- [x] Node.js installé
- [x] npm installé
- [x] Dépendances backend installées
- [x] Dépendances frontend installées
- [x] Fichier `.env` backend configuré
- [x] Fichier `.env` frontend configuré
- [ ] MongoDB installé
- [ ] MongoDB démarré
- [ ] Base de données seedée
- [ ] Backend démarré et accessible
- [ ] Frontend démarré et accessible
- [ ] Test de connexion réussi

---

**Date de Configuration:** 21 Décembre 2025
**Statut:** Configuration initiale complète - MongoDB requis pour continuer
