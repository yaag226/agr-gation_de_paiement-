# 📡 Documentation API - PayAggregate

Guide complet des endpoints API de la plateforme d'agrégation de paiement.

---

## 🔗 Base URL

```
http://localhost:5000/api
```

---

## 📋 Table des Matières

- [Authentification](#authentification)
- [Paiements](#paiements)
- [Agrégation](#agrégation)
- [Transactions](#transactions)
- [Marchands](#marchands)
- [Analytics](#analytics)
- [Codes de Réponse](#codes-de-réponse)

---

## 🔐 Authentification

### Inscription

Créer un nouveau compte marchand.

```http
POST /api/auth/register
```

**Body** :
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "MotDePasse123!",
  "phone": "+22670000000",
  "businessName": "Ma Boutique",
  "businessType": "retail"
}
```

**Réponse (201)** :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "64abc...",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "merchant"
    }
  }
}
```

---

### Connexion

Authentifier un marchand existant.

```http
POST /api/auth/login
```

**Body** :
```json
{
  "email": "jean@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse (200)** :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "64abc...",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "merchant"
    }
  }
}
```

---

### Profil Utilisateur

Récupérer les informations du marchand connecté.

```http
GET /api/auth/me
```

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc...",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "merchant"
    }
  }
}
```

---

## 💳 Paiements

### Effectuer un Paiement Simple

Route publique pour effectuer un paiement mobile.

```http
POST /api/payment/payer
```

**Body** :
```json
{
  "amount": 5000,
  "paymentMethod": "orange_money",
  "customerPhone": "+22670000000",
  "customerName": "Client Test",
  "customerEmail": "client@example.com",
  "description": "Paiement facture eau"
}
```

**Paramètres** :
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| amount | number | ✅ | Montant en XOF (>= 100) |
| paymentMethod | string | ✅ | `orange_money` ou `mtn_money` |
| customerPhone | string | ✅ | Numéro de téléphone |
| customerName | string | ❌ | Nom du client |
| customerEmail | string | ❌ | Email du client |
| description | string | ❌ | Description du paiement |

**Réponse Succès (201)** :
```json
{
  "success": true,
  "message": "✅ Paiement réussi !",
  "data": {
    "transactionId": "TXN_1234567890_ABC",
    "amount": 5000,
    "currency": "XOF",
    "status": "completed",
    "paymentMethod": "orange_money",
    "provider": "orange_money",
    "reference": "OM1705075200000",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Réponse Échec (201)** :
```json
{
  "success": false,
  "message": "❌ Paiement échoué",
  "data": {
    "transactionId": "TXN_1234567890_ABC",
    "status": "failed",
    ...
  }
}
```

---

### Historique Client

Récupérer l'historique des transactions d'un client.

```http
GET /api/payment/historique?phone={phone}&limit={limit}
```

**Query Parameters** :
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| phone | string | ✅ | Numéro de téléphone |
| email | string | ❌ | Email alternatif |
| limit | number | ❌ | Nombre de résultats (défaut: 20) |
| page | number | ❌ | Page (défaut: 1) |

**Réponse (200)** :
```json
{
  "success": true,
  "count": 15,
  "totalPages": 1,
  "currentPage": 1,
  "data": {
    "transactions": [
      {
        "_id": "64abc...",
        "transactionId": "TXN_...",
        "amount": 5000,
        "currency": "XOF",
        "status": "completed",
        "provider": "orange_money",
        "description": "Paiement facture",
        "createdAt": "2024-01-15T10:30:00.000Z",
        ...
      }
    ]
  }
}
```

---

## 📦 Agrégation

### Créer une Agrégation

Payer plusieurs factures en une seule transaction.

```http
POST /api/aggregation/create
```

**Body** :
```json
{
  "provider": "orange_money",
  "customerPhone": "+22670000000",
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "payments": [
    {
      "description": "Facture eau Janvier",
      "amount": 5000,
      "category": "facture_eau",
      "reference": "EAU-2024-001"
    },
    {
      "description": "Facture électricité Janvier",
      "amount": 15000,
      "category": "facture_electricite",
      "reference": "ELEC-2024-001"
    },
    {
      "description": "Abonnement Internet",
      "amount": 10000,
      "category": "internet"
    }
  ]
}
```

**Paramètres** :
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| provider | string | ✅ | `orange_money` ou `mtn_money` |
| customerPhone | string | ✅ | Numéro de téléphone |
| payments | array | ✅ | Liste de paiements (min: 1) |
| payments[].description | string | ✅ | Description |
| payments[].amount | number | ✅ | Montant |
| payments[].category | string | ❌ | Catégorie de facture |
| payments[].reference | string | ❌ | Référence |

**Catégories disponibles** :
- `facture_eau`
- `facture_electricite`
- `internet`
- `telephone`
- `achat`
- `autre`

**Réponse (201)** :
```json
{
  "success": true,
  "message": "✅ Agrégation de paiements réussie !",
  "data": {
    "aggregation": {
      "_id": "64abc...",
      "aggregationId": "AGG_1705075200_ABC123",
      "customer": {
        "phone": "+22670000000",
        "name": "Jean Dupont",
        "email": "jean@example.com"
      },
      "payments": [...],
      "totalAmount": 30000,
      "provider": "orange_money",
      "status": "completed",
      "transactions": [...],
      "activityLog": [
        {
          "timestamp": "2024-01-15T10:30:00.000Z",
          "action": "CREATION",
          "details": "Agrégation créée avec 3 paiement(s)",
          "status": "success"
        },
        {
          "timestamp": "2024-01-15T10:30:05.000Z",
          "action": "PAYMENT_SUCCESS",
          "details": "✅ Paiement 1 réussi: Facture eau",
          "status": "success"
        },
        ...
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "summary": {
      "total": 3,
      "success": 3,
      "failed": 0,
      "totalAmount": 30000,
      "status": "completed"
    }
  }
}
```

**Statuts possibles** :
- `completed` : Tous les paiements ont réussi
- `partial` : Certains paiements ont réussi
- `failed` : Tous les paiements ont échoué

---

### Récupérer une Agrégation

Obtenir les détails complets d'une agrégation.

```http
GET /api/aggregation/:id
```

**Paramètres URL** :
- `:id` - ID MongoDB ou aggregationId (ex: `AGG_1705075200_ABC123`)

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "aggregation": {
      "_id": "64abc...",
      "aggregationId": "AGG_...",
      "customer": {...},
      "payments": [...],
      "transactions": [...],
      "activityLog": [...],
      "status": "completed"
    }
  }
}
```

---

### Logs d'une Agrégation

Récupérer uniquement les logs de traçage.

```http
GET /api/aggregation/:id/logs
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "aggregationId": "AGG_...",
    "status": "completed",
    "logs": [
      {
        "timestamp": "2024-01-15T10:30:00.000Z",
        "action": "CREATION",
        "details": "Agrégation créée",
        "status": "success"
      },
      ...
    ]
  }
}
```

---

### Historique d'Agrégation Client

Récupérer toutes les agrégations d'un client.

```http
GET /api/aggregation/customer/history?phone={phone}
```

**Query Parameters** :
| Paramètre | Type | Requis |
|-----------|------|--------|
| phone | string | ✅ |

**Réponse (200)** :
```json
{
  "success": true,
  "count": 5,
  "data": {
    "aggregations": [
      {
        "_id": "64abc...",
        "aggregationId": "AGG_...",
        "totalAmount": 30000,
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "payments": [...],
        "transactions": [...]
      },
      ...
    ]
  }
}
```

---

## 📊 Transactions (Protégé)

Endpoints nécessitant une authentification JWT.

### Liste des Transactions

```http
GET /api/transactions
```

**Headers** :
```
Authorization: Bearer {token}
```

**Query Parameters** :
| Paramètre | Type | Description |
|-----------|------|-------------|
| status | string | Filtrer par statut |
| provider | string | Filtrer par opérateur |
| startDate | string | Date de début |
| endDate | string | Date de fin |
| limit | number | Limite (défaut: 50) |
| page | number | Page (défaut: 1) |

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 3
    }
  }
}
```

---

### Détails d'une Transaction

```http
GET /api/transactions/:id
```

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "64abc...",
      "transactionId": "TXN_...",
      "merchant": {...},
      "amount": 5000,
      "commission": {...},
      "netAmount": 4850,
      "status": "completed",
      ...
    }
  }
}
```

---

## 🏪 Marchands (Protégé)

### Liste des Marchands

```http
GET /api/merchants
```

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "merchants": [
      {
        "_id": "64abc...",
        "businessName": "Ma Boutique",
        "email": "boutique@example.com",
        "totalTransactions": 150,
        "totalRevenue": 750000,
        "isActive": true
      },
      ...
    ]
  }
}
```

---

### Profil Marchand

```http
GET /api/merchants/:id
```

**Headers** :
```
Authorization: Bearer {token}
```

---

### Mettre à Jour le Profil

```http
PUT /api/merchants/:id
```

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "businessName": "Nouveau Nom",
  "phone": "+22670000001",
  "address": "123 Rue de Ouaga"
}
```

---

## 📈 Analytics (Protégé)

### Dashboard

Obtenir les statistiques complètes du marchand.

```http
GET /api/analytics/dashboard
```

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "today": {
      "transactionCount": 15,
      "totalRevenue": 75000
    },
    "thisMonth": {
      "transactionCount": 120,
      "totalRevenue": 600000
    },
    "lifetime": {
      "totalTransactions": 500,
      "balance": 2500000
    },
    "recentTransactions": [...]
  }
}
```

---

### Transactions par Période

```http
GET /api/analytics/transactions-by-period?period=day
```

**Query Parameters** :
| Paramètre | Valeurs possibles |
|-----------|-------------------|
| period | `day`, `week`, `month`, `year` |

---

### Revenus par Opérateur

```http
GET /api/analytics/revenue-by-provider
```

**Réponse (200)** :
```json
{
  "success": true,
  "data": [
    {
      "_id": "orange_money",
      "totalRevenue": 450000,
      "totalTransactions": 200,
      "averageAmount": 2250
    },
    {
      "_id": "mtn_money",
      "totalRevenue": 350000,
      "totalTransactions": 150,
      "averageAmount": 2333
    }
  ]
}
```

---

## 📋 Codes de Réponse

### Codes HTTP

| Code | Signification | Description |
|------|--------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource non trouvée |
| 500 | Internal Server Error | Erreur serveur |

### Format de Réponse d'Erreur

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (dev only)"
}
```

---

## 🔒 Sécurité

### Headers Requis

Pour les routes protégées :

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Rate Limiting

- **Limite** : 100 requêtes par 15 minutes par IP
- **Header de réponse** : `X-RateLimit-Remaining`

---

## 💡 Exemples Pratiques

### Exemple cURL - Paiement Simple

```bash
curl -X POST http://localhost:5000/api/payment/payer \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "orange_money",
    "customerPhone": "+22670000000",
    "customerName": "Test User",
    "description": "Test payment"
  }'
```

### Exemple cURL - Agrégation

```bash
curl -X POST http://localhost:5000/api/aggregation/create \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "orange_money",
    "customerPhone": "+22670000000",
    "payments": [
      {"description": "Facture eau", "amount": 5000, "category": "facture_eau"},
      {"description": "Facture électricité", "amount": 15000, "category": "facture_electricite"}
    ]
  }'
```

### Exemple JavaScript - Fetch

```javascript
// Paiement simple
const response = await fetch('http://localhost:5000/api/payment/payer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 5000,
    paymentMethod: 'orange_money',
    customerPhone: '+22670000000',
    customerName: 'Client Test'
  })
});

const result = await response.json();
console.log(result);
```

---

## 📞 Support

Pour toute question sur l'API, consulter :
- [README principal](./README.md)
- [Guide de démarrage](./GUIDE_DEMARRAGE.md)

---

<div align="center">

**Documentation API PayAggregate v1.0**

[⬆ Retour en haut](#-documentation-api---payaggregate)

</div>
