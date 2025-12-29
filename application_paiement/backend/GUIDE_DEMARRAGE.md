# Guide de Démarrage - Application de Paiement

## Problèmes Résolus

### 1. Script de seed corrigé ✅
- Correction des chemins d'importation (`./models/User` → `../models/User`)
- Ajout explicite de `isActive: true` pour tous les marchands
- Fichier `.env` créé automatiquement

### 2. Script activateMerchants corrigé ✅
- Correction de la variable d'environnement (`MONGO_URI` → `MONGODB_URI`)

## Instructions pour Démarrer

### Étape 1: Démarrer MongoDB

**Sur Windows:**

1. **Vérifier si MongoDB est installé:**
   ```powershell
   mongod --version
   ```

2. **Si MongoDB n'est pas installé, téléchargez-le:**
   - Aller sur: https://www.mongodb.com/try/download/community
   - Télécharger MongoDB Community Server pour Windows
   - Installer avec les options par défaut

3. **Démarrer MongoDB:**
   ```powershell
   # Option 1: Démarrer en tant que service (si installé comme service)
   net start MongoDB

   # Option 2: Démarrer manuellement dans un nouveau terminal
   "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

   **Note:** Vous devrez peut-être créer le dossier `C:\data\db` si il n'existe pas:
   ```powershell
   mkdir C:\data\db
   ```

### Étape 2: Installer les dépendances

```bash
cd C:\Users\USER\Desktop\application_paiement\application_paiement\backend
npm install
```

### Étape 3: Exécuter le seed

```bash
npm run seed
```

Vous devriez voir:
```
✅ MongoDB connecté
🗑️  Base de données nettoyée
✅ Utilisateurs créés:
   - 1 Admin: admin@payment-bf.com / admin123
   - 3 Marchands
   - 2 Clients

📊 Comptes de test:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN:
  Email: admin@payment-bf.com
  Password: admin123

MARCHANDS:
  Boutique Wend Panga: amadou@boutique.bf / merchant123
  Restaurant Chez Fatim: fatimata@restaurant.bf / merchant123
  BF Tech Store: ibrahim@tech.bf / merchant123

CLIENTS:
  Salif Traoré: salif@email.com / client123
  Awa Compaoré: awa@email.com / client123
```

### Étape 4: Démarrer le serveur backend

```bash
npm run dev
```

### Étape 5: Tester la connexion

NB : si la connexion avec les seeder echoue cliquer sur s'inscire et creer vos different compte et faite le test
**Connexion Admin:**
- Email: `admin@payment-bf.com`
- Mot de passe: `admin123`

**Connexion Marchand:**
- Email: `amadou@boutique.bf`
- Mot de passe: `merchant123`

**Connexion Client:**
- Email: `salif@email.com`
- Mot de passe: `client123`


## Vérification des Marchands Actifs

Si le dropdown des marchands reste vide, exécutez ce script de diagnostic:

```bash
node src/scripts/activateMerchants.js
```

Ce script va:
1. Afficher tous les marchands avec leur statut `isActive`
2. Activer automatiquement tous les marchands inactifs
3. Afficher un résumé final

## Structure des Fichiers Modifiés

```
backend/
├── .env                                    [CRÉÉ]
├── src/
│   ├── utils/
│   │   └── seed.js                        [CORRIGÉ]
│   └── scripts/
│       └── activateMerchants.js           [CORRIGÉ]
```

## Problèmes Courants

### MongoDB ne démarre pas
**Erreur:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
1. Vérifier que MongoDB est démarré
2. Vérifier le fichier `.env` contient: `MONGODB_URI=mongodb://localhost:27017/payment_aggregator`

### Admin ne peut pas se connecter
**Cause:** Base de données vide ou seed non exécuté

**Solution:**
```bash
npm run seed
```

### Dropdown des marchands vide
**Cause:** Marchands créés mais `isActive: false`

**Solution:**
```bash
node src/scripts/activateMerchants.js
```

## Variables d'Environnement

Le fichier `.env` a été créé avec les valeurs par défaut:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/payment_aggregator
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
JWT_EXPIRE=7d
COMMISSION_RATE=0.02
MAX_TRANSACTION_AMOUNT=1000000
```

## Support

Si vous rencontrez des problèmes:
1. Vérifiez que MongoDB est bien démarré
2. Vérifiez que le fichier `.env` existe
3. Exécutez `npm run seed` pour réinitialiser la base
4. Vérifiez les logs dans le terminal
