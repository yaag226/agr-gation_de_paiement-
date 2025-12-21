# Documentation API - Payment Aggregator

## URL de Base
```
http://localhost:5000/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header Authorization :
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Inscription (Register)

**Endpoint:** `POST /api/auth/register`

**Description:** Créer un nouveau compte utilisateur

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "merchant",
  "phone": "+33612345678",
  "businessName": "My Business"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "merchant",
      "merchant": "507f1f77bcf86cd799439012"
    }
  }
}
```

---

### 2. Connexion (Login)

**Endpoint:** `POST /api/auth/login`

**Description:** Se connecter avec email et mot de passe

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "merchant",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 3. Profil Utilisateur

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "merchant",
      "merchant": {
        "_id": "507f1f77bcf86cd799439012",
        "businessName": "My Business",
        "isVerified": true
      }
    }
  }
}
```

---

### 4. Mettre à jour le profil

**Endpoint:** `PUT /api/auth/update-profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+33612345679"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe Updated",
      "email": "john@example.com",
      "phone": "+33612345679"
    }
  }
}
```

---

## Merchant Endpoints

### 5. Liste des marchands (Admin uniquement)

**Endpoint:** `GET /api/merchants`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (optionnel)
- `isVerified` (true/false)
- `isActive` (true/false)

**Réponse (200):**
```json
{
  "success": true,
  "count": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": {
    "merchants": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "businessName": "Tech Store",
        "businessType": "company",
        "isVerified": true,
        "isActive": true,
        "totalRevenue": 15000.50,
        "totalTransactions": 120
      }
    ]
  }
}
```

---

### 6. Détails d'un marchand

**Endpoint:** `GET /api/merchants/:id`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "merchant": {
      "_id": "507f1f77bcf86cd799439012",
      "businessName": "Tech Store",
      "businessType": "company",
      "description": "Electronics store",
      "website": "https://techstore.com",
      "providers": [
        {
          "provider": "stripe",
          "isActive": true,
          "priority": 1
        }
      ],
      "balance": 5000.00,
      "totalRevenue": 15000.50
    }
  }
}
```

---

### 7. Statistiques du marchand

**Endpoint:** `GET /api/merchants/stats`

**Headers:** `Authorization: Bearer <merchant_token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTransactions": 150,
      "completedTransactions": 145,
      "failedTransactions": 5,
      "totalRevenue": 18500.00,
      "totalCommission": 550.00
    },
    "byProvider": [
      {
        "_id": "stripe",
        "count": 100,
        "revenue": 12000.00
      },
      {
        "_id": "paypal",
        "count": 50,
        "revenue": 6500.00
      }
    ]
  }
}
```

---

### 8. Ajouter une configuration de provider

**Endpoint:** `POST /api/merchants/provider-config`

**Headers:** `Authorization: Bearer <merchant_token>`

**Body:**
```json
{
  "provider": "stripe",
  "apiKey": "pk_test_...",
  "secretKey": "sk_test_...",
  "webhookSecret": "whsec_...",
  "isActive": true,
  "priority": 1
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Provider configuration added successfully",
  "data": {
    "merchant": {
      "_id": "507f1f77bcf86cd799439012",
      "providers": [
        {
          "provider": "stripe",
          "isActive": true,
          "priority": 1
        }
      ]
    }
  }
}
```

---

### 9. Mettre à jour une configuration de provider

**Endpoint:** `PUT /api/merchants/provider-config/:provider`

**Headers:** `Authorization: Bearer <merchant_token>`

**Body:**
```json
{
  "isActive": true,
  "priority": 2
}
```

---

### 10. Supprimer une configuration de provider

**Endpoint:** `DELETE /api/merchants/provider-config/:provider`

**Headers:** `Authorization: Bearer <merchant_token>`

**Réponse (200):**
```json
{
  "success": true,
  "message": "Provider configuration removed successfully"
}
```

---

## Transaction Endpoints

### 11. Initier une transaction

**Endpoint:** `POST /api/transactions/initiate`

**Headers:** `Authorization: Bearer <merchant_token>`

**Body:**
```json
{
  "amount": 100.00,
  "currency": "EUR",
  "provider": "stripe",
  "customerEmail": "customer@example.com",
  "customerName": "Jane Smith",
  "description": "Purchase order #12345",
  "metadata": {
    "orderId": "12345",
    "productId": "PROD-001"
  }
}
```

**Réponse (201):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439013",
      "transactionId": "TXN_1234567890_ABC123",
      "merchant": "507f1f77bcf86cd799439012",
      "provider": "stripe",
      "providerTransactionId": "pi_1234567890",
      "amount": 100.00,
      "currency": "EUR",
      "status": "pending",
      "customer": {
        "email": "customer@example.com",
        "name": "Jane Smith"
      },
      "commission": {
        "providerFee": 2.90,
        "platformFee": 0.50,
        "totalFee": 3.40
      },
      "netAmount": 96.60,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "paymentUrl": "https://checkout.stripe.com/..."
  }
}
```

---

### 12. Liste des transactions

**Endpoint:** `GET /api/transactions`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (pending/processing/completed/failed/refunded)
- `provider` (stripe/paypal/wave)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)

**Réponse (200):**
```json
{
  "success": true,
  "count": 150,
  "totalPages": 8,
  "currentPage": 1,
  "data": {
    "transactions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "transactionId": "TXN_1234567890_ABC123",
        "amount": 100.00,
        "currency": "EUR",
        "status": "completed",
        "provider": "stripe",
        "customer": {
          "email": "customer@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 13. Détails d'une transaction

**Endpoint:** `GET /api/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439013",
      "transactionId": "TXN_1234567890_ABC123",
      "merchant": {
        "_id": "507f1f77bcf86cd799439012",
        "businessName": "Tech Store"
      },
      "provider": "stripe",
      "providerTransactionId": "pi_1234567890",
      "amount": 100.00,
      "currency": "EUR",
      "status": "completed",
      "customer": {
        "email": "customer@example.com",
        "name": "Jane Smith"
      },
      "commission": {
        "providerFee": 2.90,
        "platformFee": 0.50,
        "totalFee": 3.40
      },
      "netAmount": 96.60,
      "paymentMethod": "card",
      "completedAt": "2024-01-15T10:35:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 14. Remboursement d'une transaction

**Endpoint:** `POST /api/transactions/:id/refund`

**Headers:** `Authorization: Bearer <merchant_token>`

**Body:**
```json
{
  "amount": 100.00,
  "reason": "Customer requested refund"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Transaction refunded successfully",
  "data": {
    "transaction": {
      "_id": "507f1f77bcf86cd799439013",
      "status": "refunded",
      "refund": {
        "isRefunded": true,
        "refundedAmount": 100.00,
        "refundDate": "2024-01-16T14:30:00.000Z",
        "refundReason": "Customer requested refund"
      }
    }
  }
}
```

---

### 15. Webhook (Public - pas d'auth)

**Endpoint:** `POST /api/transactions/webhooks/:provider`

**Description:** Reçoit les webhooks des providers de paiement

**Exemple pour Stripe:**
```
POST /api/transactions/webhooks/stripe
```

**Headers:**
- `stripe-signature` (pour Stripe)

**Body:** Payload du provider

---

## Analytics Endpoints

### 16. Dashboard

**Endpoint:** `GET /api/analytics/dashboard`

**Headers:** `Authorization: Bearer <merchant_token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "today": {
      "totalRevenue": 500.00,
      "transactionCount": 5
    },
    "thisMonth": {
      "totalRevenue": 8500.00,
      "transactionCount": 85
    },
    "lifetime": {
      "totalRevenue": 50000.00,
      "totalTransactions": 500,
      "balance": 45000.00
    },
    "recentTransactions": [...]
  }
}
```

---

### 17. Revenus par période

**Endpoint:** `GET /api/analytics/revenue`

**Headers:** `Authorization: Bearer <merchant_token>`

**Query Parameters:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `groupBy` (day/month/year, default: day)

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "summary": {
      "totalRevenue": 8500.00,
      "totalAmount": 9000.00,
      "totalCommission": 500.00,
      "transactionCount": 85
    },
    "breakdown": [
      {
        "_id": "2024-01-15",
        "totalRevenue": 500.00,
        "totalAmount": 520.00,
        "totalCommission": 20.00,
        "transactionCount": 5,
        "avgTransaction": 104.00
      }
    ]
  }
}
```

---

### 18. Statistiques par provider

**Endpoint:** `GET /api/analytics/providers`

**Headers:** `Authorization: Bearer <merchant_token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "_id": "stripe",
        "totalTransactions": 300,
        "totalRevenue": 30000.00,
        "totalAmount": 31500.00,
        "totalCommission": 1500.00,
        "avgTransactionAmount": 105.00,
        "failureRate": 2.5
      }
    ]
  }
}
```

---

### 19. Export de données

**Endpoint:** `GET /api/analytics/export`

**Headers:** `Authorization: Bearer <merchant_token>`

**Query Parameters:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `format` (json/csv, default: json)

**Réponse (200):**
```json
{
  "success": true,
  "count": 150,
  "data": {
    "transactions": [...]
  }
}
```

Ou pour CSV :
```csv
TransactionID,Date,Amount,Currency,Status,Provider,CustomerEmail,NetAmount,Commission
TXN_123,2024-01-15,100.00,EUR,completed,stripe,customer@test.com,96.60,3.40
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Erreur de validation |
| 401  | Non authentifié |
| 403  | Non autorisé |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |

## Format d'erreur

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Exemples d'utilisation avec cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant1@test.com",
    "password": "Merchant123!"
  }'
```

### Créer une transaction
```bash
curl -X POST http://localhost:5000/api/transactions/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 100,
    "currency": "EUR",
    "customerEmail": "customer@test.com",
    "description": "Test payment"
  }'
```

### Obtenir les statistiques
```bash
curl -X GET http://localhost:5000/api/merchants/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```
