# 🚀 Guide de Démarrage Rapide - PayBF

## Installation et Lancement en 5 Minutes

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ **Node.js** v16+ ([Télécharger](https://nodejs.org/))
- ✅ **MongoDB** v5+ ([Télécharger](https://www.mongodb.com/try/download/community))
- ✅ **npm** v8+ (inclus avec Node.js)
- ✅ **Git** pour cloner le projet

---

## Étape 1 : Cloner le projet (30 secondes)

```bash
# Cloner le repository
git clone <URL_DU_REPO>

# Accéder au dossier
cd application_paiement
```

---

## Étape 2 : Installation automatique (2 minutes)

### Option A : Script automatique (Recommandé)

**Sur Linux/macOS :**
```bash
chmod +x setup.sh
./setup.sh
```

**Sur Windows :**
```bash
setup.bat
```

Ce script va :
- ✅ Installer toutes les dépendances backend
- ✅ Installer toutes les dépendances frontend
- ✅ Créer les fichiers `.env` avec les configurations par défaut
- ✅ Vérifier que MongoDB est installé

### Option B : Installation manuelle

```bash
# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install

# Retour à la racine
cd ..
```

---

## Étape 3 : Démarrer MongoDB (30 secondes)

**Sur Linux/macOS :**
```bash
sudo systemctl start mongod
```

**Sur Windows :**
```bash
net start MongoDB
```

**Sur macOS (avec Homebrew) :**
```bash
brew services start mongodb-community
```

**Vérifier que MongoDB fonctionne :**
```bash
# Devrait afficher la version de MongoDB
mongod --version
```

---

## Étape 4 : Initialiser les données de test (30 secondes)

```bash
cd backend
npm run seed
```

**Résultat attendu :**
```
🌱 Seeding database...
✅ Database cleared
✅ 1 Admin created
✅ 3 Clients created
✅ 3 Merchants created
✅ 15 Payments created
✅ Seeding completed successfully!
```

---

## Étape 5 : Démarrer l'application (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

**Résultat attendu :**
```
🚀 Server running on port 5000 in development mode
📍 API available at http://localhost:5000/api
✅ MongoDB Connected: localhost
```

### Terminal 2 - Frontend

**Ouvrir un nouveau terminal**

```bash
cd frontend
npm run dev
```

**Résultat attendu :**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Étape 6 : Tester l'application (2 minutes)

### Ouvrir l'application

Dans votre navigateur, accédez à : **http://localhost:5173**

### Comptes de test disponibles

#### 👑 Administrateur
```
Email: admin@payment-bf.com
Mot de passe: admin123
```
**Ce que vous pouvez faire :**
- Voir tous les utilisateurs
- Activer/Désactiver des comptes
- Voir toutes les transactions
- Consulter les statistiques globales

#### 👤 Client 1
```
Email: salif@email.com
Mot de passe: client123
```
**Ce que vous pouvez faire :**
- Effectuer des paiements
- Voir votre historique
- Consulter vos statistiques

#### 👤 Client 2
```
Email: awa@email.com
Mot de passe: client123
```

#### 👤 Client 3
```
Email: moussa@email.com
Mot de passe: client123
```

#### 🏪 Marchand 1 - Restaurant Le Palmier
```
Email: amadou@boutique.bf
Mot de passe: merchant123
```
**Ce que vous pouvez faire :**
- Voir les paiements reçus
- Consulter le tableau de bord
- Voir les statistiques de revenus

#### 🏪 Marchand 2 - Boutique Fashion
```
Email: fatimata@restaurant.bf
Mot de passe: merchant123
```

#### 🏪 Marchand 3 - Supermarché du Centre
```
Email: ibrahim@tech.bf
Mot de passe: merchant123
```

---

## Test rapide du flux complet

### 1. Connexion Client (1 min)

1. Ouvrir http://localhost:5173
2. Se connecter avec `salif@email.com` / `client123`
3. Vous verrez le tableau de bord client avec :
   - Total dépensé
   - Nombre de transactions
   - Graphiques de vos dépenses

### 2. Effectuer un paiement (1 min)

1. Cliquer sur "Nouveau paiement" dans le menu
2. Sélectionner un marchand : **Restaurant Le Palmier**
3. Entrer un montant : **5000 FCFA**
4. Choisir la méthode : **Orange Money**
5. Description (optionnel) : **Test de paiement**
6. Cliquer sur **"Payer"**
7. Attendre 1-3 secondes (simulation)
8. Voir le résultat (90% de chance de succès)

### 3. Vérifier côté Marchand (1 min)

1. Se déconnecter
2. Se connecter avec `amadou@boutique.bf` / `merchant123`
3. Voir le paiement reçu dans "Paiements reçus"
4. Consulter le tableau de bord mis à jour

### 4. Vérifier côté Admin (1 min)

1. Se déconnecter
2. Se connecter avec `admin@payment-bf.com` / `admin123`
3. Voir la transaction dans "Transactions"
4. Consulter les statistiques globales
5. Tester la désactivation d'un compte client

---

## Méthodes de paiement disponibles

| Méthode | Type | Frais | Taux de succès |
|---------|------|-------|----------------|
| **Orange Money** | Mobile Money | 2.5% | ~90% |
| **Moov Money** | Mobile Money | 2.5% | ~90% |
| **Coris Money** | Mobile Money | 2.5% | ~90% |
| **Carte Bancaire** | Card | 2.5% | ~90% |

---

## URLs importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interface utilisateur |
| **API Backend** | http://localhost:5000/api | API REST |
| **Health Check** | http://localhost:5000/health | État du serveur |
| **MongoDB** | mongodb://localhost:27017 | Base de données |

---

## Commandes utiles

### Backend

```bash
cd backend

# Démarrer en mode développement (auto-reload)
npm run dev

# Démarrer en mode production
npm start

# Réinitialiser les données de test
npm run seed

# Arrêter le serveur
Ctrl + C
```

### Frontend

```bash
cd frontend

# Démarrer le serveur de développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Arrêter le serveur
Ctrl + C
```

### MongoDB

```bash
# Démarrer MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
net start MongoDB  # Windows

# Arrêter MongoDB
sudo systemctl stop mongod  # Linux
brew services stop mongodb-community  # macOS
net stop MongoDB  # Windows

# Statut de MongoDB
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Se connecter à MongoDB avec Mongo Shell
mongosh

# Voir les bases de données
show dbs

# Utiliser la base de données du projet
use payment_aggregator

# Voir les collections
show collections

# Voir tous les utilisateurs
db.users.find().pretty()

# Voir tous les paiements
db.payments.find().pretty()
```

---

## Résolution des problèmes courants

### ❌ Problème : "MongoDB connection failed"

**Solution :**
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Si MongoDB n'est pas démarré
sudo systemctl start mongod

# Vérifier que MongoDB écoute sur le bon port
netstat -an | grep 27017
```

### ❌ Problème : "Port 5000 already in use"

**Solution :**
```bash
# Trouver le processus qui utilise le port 5000
lsof -i :5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows

# Tuer le processus
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Ou changer le port dans backend/.env
PORT=5001
```

### ❌ Problème : "Port 5173 already in use"

**Solution :**
```bash
# Tuer le processus sur le port 5173
lsof -i :5173  # Linux/macOS
kill -9 <PID>

# Ou Vite vous proposera automatiquement le port suivant
```

### ❌ Problème : "Cannot find module"

**Solution :**
```bash
# Réinstaller les dépendances
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Problème : "CORS error" dans le navigateur

**Solution :**
Vérifier que :
1. Le backend tourne sur le port 5000
2. Le frontend tourne sur le port 5173
3. Le fichier `frontend/.env` contient :
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### ❌ Problème : "Token expired"

**Solution :**
```javascript
// Se déconnecter et se reconnecter
// Les tokens expirent après 7 jours
```

---

## Tests avec cURL

### Health Check
```bash
curl http://localhost:5000/health
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salif@email.com",
    "password": "client123"
  }'
```

**Copier le token retourné pour les prochaines requêtes**

### Créer un paiement
```bash
# Remplacer YOUR_TOKEN et MERCHANT_ID
curl -X POST http://localhost:5000/api/client/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "merchantId": "MERCHANT_ID",
    "amount": 5000,
    "paymentMethod": "Orange Money",
    "description": "Test paiement cURL"
  }'
```

---

## Prochaines étapes

### Pour développer

1. Lire la documentation complète : `README.md`
2. Consulter la liste des fonctionnalités : `FONCTIONNALITES.md`
3. Explorer la documentation des API : `API.md`
4. Étudier la structure du code dans `/backend/src` et `/frontend/src`

### Pour tester

1. Tester tous les rôles (client, merchant, admin)
2. Effectuer des paiements avec différentes méthodes
3. Utiliser les filtres et la recherche
4. Tester l'activation/désactivation de comptes (admin)
5. Consulter les différents graphiques

### Pour personnaliser

1. Modifier les couleurs dans `frontend/src/index.css`
2. Ajuster les frais de transaction dans `backend/src/utils/paymentSimulator.js`
3. Changer le taux de succès de la simulation (ligne ~15)
4. Ajouter de nouvelles méthodes de paiement
5. Créer vos propres graphiques avec Recharts

---

## Arrêter l'application

1. Dans le terminal du backend : `Ctrl + C`
2. Dans le terminal du frontend : `Ctrl + C`
3. Optionnel - Arrêter MongoDB :
   ```bash
   sudo systemctl stop mongod  # Linux
   brew services stop mongodb-community  # macOS
   net stop MongoDB  # Windows
   ```

---

## Support et Documentation

- 📖 **README complet** : `README.md`
- 📋 **Liste des fonctionnalités** : `FONCTIONNALITES.md`
- 🔌 **Documentation API** : `API.md`
- 🌐 **Frontend** : http://localhost:5173
- 🔧 **API** : http://localhost:5000/api
- ❤️ **Health Check** : http://localhost:5000/health

---

**🇧🇫 Bonne découverte de PayBF !**

**Version :** 1.0.0
**Temps d'installation :** ~5 minutes
**Niveau :** Débutant à Intermédiaire
