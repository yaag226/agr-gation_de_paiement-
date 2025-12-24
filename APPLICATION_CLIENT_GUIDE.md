# Guide d'utilisation de la Plateforme d'Agrégation de Paiement

## 🎯 Vue d'ensemble

Cette plateforme permet aux **clients** d'effectuer des paiements et aux **marchands** de gérer leurs transactions. Elle intègre **Orange Money** et **MTN Mobile Money** pour le Burkina Faso.

---

## 👥 Deux espaces distincts

### 1. **Espace Client** (Accès public - sans inscription)

Les clients peuvent effectuer des paiements et consulter leur historique sans créer de compte.

#### 📱 Effectuer un paiement
**URL:** `http://localhost:3000/client/payer`

**Fonctionnalités:**
- ✅ Choisir le montant à payer (en XOF)
- ✅ Sélectionner le moyen de paiement:
  - 🟠 **Orange Money**
  - 🟡 **MTN Mobile Money**
- ✅ Entrer le numéro de téléphone
- ✅ Ajouter des informations optionnelles (nom, email, description)
- ✅ Cliquer sur "Payer" pour effectuer la transaction

**Exemple de paiement:**
```
Montant: 5000 XOF
Moyen: Orange Money
Téléphone: +226 70 00 00 00
```

La transaction sera traitée instantanément avec:
- ✅ **80% de chances de succès** (pour simulation)
- ❌ **20% de chances d'échec** (pour simulation)

#### 📊 Consulter l'historique
**URL:** `http://localhost:3000/client/dashboard`

**Fonctionnalités:**
- 🔍 Rechercher par numéro de téléphone
- 📈 Voir les statistiques:
  - Total des transactions
  - Transactions réussies
  - Transactions échouées
  - Montant total dépensé
- 📋 Historique détaillé de toutes les transactions
- 💳 Détails de chaque paiement (référence, montant, statut, date)

---

### 2. **Espace Marchand** (Nécessite inscription)

Les marchands peuvent gérer leurs transactions, voir leurs revenus et analyser leurs performances.

#### 🔐 Connexion/Inscription
**URLs:**
- Connexion: `http://localhost:3000/login`
- Inscription: `http://localhost:3000/register`

#### 📊 Dashboard Marchand
**URL:** `http://localhost:3000/` (après connexion)

**Fonctionnalités:**
- 💰 Solde total
- 📈 Revenus du mois
- 🔢 Nombre de transactions
- 📋 Liste des transactions récentes
- 📊 Statistiques détaillées

#### 💳 Gestion des transactions
**URL:** `http://localhost:3000/transactions`

- Voir toutes les transactions
- Filtrer par statut/provider
- Voir les détails de chaque transaction

#### 📈 Analytics
**URL:** `http://localhost:3000/analytics`

- Graphiques de revenus
- Statistiques par provider
- Analyses temporelles

---

## 🚀 Démarrage rapide

### Démarrer le backend
```bash
cd application_paiement/backend
npm install
npm run dev
```

Le backend sera disponible sur `http://localhost:5000`

### Démarrer le frontend
```bash
cd application_paiement/frontend
npm install
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

---

## 💡 Exemples concrets d'utilisation

### Scénario 1: Client effectue un paiement

1. **Ouvrir:** `http://localhost:3000/client/payer`
2. **Remplir le formulaire:**
   - Montant: `10000` XOF
   - Moyen: Sélectionner **Orange Money**
   - Téléphone: `+226 70 12 34 56`
   - Nom: `Jean Dupont`
   - Description: `Achat de produits`
3. **Cliquer sur "Payer"**
4. **Résultat:**
   - ✅ Succès: Vous verrez un message de confirmation avec la référence
   - ❌ Échec: Vous verrez un message d'erreur

### Scénario 2: Client consulte son historique

1. **Ouvrir:** `http://localhost:3000/client/dashboard`
2. **Entrer le numéro:** `+226 70 12 34 56`
3. **Cliquer sur "Rechercher"**
4. **Voir:**
   - Statistiques (total, réussi, échoué, montant)
   - Liste complète des transactions
   - Détails de chaque paiement

### Scénario 3: Marchand suit ses revenus

1. **S'inscrire/Connecter:** `http://localhost:3000/register` ou `/login`
2. **Accéder au dashboard:** Les transactions des clients s'affichent automatiquement
3. **Voir:**
   - Solde total actualisé
   - Transactions en temps réel
   - Statistiques du jour et du mois

---

## 🔄 API Backend

### Endpoint pour les clients

#### POST `/api/payment/payer`
Effectuer un paiement

**Body:**
```json
{
  "amount": 5000,
  "paymentMethod": "orange_money",
  "customerPhone": "+226 70 00 00 00",
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "description": "Achat produit"
}
```

**Réponse succès:**
```json
{
  "success": true,
  "message": "✅ Paiement réussi !",
  "data": {
    "transactionId": "TXN_1234567890_ABC123",
    "amount": 5000,
    "currency": "XOF",
    "status": "completed",
    "paymentMethod": "orange_money",
    "provider": "orange_money",
    "reference": "OM1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Réponse échec:**
```json
{
  "success": false,
  "message": "❌ Paiement échoué",
  "data": {
    "transactionId": "TXN_1234567890_ABC123",
    "status": "failed",
    ...
  }
}
```

#### GET `/api/payment/historique?phone=+226700000000`
Récupérer l'historique des transactions d'un client

**Réponse:**
```json
{
  "success": true,
  "count": 15,
  "data": {
    "transactions": [...]
  }
}
```

---

## 📊 Dashboard s'actualise automatiquement

Les dashboards (client et marchand) affichent les **données réelles** de la base de données:

### Dashboard Client
- ✅ Affiche toutes les transactions du numéro de téléphone
- ✅ Calcule les statistiques en temps réel
- ✅ Montre le statut exact de chaque transaction

### Dashboard Marchand
- ✅ Affiche toutes les transactions reçues
- ✅ Calcule le solde total
- ✅ Montre les revenus par jour/mois
- ✅ Liste les transactions en temps réel

---

## 🎨 Moyens de paiement disponibles

| Provider | Icône | Commission | Devise |
|----------|-------|------------|--------|
| **Orange Money** | 🟠 | 1.5% | XOF |
| **MTN Mobile Money** | 🟡 | 1.5% | XOF |

---

## ⚙️ Configuration

### Providers dans `constants.js`

```javascript
PROVIDERS: {
  ORANGE_MONEY: 'orange_money',
  MTN_MONEY: 'mtn_money'
}

PROVIDER_COMMISSION: {
  orange_money: 0.015, // 1.5%
  mtn_money: 0.015     // 1.5%
}
```

### Simulation de paiement

Les paiements sont simulés avec:
- **80% de taux de succès**
- **20% de taux d'échec**

Pour modifier le taux, éditer `payment.service.js`:
```javascript
const success = Math.random() > 0.2; // 80% succès
```

---

## 🧪 Tests manuels

### Test 1: Paiement Orange Money réussi
1. Aller sur `/client/payer`
2. Montant: 5000
3. Provider: Orange Money
4. Téléphone: +226 70 11 11 11
5. Payer → Vérifier le message de succès/échec

### Test 2: Paiement MTN Money
1. Aller sur `/client/payer`
2. Montant: 10000
3. Provider: MTN Money
4. Téléphone: +226 70 22 22 22
5. Payer → Vérifier le message

### Test 3: Historique client
1. Effectuer 3-4 paiements avec le même numéro
2. Aller sur `/client/dashboard`
3. Entrer le numéro utilisé
4. Vérifier que toutes les transactions s'affichent

### Test 4: Dashboard marchand
1. Se connecter en tant que marchand
2. Vérifier que les paiements des clients apparaissent
3. Vérifier que le solde total augmente
4. Vérifier les statistiques

---

## 🎉 Résumé des fonctionnalités implémentées

### ✅ Backend
- [x] Providers Orange Money et MTN Mobile Money
- [x] Route `/api/payment/payer` pour les paiements clients
- [x] Route `/api/payment/historique` pour l'historique
- [x] Sélection automatique du provider
- [x] Calcul automatique des commissions
- [x] Mise à jour automatique des stats marchands
- [x] Gestion des statuts (réussi/échoué)

### ✅ Frontend Client
- [x] Page de paiement `/client/payer`
  - Formulaire avec montant, provider, téléphone
  - Bouton "Payer"
  - Affichage du résultat (✅/❌)
- [x] Page dashboard `/client/dashboard`
  - Recherche par téléphone
  - Statistiques (total, réussi, échoué, montant)
  - Historique complet des transactions

### ✅ Frontend Marchand
- [x] Dashboard avec données réelles
- [x] Transactions en temps réel
- [x] Analytics et statistiques
- [x] Gestion des settings

---

## 📝 Notes importantes

- **Simulation:** Les paiements sont simulés (80% succès). En production, utiliser les vraies APIs Orange Money et MTN MoMo.
- **Devise:** Tout est en XOF (Franc CFA) adapté au Burkina Faso.
- **Pas d'inscription client:** Les clients n'ont pas besoin de compte, seulement un numéro de téléphone.
- **Base de données:** Toutes les transactions sont sauvegardées dans MongoDB.

---

Bonne utilisation de la plateforme ! 🚀
