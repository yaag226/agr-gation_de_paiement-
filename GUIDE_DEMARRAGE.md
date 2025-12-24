# 🚀 Guide de Démarrage Rapide - PayAggregate

Ce guide vous permettra de démarrer l'application en **moins de 5 minutes**.

---

## ⚡ Démarrage Ultra-Rapide

### 1️⃣ Installation (2 minutes)

```bash
# Cloner le projet
git clone https://github.com/yaag226/agrégation_de_paiement-.git
cd agrégation_de_paiement-/application_paiement

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### 2️⃣ Configuration (1 minute)

#### Backend

Créer `backend/.env` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
JWT_SECRET=mon_secret_super_securise_123456
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

#### Frontend

Créer `frontend/.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Démarrer MongoDB (30 secondes)

```bash
# Assurez-vous que MongoDB est démarré
mongod --dbpath ~/data/db
# ou
sudo systemctl start mongod
```

### 4️⃣ Initialiser les Données (30 secondes)

```bash
cd backend
npm run seed
```

✅ Ceci crée automatiquement :
- Comptes admin et marchands
- Données de test
- Transactions d'exemple

### 5️⃣ Lancer l'Application (1 minute)

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

🟢 Backend prêt sur : `http://localhost:5000`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

🟢 Frontend prêt sur : `http://localhost:3000`

---

## 🎯 Première Utilisation

### Test 1 : Paiement Simple (Client)

1. Ouvrir `http://localhost:3000`
2. Cliquer sur **"Paiement simple"**
3. Remplir le formulaire :
   - Montant : `5000`
   - Téléphone : `+22670000000`
   - Choisir **Orange Money** ou **MTN**
4. Cliquer sur **"Payer maintenant"**
5. ✅ Voir le résultat (80% de succès)

### Test 2 : Agrégation de Paiements

1. Depuis l'accueil, cliquer sur **"Agrégation"**
2. Remplir vos informations client
3. Ajouter plusieurs factures :
   - Facture eau : `5000 XOF`
   - Facture électricité : `15000 XOF`
   - Internet : `10000 XOF`
4. Cliquer sur **"Payer tout maintenant"**
5. 📊 Voir le traçage en temps réel !

### Test 3 : Espace Marchand

1. Cliquer sur **"Espace Marchand"**
2. Se connecter avec :
   - **Email** : `admin@payment.com`
   - **Mot de passe** : `Admin123!`
3. Découvrir le dashboard professionnel
4. Explorer les transactions et analytics

---

## 📱 Parcours Complet

### Pour un Client

```
Page d'accueil
    │
    ├─→ Paiement simple
    │    └─→ Résultat instantané
    │
    ├─→ Agrégation
    │    ├─→ Ajouter plusieurs factures
    │    ├─→ Voir logs en temps réel
    │    └─→ Résultat avec statistiques
    │
    └─→ Historique
         └─→ Voir toutes les transactions
```

### Pour un Marchand

```
Login
  │
  └─→ Dashboard
       ├─→ Statistiques en temps réel
       ├─→ Transactions du jour/mois
       ├─→ Revenus et commissions
       │
       ├─→ Transactions
       │    ├─→ Liste complète
       │    ├─→ Filtres avancés
       │    └─→ Détails transaction
       │
       └─→ Analytics
            ├─→ Par période
            ├─→ Par opérateur
            └─→ Graphiques
```

---

## 🔑 Comptes de Test

### Admin

- Email : `admin@payment.com`
- Mot de passe : `Admin123!`
- Accès : Toutes les fonctionnalités

### Marchand 1

- Email : `merchant1@test.com`
- Mot de passe : `Merchant123!`
- Business : E-Commerce Store

### Client (Pas de compte nécessaire)

- Utiliser directement les pages publiques
- Exemple téléphone : `+22670000000`

---

## 🐛 Résolution de Problèmes

### Problème : MongoDB ne démarre pas

**Solution** :
```bash
# Vérifier que MongoDB est installé
mongo --version

# Démarrer MongoDB
sudo systemctl start mongod

# Vérifier le statut
sudo systemctl status mongod
```

### Problème : Port 5000 déjà utilisé

**Solution** :
Modifier `backend/.env` :
```env
PORT=5001
```

Puis modifier `frontend/.env` :
```env
VITE_API_URL=http://localhost:5001/api
```

### Problème : Erreur de connexion backend-frontend

**Vérifier** :
1. Backend écoute sur `http://localhost:5000`
2. Frontend utilise la bonne URL API
3. CORS est bien configuré dans `backend/src/app.js`

```bash
# Tester le backend directement
curl http://localhost:5000/health
```

### Problème : Les paiements ne fonctionnent pas

**Raison** : C'est normal ! Les paiements sont **simulés**.

- Taux de succès : **80%**
- Si ❌ échec : Réessayer
- Vérifier les logs backend pour plus de détails

---

## 📊 Vérifier que Tout Fonctionne

### ✅ Checklist de Vérification

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Page d'accueil s'affiche correctement
- [ ] Navigation fonctionne (Header + Footer)
- [ ] Paiement simple fonctionne
- [ ] Agrégation fonctionne avec logs
- [ ] Login marchand fonctionne
- [ ] Dashboard s'affiche
- [ ] Historique client fonctionne

### 🧪 Tests Rapides

```bash
# Test 1 : Backend Health Check
curl http://localhost:5000/health

# Test 2 : Créer un paiement simple (devrait réussir ~80%)
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670000000",
    "customerName": "Test User"
  }'

# Test 3 : Récupérer l'historique
curl "http://localhost:5000/api/payment/historique?phone=%2B22670000000"
```

---

## 🎓 Pour la Démonstration au Professeur

### Scénario Complet à Présenter

#### 1. Introduction (2 min)
- Montrer la page d'accueil moderne
- Expliquer les deux espaces : Client et Marchand
- Présenter les fonctionnalités principales

#### 2. Démonstration Client (5 min)

**a) Paiement Simple** :
- Effectuer un paiement Orange Money de 5000 XOF
- Montrer le feedback instantané
- Expliquer le traitement

**b) Agrégation** :
- Créer une agrégation avec 3 factures différentes
- Montrer le traçage en temps réel dans les logs
- Expliquer le statut (completed/partial/failed)

**c) Historique** :
- Rechercher par téléphone
- Montrer les statistiques
- Détailler une transaction

#### 3. Démonstration Marchand (5 min)

**a) Dashboard** :
- Montrer les KPIs en temps réel
- Expliquer les revenus et commissions
- Présenter les transactions récentes

**b) Transactions** :
- Filtrer par date/statut
- Montrer les détails complets
- Expliquer le système de commissions

**c) Analytics** :
- Graphiques par période
- Répartition par opérateur
- Analyse des performances

#### 4. Aspects Techniques (3 min)

- Architecture fullstack (React + Node.js + MongoDB)
- API RESTful
- Système d'agrégation intelligent
- Traçabilité complète
- Design responsive et moderne

---

## 💡 Conseils Pro

### Pour une Démo Réussie

1. **Préparer les données** :
   ```bash
   npm run seed  # Crée des données fraîches
   ```

2. **Ouvrir plusieurs onglets** :
   - Onglet 1 : Page d'accueil
   - Onglet 2 : Paiement simple
   - Onglet 3 : Agrégation
   - Onglet 4 : Dashboard marchand

3. **Avoir des transactions en attente** :
   - Créer 2-3 paiements simples
   - Créer 1 agrégation
   - Cela montre l'historique rempli

4. **Tester avant** :
   - Faire un test complet 10 min avant
   - Vérifier tous les endpoints
   - S'assurer que MongoDB tourne

### Fonctionnalités à Mettre en Avant

✨ **Points Forts** :
- Interface moderne et professionnelle
- Traçage complet avec logs en temps réel
- Agrégation intelligente de plusieurs paiements
- Dashboard marchand complet
- Design responsive
- Architecture scalable
- Code propre et commenté

---

## 📞 Support

Si vous rencontrez un problème :

1. Vérifier les logs du backend
2. Vérifier la console du navigateur
3. Redémarrer backend et frontend
4. Vérifier MongoDB
5. Consulter le README principal

---

## 🎉 Vous êtes Prêt !

L'application est maintenant opérationnelle. Profitez de votre démonstration !

**Temps total de setup** : ⏱️ **~5 minutes**

---

<div align="center">

**Bon courage pour votre présentation ! 🚀**

[← Retour au README principal](./README.md)

</div>
