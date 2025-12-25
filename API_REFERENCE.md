# 📡 API REFERENCE - QUICK GUIDE

## Base URL
```
http://localhost:5000/api
```

## 🔑 Authentication Headers

Pour les routes protégées, ajouter :
```http
Authorization: Bearer {your_jwt_token}
```

---

## 📍 ROUTES PAR CATÉGORIE

### 1. 🔐 AUTHENTIFICATION (`/api/auth`)

#### POST `/api/auth/register` - Inscription
```json
// Request
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "Password123!",
  "role": "customer",  // "customer" | "merchant" | "admin"
  "phone": "+226 70 12 34 56"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "_id": "...",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "customer",
      "isActive": true
    }
  }
}
```

#### POST `/api/auth/login` - Connexion
```json
// Request
{
  "email": "merchant1@test.com",
  "password": "Merchant123!"
}

// Response 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": { ... }
  }
}
```

#### GET `/api/auth/me` 🔒 - Profil utilisateur
```http
Authorization: Bearer {token}

// Response 200
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "customer"
    }
  }
}
```

#### PUT `/api/auth/update-profile` 🔒 - MAJ profil
```json
// Request
Authorization: Bearer {token}

{
  "name": "Jean Martin",
  "phone": "+226 70 99 88 77"
}

// Response 200
{
  "success": true,
  "data": { "user": { ... } }
}
```

#### PUT `/api/auth/change-password` 🔒 - Changer mot de passe
```json
// Request
Authorization: Bearer {token}

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}

// Response 200
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 2. 💳 PAIEMENTS (`/api/payment`)

#### POST `/api/payment/payer` - Effectuer un paiement (PUBLIC)
```json
// Request
{
  "amount": 5000,
  "paymentMethod": "orange_money",  // orange_money | mtn_money | moov_money | coris_bank | ecobank
  "customerPhone": "+226 70 12 34 56",
  "customerEmail": "client@example.com",  // optionnel
  "customerName": "Client Test",           // optionnel
  "description": "Achat de produit",       // optionnel
  "merchantId": "merchant_id_here"         // optionnel
}

// Response 201 - Succès
{
  "success": true,
  "message": "✅ Paiement réussi !",
  "data": {
    "transactionId": "TXN_1234567890_ABCDEF",
    "amount": 5000,
    "currency": "XOF",
    "status": "completed",
    "paymentMethod": "orange_money",
    "provider": "orange_money",
    "reference": "OM-1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}

// Response 201 - Échec
{
  "success": false,
  "message": "❌ Paiement échoué",
  "data": {
    "transactionId": "TXN_...",
    "status": "failed",
    ...
  }
}
```

**Moyens de paiement** :
- `orange_money` - Orange Money (80% succès)
- `mtn_money` - MTN Mobile Money (80% succès)
- `moov_money` - Moov Money (80% succès)
- `coris_bank` - Coris Bank (80% succès)
- `ecobank` - Ecobank (80% succès)

#### GET `/api/payment/historique` - Historique client (PUBLIC)
```http
GET /api/payment/historique?phone=+22670123456&limit=20&page=1
GET /api/payment/historique?email=client@test.com&limit=50

// Response 200
{
  "success": true,
  "count": 15,
  "totalPages": 1,
  "currentPage": 1,
  "data": {
    "transactions": [
      {
        "_id": "...",
        "transactionId": "TXN_...",
        "amount": 5000,
        "currency": "XOF",
        "status": "completed",
        "paymentMethod": "orange_money",
        "customer": {
          "phone": "+22670123456",
          "email": "client@test.com",
          "name": "Client Test"
        },
        "merchant": {
          "_id": "...",
          "businessName": "Tech Store"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 3. 🏪 MARCHANDS (`/api/merchants`)

#### GET `/api/merchants` 🔒 ADMIN - Liste des marchands
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "businessName": "Tech Store",
      "user": { ... },
      "isActive": true,
      "isVerified": true,
      "totalTransactions": 150,
      "totalRevenue": 750000
    }
  ]
}
```

#### GET `/api/merchants/stats` 🔒 MERCHANT - Stats du marchand
```http
Authorization: Bearer {merchant_token}

// Response 200
{
  "success": true,
  "data": {
    "totalTransactions": 150,
    "totalRevenue": 750000,
    "balance": 745000,
    "completedTransactions": 140,
    "failedTransactions": 10,
    "activeProviders": ["orange_money", "mtn_money"]
  }
}
```

#### GET `/api/merchants/:id` 🔒 - Détails d'un marchand
```http
Authorization: Bearer {token}

// Response 200
{
  "success": true,
  "data": {
    "merchant": { ... }
  }
}
```

#### PUT `/api/merchants/:id` 🔒 MERCHANT - MAJ marchand
```json
// Request
Authorization: Bearer {merchant_token}

{
  "businessName": "Ma Nouvelle Boutique",
  "description": "Vente de produits tech",
  "website": "https://maboutique.bf",
  "address": {
    "street": "123 Rue de l'Innovation",
    "city": "Ouagadougou",
    "country": "Burkina Faso"
  }
}

// Response 200
{
  "success": true,
  "data": { "merchant": { ... } }
}
```

#### POST `/api/merchants/provider-config` 🔒 MERCHANT - Ajouter provider
```json
// Request
Authorization: Bearer {merchant_token}

{
  "provider": "orange_money",
  "apiKey": "test_api_key_123",
  "secretKey": "test_secret_456",
  "isActive": true,
  "priority": 1
}

// Response 201
{
  "success": true,
  "message": "Provider configuration added successfully"
}
```

#### PUT `/api/merchants/provider-config/:provider` 🔒 MERCHANT
```json
// Request
Authorization: Bearer {merchant_token}

{
  "isActive": false,
  "priority": 2
}
```

#### DELETE `/api/merchants/provider-config/:provider` 🔒 MERCHANT
```http
Authorization: Bearer {merchant_token}

DELETE /api/merchants/provider-config/orange_money
```

---

### 4. 📊 TRANSACTIONS (`/api/transactions`)

#### GET `/api/transactions` 🔒 - Liste des transactions
```http
Authorization: Bearer {token}

GET /api/transactions?status=completed&limit=50&page=1
GET /api/transactions?provider=orange_money
GET /api/transactions?startDate=2024-01-01&endDate=2024-01-31

// Response 200
{
  "success": true,
  "count": 45,
  "totalPages": 1,
  "currentPage": 1,
  "data": {
    "transactions": [ ... ]
  }
}
```

**Filtres disponibles** :
- `status` : completed | pending | failed | refunded
- `provider` : orange_money | mtn_money | etc.
- `startDate` : YYYY-MM-DD
- `endDate` : YYYY-MM-DD
- `limit` : nombre (défaut: 20)
- `page` : numéro de page

#### GET `/api/transactions/:id` 🔒 - Détails transaction
```http
Authorization: Bearer {token}

// Response 200
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "...",
      "transactionId": "TXN_...",
      "merchant": { ... },
      "amount": 5000,
      "currency": "XOF",
      "status": "completed",
      "customer": { ... },
      "commission": {
        "providerFee": 75,
        "platformFee": 25,
        "totalFee": 100
      },
      "netAmount": 4900,
      "paymentMethod": "orange_money",
      "paymentDetails": { ... },
      "createdAt": "...",
      "completedAt": "..."
    }
  }
}
```

#### GET `/api/transactions/stats` 🔒 MERCHANT - Stats transactions
```http
Authorization: Bearer {merchant_token}

// Response 200
{
  "success": true,
  "data": {
    "totalTransactions": 150,
    "completedTransactions": 140,
    "failedTransactions": 10,
    "pendingTransactions": 0,
    "totalRevenue": 750000,
    "avgTransactionAmount": 5000,
    "successRate": 93.33
  }
}
```

---

### 5. 📈 ANALYTICS (`/api/analytics`)

#### GET `/api/analytics/dashboard` 🔒 MERCHANT - Dashboard analytics
```http
Authorization: Bearer {merchant_token}

GET /api/analytics/dashboard?period=7d
GET /api/analytics/dashboard?period=30d
GET /api/analytics/dashboard?period=custom&startDate=2024-01-01&endDate=2024-01-31

// Response 200
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 750000,
      "totalTransactions": 150,
      "avgTransactionValue": 5000,
      "successRate": 93.33
    },
    "revenueByDay": [
      { "date": "2024-01-01", "revenue": 25000, "transactions": 5 },
      { "date": "2024-01-02", "revenue": 30000, "transactions": 6 }
    ],
    "transactionsByProvider": [
      { "provider": "orange_money", "count": 80, "revenue": 400000 },
      { "provider": "mtn_money", "count": 70, "revenue": 350000 }
    ],
    "topCustomers": [
      { "email": "client1@test.com", "totalSpent": 50000, "transactionCount": 10 }
    ]
  }
}
```

**Périodes disponibles** :
- `7d` : 7 derniers jours
- `30d` : 30 derniers jours
- `90d` : 90 derniers jours
- `custom` : période personnalisée (avec startDate et endDate)

#### GET `/api/analytics/revenue` 🔒 MERCHANT - Rapport de revenus
```http
Authorization: Bearer {merchant_token}

GET /api/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31&groupBy=day

// Response 200
{
  "success": true,
  "data": {
    "totalRevenue": 750000,
    "totalCommissions": 15000,
    "netRevenue": 735000,
    "breakdown": [ ... ]
  }
}
```

---

### 6. 👨‍💼 ADMIN (`/api/admin`)

#### GET `/api/admin/stats` 🔒 ADMIN - Stats globales
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "data": {
    "totalUsers": 45,
    "totalMerchants": 10,
    "activeMerchants": 8,
    "totalCustomers": 35,
    "totalTransactions": 500,
    "completedTransactions": 450,
    "totalRevenue": 2500000,
    "platformRevenue": 12500,
    "recentTransactions": [ ... ]
  }
}
```

#### GET `/api/admin/users` 🔒 ADMIN - Liste des utilisateurs
```http
Authorization: Bearer {admin_token}

GET /api/admin/users?role=merchant&page=1&limit=20
GET /api/admin/users?isActive=true

// Response 200
{
  "success": true,
  "count": 45,
  "data": {
    "users": [ ... ]
  }
}
```

#### GET `/api/admin/users/:id` 🔒 ADMIN - Détails utilisateur
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### PUT `/api/admin/users/:id` 🔒 ADMIN - Modifier utilisateur
```json
// Request
Authorization: Bearer {admin_token}

{
  "isActive": false,
  "role": "merchant"
}

// Response 200
{
  "success": true,
  "message": "User updated successfully",
  "data": { "user": { ... } }
}
```

#### DELETE `/api/admin/users/:id` 🔒 ADMIN - Supprimer utilisateur
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### GET `/api/admin/merchants` 🔒 ADMIN - Liste des marchands
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "data": {
    "merchants": [ ... ]
  }
}
```

#### GET `/api/admin/merchants/:id` 🔒 ADMIN - Détails marchand
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "data": {
    "merchant": { ... }
  }
}
```

#### PUT `/api/admin/merchants/:id` 🔒 ADMIN - Modifier marchand
```json
// Request
Authorization: Bearer {admin_token}

{
  "isActive": true,
  "isVerified": true
}
```

#### POST `/api/admin/merchants/:id/verify` 🔒 ADMIN - Vérifier marchand
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "message": "Merchant verified successfully"
}
```

#### POST `/api/admin/merchants/:id/toggle-status` 🔒 ADMIN - Toggle status
```http
Authorization: Bearer {admin_token}

// Response 200
{
  "success": true,
  "message": "Merchant status updated",
  "data": {
    "isActive": false
  }
}
```

---

## 🧪 EXEMPLES cURL

### 1. Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!",
    "role": "customer"
  }'
```

### 2. Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

### 3. Paiement
```bash
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670123456",
    "customerEmail": "client@test.bf",
    "customerName": "Client Test"
  }'
```

### 4. Profil (avec token)
```bash
TOKEN="votre_token_jwt"

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Stats Marchand
```bash
TOKEN="merchant_token_jwt"

curl -X GET http://localhost:5000/api/merchants/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Transactions
```bash
TOKEN="merchant_token_jwt"

curl -X GET "http://localhost:5000/api/transactions?status=completed&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 CODES DE STATUT

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource introuvable |
| 500 | Internal Server Error - Erreur serveur |

---

## 🔐 RÔLES ET PERMISSIONS

| Route | Customer | Merchant | Admin |
|-------|----------|----------|-------|
| POST /payment/payer | ✅ Public | ✅ Public | ✅ Public |
| GET /payment/historique | ✅ Public | ✅ Public | ✅ Public |
| GET /merchants/stats | ❌ | ✅ | ✅ |
| GET /transactions | ❌ | ✅ (ses transactions) | ✅ (toutes) |
| GET /analytics/* | ❌ | ✅ | ✅ |
| GET /admin/* | ❌ | ❌ | ✅ |

---

## 💡 TIPS

### Récupérer le token après login
```javascript
// Exemple JavaScript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'merchant1@test.com',
    password: 'Merchant123!'
  })
});

const data = await response.json();
const token = data.data.token;

// Utiliser le token
const meResponse = await fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Postman - Gérer le token
1. Faire le login
2. Copier le token de la réponse
3. Aller dans l'onglet "Authorization"
4. Type : "Bearer Token"
5. Coller le token

### Pagination
```http
GET /api/transactions?page=2&limit=50
```

---

**Documentation complète** : [GUIDE_COMPLET_APPLICATION.md](./GUIDE_COMPLET_APPLICATION.md)
