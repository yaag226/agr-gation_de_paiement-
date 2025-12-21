# Données de Test - Payment Aggregator

## Comptes Utilisateurs de Test

### Admin
```json
{
  "email": "admin@payment.com",
  "password": "Admin123!",
  "name": "Admin User",
  "role": "admin"
}
```

### Marchands

#### Merchant 1 - Tech Store SAS
```json
{
  "email": "merchant1@test.com",
  "password": "Merchant123!",
  "name": "Tech Store",
  "role": "merchant",
  "businessName": "Tech Store SAS",
  "businessType": "company",
  "isVerified": true,
  "isActive": true,
  "providers": [
    {
      "provider": "stripe",
      "isActive": true,
      "priority": 1
    },
    {
      "provider": "paypal",
      "isActive": true,
      "priority": 2
    }
  ]
}
```

#### Merchant 2 - Fashion Boutique Paris
```json
{
  "email": "merchant2@test.com",
  "password": "Merchant123!",
  "name": "Fashion Boutique",
  "role": "merchant",
  "businessName": "Fashion Boutique Paris",
  "businessType": "individual",
  "isVerified": true,
  "isActive": true,
  "providers": [
    {
      "provider": "stripe",
      "isActive": true,
      "priority": 1
    }
  ]
}
```

#### Merchant 3 - Eco Products SARL
```json
{
  "email": "merchant3@test.com",
  "password": "Merchant123!",
  "name": "Eco Products",
  "role": "merchant",
  "businessName": "Eco Products SARL",
  "businessType": "company",
  "isVerified": false,
  "isActive": true,
  "providers": [
    {
      "provider": "wave",
      "isActive": true,
      "priority": 1
    }
  ]
}
```

---

## Transactions de Test

Les transactions de test sont générées automatiquement par le script seed avec :
- 15 transactions pour Merchant 1 (Tech Store)
- 8 transactions pour Merchant 2 (Fashion Boutique)
- Montants aléatoires entre 50€ et 550€
- Statuts variés (completed, pending, failed)
- Dates réparties sur les 30 derniers jours

### Exemple de Transaction
```json
{
  "transactionId": "TXN_1705315200_ABC123XYZ",
  "merchant": "merchant1@test.com",
  "provider": "stripe",
  "amount": 150.00,
  "currency": "EUR",
  "status": "completed",
  "customer": {
    "email": "customer1@test.com",
    "name": "Customer 1"
  },
  "commission": {
    "providerFee": 4.35,
    "platformFee": 0.75,
    "totalFee": 5.10
  },
  "netAmount": 144.90
}
```

---

## Scénarios de Test

### Scénario 1 : Connexion et Navigation
1. Se connecter avec `merchant1@test.com` / `Merchant123!`
2. Vérifier que le dashboard affiche les bonnes statistiques
3. Naviguer vers Transactions
4. Filtrer par statut "completed"
5. Vérifier que seules les transactions complétées s'affichent

**Résultat attendu :** Navigation fluide, données correctes

---

### Scénario 2 : Créer une Transaction Simple
1. Se connecter en tant que merchant1
2. Aller dans Paramètres
3. Section "Test de paiement"
4. Remplir :
   ```
   Montant: 100
   Devise: EUR
   Email client: newcustomer@test.com
   Provider: stripe (ou laisser auto)
   ```
5. Cliquer sur "Initier un paiement test"

**Résultat attendu :**
- Message de succès
- Transaction visible dans l'onglet Transactions
- Statut : pending ou completed
- Commission calculée automatiquement

---

### Scénario 3 : Configuration d'un Nouveau Provider
1. Se connecter en tant que merchant2
2. Aller dans Paramètres
3. Section "Providers de paiement"
4. Cliquer sur "Ajouter un provider"
5. Remplir :
   ```
   Provider: paypal
   API Key: test_paypal_key_12345
   Secret Key: test_paypal_secret_67890
   Actif: Oui
   ```
6. Valider

**Résultat attendu :**
- Provider ajouté avec succès
- Visible dans la liste des providers
- Badge "Actif" visible

---

### Scénario 4 : Analytics et Filtrage
1. Se connecter en tant que merchant1
2. Aller dans Analytics
3. Vérifier les statistiques globales
4. Observer la répartition par provider
5. Aller dans Transactions
6. Filtrer par :
   - Status: completed
   - Provider: stripe
7. Vérifier le nombre de résultats

**Résultat attendu :**
- Statistiques cohérentes
- Filtres fonctionnels
- Données filtrées correctement

---

### Scénario 5 : Test avec l'API (cURL)

#### 5.1 Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

**Résultat attendu :**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "data": {
    "user": {
      "name": "Tech Store",
      "email": "merchant1@test.com",
      "role": "merchant"
    }
  }
}
```

#### 5.2 Créer une Transaction
```bash
# Remplacer YOUR_TOKEN par le token obtenu
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 200.50,
    "currency": "EUR",
    "customerEmail": "testclient@example.com",
    "customerName": "Test Client",
    "description": "Test transaction via API",
    "metadata": {
      "source": "api_test"
    }
  }'
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "transactionId": "TXN_...",
      "amount": 200.50,
      "status": "pending",
      "netAmount": 194.09
    },
    "paymentUrl": "https://..."
  }
}
```

#### 5.3 Obtenir les Statistiques
```bash
curl -X GET http://localhost:5000/api/merchants/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTransactions": 16,
      "completedTransactions": 14,
      "totalRevenue": 2500.00
    }
  }
}
```

#### 5.4 Lister les Transactions avec Filtres
```bash
curl -X GET "http://localhost:5000/api/transactions?status=completed&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Scénario 6 : Test de Remboursement
1. Via l'API, créer une transaction et noter son ID
2. S'assurer qu'elle est en statut "completed"
3. Faire un remboursement :
```bash
curl -X POST http://localhost:5000/api/transactions/TRANSACTION_ID/refund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 100.00,
    "reason": "Customer requested refund - Test"
  }'
```

**Résultat attendu :**
- Statut transaction : refunded
- Montant remboursé enregistré

---

### Scénario 7 : Export de Données

#### Format JSON
```bash
curl -X GET "http://localhost:5000/api/analytics/export?format=json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  > transactions.json
```

#### Format CSV
```bash
curl -X GET "http://localhost:5000/api/analytics/export?format=csv" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  > transactions.csv
```

**Résultat attendu :**
- Fichier téléchargé avec toutes les transactions
- Format correct (JSON ou CSV)

---

## Validation des Données

### Vérifications à faire après seed

1. **Users**
   ```javascript
   db.users.countDocuments() // Devrait retourner 4
   ```

2. **Merchants**
   ```javascript
   db.merchants.countDocuments() // Devrait retourner 3
   ```

3. **Transactions**
   ```javascript
   db.transactions.countDocuments() // Devrait retourner 23
   db.transactions.countDocuments({ status: 'completed' }) // Majorité
   ```

4. **Vérifier les Relations**
   ```javascript
   db.users.findOne({ email: 'merchant1@test.com' }).merchant // Devrait être un ObjectId
   ```

---

## Tests de Validation

### Test 1 : Validation Email
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Test123!",
    "name": "Test User"
  }'
```
**Résultat attendu :** Erreur 400 avec message de validation

### Test 2 : Validation Montant
```bash
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": -50,
    "customerEmail": "test@test.com"
  }'
```
**Résultat attendu :** Erreur 400 (montant doit être positif)

### Test 3 : Provider Non Configuré
```bash
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 100,
    "provider": "inexistant",
    "customerEmail": "test@test.com"
  }'
```
**Résultat attendu :** Erreur 400 (provider non supporté)

---

## Données de Performance

Après l'exécution du seed, vous devriez avoir :

### Merchant 1 (Tech Store)
- **Transactions totales :** ~15
- **Transactions complétées :** ~12-13
- **Revenus totaux :** ~1500-2000€
- **Commission totale :** ~60-80€
- **Providers actifs :** Stripe, PayPal

### Merchant 2 (Fashion Boutique)
- **Transactions totales :** ~8
- **Transactions complétées :** ~6-7
- **Revenus totaux :** ~800-1200€
- **Commission totale :** ~30-50€
- **Providers actifs :** Stripe

### Merchant 3 (Eco Products)
- **Transactions totales :** 0 (non vérifié)
- **Providers actifs :** Wave

---

## Commandes Utiles MongoDB

### Voir tous les marchands
```javascript
db.merchants.find().pretty()
```

### Voir toutes les transactions d'un marchand
```javascript
db.transactions.find({
  merchant: ObjectId("ID_DU_MERCHANT")
}).pretty()
```

### Statistiques globales
```javascript
db.transactions.aggregate([
  { $group: {
    _id: "$status",
    count: { $sum: 1 },
    totalAmount: { $sum: "$amount" }
  }}
])
```

### Réinitialiser les données
```bash
cd backend
npm run seed
```

---

## Troubleshooting Tests

### Problème : Transaction toujours en "pending"
**Cause :** Mode test des providers
**Solution :** Normal en mode test, la transaction reste en pending jusqu'à webhook

### Problème : "Merchant not found"
**Cause :** Utilisateur n'a pas de merchant associé
**Solution :** Se connecter avec un compte merchant (merchant1/2/3)

### Problème : "No active providers"
**Cause :** Aucun provider configuré et actif
**Solution :** Ajouter un provider dans Paramètres

### Problème : Token expiré
**Cause :** Token JWT expiré (7 jours par défaut)
**Solution :** Se reconnecter pour obtenir un nouveau token

---

**Bon testing !** ✅
