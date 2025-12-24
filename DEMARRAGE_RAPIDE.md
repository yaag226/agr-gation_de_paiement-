# 🚀 Guide de Démarrage Rapide

## Problème résolu : Erreur de validation

L'erreur "Validation error" était causée par le fait que les nouveaux providers `orange_money` et `mtn_money` n'étaient pas inclus dans le schéma de validation Joi.

### ✅ Correction appliquée

Le fichier `validation.middleware.js` a été mis à jour pour inclure les nouveaux providers.

---

## 🏃‍♂️ Démarrage de l'application

### 1. Backend

```bash
cd application_paiement/backend

# Installer les dépendances (première fois seulement)
npm install

# Démarrer le serveur
npm run dev
```

**Le backend démarre sur:** `http://localhost:5000`

### 2. Frontend

```bash
# Dans un nouveau terminal
cd application_paiement/frontend

# Installer les dépendances (première fois seulement)
npm install

# Démarrer le frontend
npm run dev
```

**Le frontend démarre sur:** `http://localhost:3000`

### 3. Base de données

Assurez-vous que **MongoDB** est en cours d'exécution :

```bash
# Si vous utilisez MongoDB local
mongod

# Ou si vous utilisez MongoDB Atlas
# Configurez la variable MONGODB_URI dans backend/.env
```

---

## 🎯 URLs importantes

### Espace Client

| Page | URL | Description |
|------|-----|-------------|
| Paiement simple | `/client/payer` | Payer une facture |
| Agrégation | `/client/aggregation` | Payer plusieurs factures |
| Historique simple | `/client/dashboard` | Voir transactions simples |
| Historique agrégation | `/client/aggregation/history` | Voir agrégations avec logs |

### Espace Marchand

| Page | URL | Description |
|------|-----|-------------|
| Connexion | `/login` | Se connecter |
| Inscription | `/register` | Créer un compte marchand |
| Dashboard | `/` | Vue d'ensemble |
| Transactions | `/transactions` | Toutes les transactions |
| Analytics | `/analytics` | Statistiques |

---

## 🧪 Test rapide

### Test 1 : Paiement simple

1. Aller sur `http://localhost:3000/client/payer`
2. Remplir :
   - Montant : `5000`
   - Provider : Orange Money 🟠
   - Téléphone : `+226 70 12 34 56`
3. Cliquer sur "Payer"
4. Voir le résultat (✅ ou ❌)

### Test 2 : Agrégation

1. Aller sur `http://localhost:3000/client/aggregation`
2. Ajouter 3 factures :
   - Eau : 5000 XOF
   - Électricité : 10000 XOF
   - Internet : 7000 XOF
3. Cliquer sur "Payer tout maintenant"
4. **Observer les logs en temps réel !**

### Test 3 : Historique

1. Aller sur `http://localhost:3000/client/aggregation/history`
2. Entrer votre numéro : `+226 70 12 34 56`
3. Voir toutes vos agrégations
4. Cliquer sur une agrégation pour voir les détails

---

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
cd application_paiement/backend
npm install
npm run dev
```

### Le frontend ne démarre pas

```bash
cd application_paiement/frontend
npm install
npm run dev
```

### Erreur de connexion MongoDB

Vérifiez que MongoDB est démarré ou que la variable `MONGODB_URI` est correctement configurée dans `.env`

### Port déjà utilisé

Si le port 5000 ou 3000 est déjà utilisé :

```bash
# Backend : Modifier le port dans backend/.env
PORT=5001

# Frontend : Il vous proposera automatiquement un autre port
```

---

## 📚 Documentation complète

- **Guide utilisateur** : `APPLICATION_CLIENT_GUIDE.md`
- **Guide agrégation** : `GUIDE_AGREGATION_TRACAGE.md`

---

## ✅ Prêt à tester !

Votre plateforme d'agrégation de paiement est maintenant opérationnelle avec :

✅ Paiements Orange Money et MTN Mobile Money
✅ Agrégation de plusieurs factures
✅ Traçage complet en temps réel
✅ Historique détaillé avec logs
✅ Dashboard marchands actualisé

**Bon test !** 🎉
