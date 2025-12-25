# ⚡ QUICKSTART - Démarrage en 3 minutes

## 1️⃣ Prérequis (Vérifier)

```bash
node --version    # >= 14.0.0
npm --version     # >= 6.0.0
mongod --version  # MongoDB installé
```

---

## 2️⃣ Installation (1 minute)

```bash
# Aller dans le dossier
cd application_paiement

# Installer toutes les dépendances
npm run install:all
```

---

## 3️⃣ Lancer MongoDB (Terminal séparé)

```bash
# Option 1 : Si MongoDB est un service
sudo systemctl start mongod

# Option 2 : Lancer manuellement
mongod

# Option 3 : macOS
brew services start mongodb-community
```

---

## 4️⃣ Seed la base de données (30 secondes)

```bash
cd application_paiement
npm run seed
```

**Comptes créés** :
- Admin : `admin@payment.com` / `Admin123!`
- Marchand 1 : `merchant1@test.com` / `Merchant123!`
- Marchand 2 : `merchant2@test.com` / `Merchant123!`
- Client 1 : `customer1@test.com` / `Customer123!`

---

## 5️⃣ Lancer l'application (30 secondes)

### Terminal 1 - Backend
```bash
cd application_paiement
npm run dev:backend
```
✅ Backend démarré sur **http://localhost:5000**

### Terminal 2 - Frontend
```bash
cd application_paiement
npm run dev:frontend
```
✅ Frontend démarré sur **http://localhost:3000**

---

## 6️⃣ Tester l'application

### Ouvrir le navigateur
```
http://localhost:3000
```

### Scénario de test rapide

1. **Page Client** : http://localhost:3000/client/payer
   - Montant : `5000`
   - Moyen : `Orange Money`
   - Téléphone : `+226 70 12 34 56`
   - Cliquer "Payer"
   - ✅ 80% de succès simulé

2. **Connexion Marchand** : http://localhost:3000/login
   - Email : `merchant1@test.com`
   - Password : `Merchant123!`
   - Voir le dashboard et les transactions

3. **Connexion Admin** : http://localhost:3000/login
   - Email : `admin@payment.com`
   - Password : `Admin123!`
   - Accéder à : http://localhost:3000/admin/dashboard

---

## 🧪 Test API rapide

```bash
# Test 1 : Health check
curl http://localhost:5000/health

# Test 2 : Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'

# Test 3 : Paiement
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670123456"
  }'
```

---

## 🐛 Problèmes courants

### MongoDB ne démarre pas
```bash
# Vérifier
sudo systemctl status mongod

# Démarrer
sudo systemctl start mongod
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5000

# Tuer
kill -9 <PID>
```

### Dépendances manquantes
```bash
cd application_paiement
npm run install:all
```

---

## 📚 Documentation complète

- **README** : [README.md](./README.md)
- **Guide complet** : [GUIDE_COMPLET_APPLICATION.md](./GUIDE_COMPLET_APPLICATION.md)
- **API Reference** : [API_REFERENCE.md](./API_REFERENCE.md)

---

## ✅ C'est tout !

Vous devriez maintenant avoir :
- ✅ Backend sur http://localhost:5000
- ✅ Frontend sur http://localhost:3000
- ✅ MongoDB qui tourne
- ✅ Données de test chargées

**Bon développement ! 🚀**
