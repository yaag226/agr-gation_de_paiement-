# 🔌 Documentation complète des API - PayBF

## Base URL
```
http://localhost:5000/api
```

---

## Table des matières

1. [Authentication API](#1-authentication-api)
2. [Client API](#2-client-api)
3. [Merchant API](#3-merchant-api)
4. [Admin API](#4-admin-api)
5. [Aggregation API](#5-aggregation-api)
6. [Analytics API](#6-analytics-api)
7. [Health Check](#7-health-check)
8. [Codes de statut HTTP](#8-codes-de-statut-http)
9. [Gestion des erreurs](#9-gestion-des-erreurs)

---

## 1. Authentication API

Base: `/api/auth`

### 1.1 Inscription (Register)

**Endpoint:** `POST /api/auth/register`

**Authentification:** Non requise

**Description:** Créer un nouveau compte utilisateur (Client, Marchand ou Admin)

**Body (Client):**
```json
{
  "firstName": "Salif",
  "lastName": "Traoré",
  "email": "salif@email.com",
  "password": "client123",
  "phone": "+22670123456",
  "role": "client"
}
```

**Body (Marchand):**
```json
{
  "firstName": "Amadou",
  "lastName": "Kaboré",
  "email": "amadou@boutique.bf",
  "password": "merchant123",
  "phone": "+22670456789",
  "role": "merchant",
  "businessName": "Boutique Amadou",
  "businessCategory": "Commerce"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674a1b2c3d4e5f6g7h8i9j0k",
    "firstName": "Salif",
    "lastName": "Traoré",
    "email": "salif@email.com",
    "phone": "+22670123456",
    "role": "client",
    "isActive": true,
    "totalSpent": 0,
    "transactionCount": 0,
    "createdAt": "2024-12-25T10:00:00.000Z"
  }
}
```

**Erreurs possibles:**
```json
// 400 - Email déjà utilisé
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}

// 400 - Validation échouée
{
  "success": false,
  "message": "Données invalides",
  "errors": [
    "Le mot de passe doit contenir au moins 6 caractères",
    "Le numéro de téléphone doit être au format burkinabè (+226)"
  ]
}

// 400 - Champs manquants pour marchand
{
  "success": false,
  "message": "Le nom commercial et la catégorie sont obligatoires pour les marchands"
}
```

**Validation:**
- `firstName`: Requis, string, 2-50 caractères
- `lastName`: Requis, string, 2-50 caractères
- `email`: Requis, format email valide, unique
- `password`: Requis, minimum 6 caractères
- `phone`: Requis, format +226XXXXXXXX
- `role`: Requis, enum: ['client', 'merchant', 'admin']
- `businessName`: Requis si role='merchant'
- `businessCategory`: Requis si role='merchant'

---

### 1.2 Connexion (Login)

**Endpoint:** `POST /api/auth/login`

**Authentification:** Non requise

**Description:** Se connecter avec email et mot de passe

**Body:**
```json
{
  "email": "salif@email.com",
  "password": "client123"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674a1b2c3d4e5f6g7h8i9j0k",
    "firstName": "Salif",
    "lastName": "Traoré",
    "email": "salif@email.com",
    "role": "client",
    "isActive": true
  }
}
```

**Erreurs possibles:**
```json
// 401 - Identifiants invalides
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}

// 403 - Compte désactivé
{
  "success": false,
  "message": "Votre compte a été désactivé. Contactez l'administrateur."
}

// 400 - Champs manquants
{
  "success": false,
  "message": "L'email et le mot de passe sont requis"
}
```

---

### 1.3 Profil utilisateur

**Endpoint:** `GET /api/auth/profile`

**Authentification:** Requise (JWT)

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "674a1b2c3d4e5f6g7h8i9j0k",
    "firstName": "Salif",
    "lastName": "Traoré",
    "email": "salif@email.com",
    "phone": "+22670123456",
    "role": "client",
    "isActive": true,
    "totalSpent": 45000,
    "transactionCount": 12,
    "createdAt": "2024-12-25T10:00:00.000Z"
  }
}
```

**Erreurs possibles:**
```json
// 401 - Token manquant ou invalide
{
  "success": false,
  "message": "Non autorisé, token manquant"
}

// 401 - Token expiré
{
  "success": false,
  "message": "Token expiré, veuillez vous reconnecter"
}
```

---

## 2. Client API

Base: `/api/client`

**Authentification:** Requise - Rôle: `client`

### 2.1 Créer un paiement

**Endpoint:** `POST /api/client/payments`

**Description:** Effectuer un nouveau paiement vers un marchand

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "merchantId": "674a1b2c3d4e5f6g7h8i9j0k",
  "amount": 5000,
  "paymentMethod": "Orange Money",
  "description": "Achat de vêtements"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "payment": {
    "id": "674a1b2c3d4e5f6g7h8i9j0k",
    "transactionId": "TXN-1703512800000-ABC123",
    "client": {
      "id": "...",
      "firstName": "Salif",
      "lastName": "Traoré",
      "email": "salif@email.com"
    },
    "merchant": {
      "id": "...",
      "firstName": "Amadou",
      "lastName": "Kaboré",
      "businessName": "Boutique Amadou"
    },
    "amount": 5000,
    "fees": 125,
    "netAmount": 4875,
    "paymentMethod": "Orange Money",
    "status": "SUCCESS",
    "description": "Achat de vêtements",
    "createdAt": "2024-12-25T12:00:00.000Z"
  }
}
```

**Erreurs possibles:**
```json
// 404 - Marchand non trouvé
{
  "success": false,
  "message": "Marchand non trouvé"
}

// 403 - Marchand inactif
{
  "success": false,
  "message": "Le marchand n'accepte pas les paiements actuellement"
}

// 400 - Montant invalide
{
  "success": false,
  "message": "Le montant doit être entre 100 et 1000000 FCFA"
}

// 400 - Méthode invalide
{
  "success": false,
  "message": "Méthode de paiement non supportée",
  "validMethods": ["Orange Money", "Moov Money", "Coris Money", "Carte Bancaire"]
}

// 500 - Paiement échoué
{
  "success": false,
  "message": "Le paiement a échoué",
  "payment": {
    "transactionId": "TXN-1703512800000-ABC123",
    "status": "FAILED",
    "reason": "Fonds insuffisants"
  }
}
```

**Validation:**
- `merchantId`: Requis, MongoDB ObjectId valide
- `amount`: Requis, number, min: 100, max: 1000000
- `paymentMethod`: Requis, enum: ['Orange Money', 'Moov Money', 'Coris Money', 'Carte Bancaire']
- `description`: Optionnel, string, max 500 caractères

---

### 2.2 Historique des paiements

**Endpoint:** `GET /api/client/payments`

**Description:** Récupérer l'historique de tous les paiements effectués

**Query Parameters:**
- `status` (optionnel): Filter par statut - enum: ['SUCCESS', 'FAILED', 'PENDING']
- `page` (optionnel): Numéro de page - default: 1
- `limit` (optionnel): Résultats par page - default: 10, max: 100

**Exemple:**
```
GET /api/client/payments?status=SUCCESS&page=1&limit=10
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "payments": [
    {
      "id": "674a1b2c3d4e5f6g7h8i9j0k",
      "transactionId": "TXN-1703512800000-ABC123",
      "merchant": {
        "id": "...",
        "businessName": "Boutique Amadou",
        "businessCategory": "Commerce"
      },
      "amount": 5000,
      "fees": 125,
      "netAmount": 4875,
      "paymentMethod": "Orange Money",
      "status": "SUCCESS",
      "description": "Achat de vêtements",
      "createdAt": "2024-12-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

---

### 2.3 Statistiques Client

**Endpoint:** `GET /api/client/stats`

**Description:** Obtenir les statistiques personnelles du client

**Réponse (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalSpent": 45000,
    "totalTransactions": 12,
    "successfulPayments": 10,
    "failedPayments": 2,
    "pendingPayments": 0,
    "totalFees": 1125,
    "successRate": 83.33,
    "averageAmount": 3750,
    "byPaymentMethod": [
      {
        "method": "Orange Money",
        "count": 6,
        "totalAmount": 22000
      },
      {
        "method": "Moov Money",
        "count": 4,
        "totalAmount": 15000
      },
      {
        "method": "Carte Bancaire",
        "count": 2,
        "totalAmount": 8000
      }
    ],
    "last7Days": [
      {
        "date": "2024-12-19",
        "transactions": 2,
        "amount": 8000
      },
      {
        "date": "2024-12-20",
        "transactions": 1,
        "amount": 3500
      }
    ]
  }
}
```

---

### 2.4 Liste des marchands

**Endpoint:** `GET /api/client/merchants`

**Description:** Récupérer la liste de tous les marchands actifs

**Réponse (200 OK):**
```json
{
  "success": true,
  "merchants": [
    {
      "id": "674a1b2c3d4e5f6g7h8i9j0k",
      "firstName": "Amadou",
      "lastName": "Kaboré",
      "businessName": "Boutique Amadou",
      "businessCategory": "Commerce",
      "email": "amadou@boutique.bf",
      "phone": "+22670456789",
      "isActive": true,
      "totalReceived": 125000,
      "transactionCount": 34
    }
  ]
}
```

---

## 3. Merchant API

Base: `/api/merchant`

**Authentification:** Requise - Rôle: `merchant`

### 3.1 Paiements reçus

**Endpoint:** `GET /api/merchant/payments`

**Description:** Récupérer tous les paiements reçus

**Query Parameters:**
- `status` (optionnel): Filter par statut
- `startDate` (optionnel): Date de début (ISO 8601)
- `endDate` (optionnel): Date de fin (ISO 8601)
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Résultats par page

**Exemple:**
```
GET /api/merchant/payments?status=SUCCESS&startDate=2024-12-01&endDate=2024-12-31&page=1&limit=20
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "payments": [
    {
      "id": "674a1b2c3d4e5f6g7h8i9j0k",
      "transactionId": "TXN-1703512800000-ABC123",
      "client": {
        "id": "...",
        "firstName": "Salif",
        "lastName": "Traoré",
        "email": "salif@email.com",
        "phone": "+22670123456"
      },
      "amount": 5000,
      "fees": 125,
      "netAmount": 4875,
      "paymentMethod": "Orange Money",
      "status": "SUCCESS",
      "description": "Achat de vêtements",
      "createdAt": "2024-12-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 8,
    "limit": 20
  }
}
```

---

### 3.2 Tableau de bord Marchand

**Endpoint:** `GET /api/merchant/dashboard`

**Description:** Obtenir les données du tableau de bord

**Réponse (200 OK):**
```json
{
  "success": true,
  "dashboard": {
    "totalReceived": 487500,
    "totalTransactions": 156,
    "successfulPayments": 140,
    "failedPayments": 16,
    "pendingPayments": 0,
    "totalFees": 12187.50,
    "netRevenue": 475312.50,
    "successRate": 89.74,
    "averageTransaction": 3125,
    "last7DaysRevenue": [
      {
        "date": "2024-12-19",
        "revenue": 12500,
        "transactions": 4
      },
      {
        "date": "2024-12-20",
        "revenue": 18000,
        "transactions": 6
      }
    ],
    "byPaymentMethod": [
      {
        "method": "Orange Money",
        "count": 85,
        "totalAmount": 265000,
        "percentage": 54.37
      },
      {
        "method": "Moov Money",
        "count": 45,
        "totalAmount": 140000,
        "percentage": 28.72
      }
    ],
    "topClients": [
      {
        "clientId": "...",
        "clientName": "Salif Traoré",
        "totalSpent": 45000,
        "transactionCount": 12
      }
    ]
  }
}
```

---

### 3.3 Statistiques Marchand

**Endpoint:** `GET /api/merchant/stats`

**Description:** Statistiques par période

**Query Parameters:**
- `period` (optionnel): 7, 30 ou 90 jours - default: 30

**Exemple:**
```
GET /api/merchant/stats?period=7
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "period": 7,
  "stats": {
    "totalReceived": 87500,
    "transactionCount": 28,
    "successRate": 92.86,
    "averageTransaction": 3125,
    "totalFees": 2187.50,
    "growthRate": 12.5
  }
}
```

---

## 4. Admin API

Base: `/api/admin`

**Authentification:** Requise - Rôle: `admin`

### 4.1 Liste des utilisateurs

**Endpoint:** `GET /api/admin/users`

**Description:** Récupérer tous les utilisateurs

**Query Parameters:**
- `role` (optionnel): Filter par rôle - enum: ['client', 'merchant', 'admin']
- `isActive` (optionnel): Filter par statut - boolean
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Résultats par page

**Exemple:**
```
GET /api/admin/users?role=merchant&isActive=true&page=1&limit=20
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "674a1b2c3d4e5f6g7h8i9j0k",
      "firstName": "Salif",
      "lastName": "Traoré",
      "email": "salif@email.com",
      "phone": "+22670123456",
      "role": "client",
      "isActive": true,
      "totalSpent": 45000,
      "transactionCount": 12,
      "createdAt": "2024-12-25T10:00:00.000Z",
      "lastLogin": "2024-12-25T15:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "pages": 13,
    "limit": 20
  }
}
```

---

### 4.2 Activer/Désactiver un utilisateur

**Endpoint:** `PATCH /api/admin/users/:id/toggle-status`

**Description:** Changer le statut d'activation d'un utilisateur

**Params:**
- `id`: ID de l'utilisateur (MongoDB ObjectId)

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Statut de l'utilisateur modifié avec succès",
  "user": {
    "id": "674a1b2c3d4e5f6g7h8i9j0k",
    "firstName": "Salif",
    "lastName": "Traoré",
    "email": "salif@email.com",
    "isActive": false
  }
}
```

**Erreurs possibles:**
```json
// 403 - Tentative de désactiver un admin
{
  "success": false,
  "message": "Impossible de désactiver un compte administrateur"
}

// 404 - Utilisateur non trouvé
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

---

### 4.3 Toutes les transactions

**Endpoint:** `GET /api/admin/payments`

**Description:** Récupérer toutes les transactions de la plateforme

**Query Parameters:**
- `status` (optionnel): Filter par statut
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Résultats par page

**Réponse (200 OK):**
```json
{
  "success": true,
  "payments": [
    {
      "id": "674a1b2c3d4e5f6g7h8i9j0k",
      "transactionId": "TXN-1703512800000-ABC123",
      "client": {
        "id": "...",
        "firstName": "Salif",
        "lastName": "Traoré",
        "email": "salif@email.com"
      },
      "merchant": {
        "id": "...",
        "firstName": "Amadou",
        "lastName": "Kaboré",
        "businessName": "Boutique Amadou"
      },
      "amount": 5000,
      "fees": 125,
      "netAmount": 4875,
      "paymentMethod": "Orange Money",
      "status": "SUCCESS",
      "createdAt": "2024-12-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pages": 63,
    "limit": 20
  }
}
```

---

### 4.4 Tableau de bord Admin

**Endpoint:** `GET /api/admin/dashboard`

**Description:** Vue d'ensemble complète de la plateforme

**Réponse (200 OK):**
```json
{
  "success": true,
  "dashboard": {
    "users": {
      "total": 250,
      "clients": 200,
      "merchants": 45,
      "admins": 5,
      "active": 230,
      "inactive": 20
    },
    "transactions": {
      "total": 1250,
      "successful": 1125,
      "failed": 100,
      "pending": 25,
      "successRate": 90
    },
    "financial": {
      "totalVolume": 6250000,
      "totalFees": 156250,
      "averageTransaction": 5000
    },
    "byPaymentMethod": [
      {
        "method": "Orange Money",
        "count": 650,
        "totalAmount": 3250000,
        "percentage": 52
      }
    ],
    "last30Days": [
      {
        "date": "2024-12-01",
        "transactions": 45,
        "volume": 225000
      }
    ],
    "topMerchants": [
      {
        "id": "...",
        "businessName": "Boutique Amadou",
        "totalReceived": 487500,
        "transactionCount": 156
      }
    ],
    "recentTransactions": [
      {
        "transactionId": "TXN-1703512800000-ABC123",
        "clientName": "Salif Traoré",
        "merchantName": "Boutique Amadou",
        "amount": 5000,
        "status": "SUCCESS",
        "createdAt": "2024-12-25T12:00:00.000Z"
      }
    ]
  }
}
```

---

### 4.5 Statistiques globales

**Endpoint:** `GET /api/admin/stats`

**Description:** Statistiques agrégées de toute la plateforme

**Réponse (200 OK):**
```json
{
  "success": true,
  "stats": {
    "overview": {
      "totalUsers": 250,
      "totalTransactions": 1250,
      "totalVolume": 6250000,
      "totalFees": 156250,
      "successRate": 90
    },
    "growth": {
      "userGrowth": 15.5,
      "transactionGrowth": 22.3,
      "volumeGrowth": 18.7
    },
    "byRole": {
      "clients": {
        "count": 200,
        "averageSpent": 31250
      },
      "merchants": {
        "count": 45,
        "averageReceived": 138888
      }
    }
  }
}
```

---

## 5. Aggregation API

Base: `/api/aggregation`

**Authentification:** Requise

### 5.1 Statistiques agrégées

**Endpoint:** `GET /api/aggregation/stats`

**Description:** Statistiques agrégées par statut

**Réponse (200 OK):**
```json
{
  "success": true,
  "stats": [
    {
      "_id": "SUCCESS",
      "count": 1125,
      "totalAmount": 5625000,
      "avgAmount": 5000
    },
    {
      "_id": "FAILED",
      "count": 100,
      "totalAmount": 500000,
      "avgAmount": 5000
    },
    {
      "_id": "PENDING",
      "count": 25,
      "totalAmount": 125000,
      "avgAmount": 5000
    }
  ]
}
```

---

### 5.2 Statistiques par méthode

**Endpoint:** `GET /api/aggregation/by-method`

**Description:** Agrégation par méthode de paiement

**Réponse (200 OK):**
```json
{
  "success": true,
  "stats": [
    {
      "_id": "Orange Money",
      "count": 650,
      "totalAmount": 3250000,
      "successCount": 585
    },
    {
      "_id": "Moov Money",
      "count": 350,
      "totalAmount": 1750000,
      "successCount": 315
    },
    {
      "_id": "Coris Money",
      "count": 150,
      "totalAmount": 750000,
      "successCount": 135
    },
    {
      "_id": "Carte Bancaire",
      "count": 100,
      "totalAmount": 500000,
      "successCount": 90
    }
  ]
}
```

---

## 6. Analytics API

Base: `/api/analytics`

**Authentification:** Requise

### 6.1 Analytics par période

**Endpoint:** `GET /api/analytics/period`

**Description:** Analytics pour une période donnée

**Query Parameters:**
- `startDate` (requis): Date de début (ISO 8601)
- `endDate` (requis): Date de fin (ISO 8601)

**Exemple:**
```
GET /api/analytics/period?startDate=2024-12-01&endDate=2024-12-31
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "period": {
    "startDate": "2024-12-01",
    "endDate": "2024-12-31"
  },
  "analytics": [
    {
      "_id": "2024-12-01",
      "totalTransactions": 45,
      "totalAmount": 225000,
      "successCount": 40,
      "failedCount": 5
    },
    {
      "_id": "2024-12-02",
      "totalTransactions": 52,
      "totalAmount": 260000,
      "successCount": 47,
      "failedCount": 5
    }
  ]
}
```

**Erreurs possibles:**
```json
// 400 - Dates manquantes
{
  "success": false,
  "message": "Les dates de début et de fin sont requises"
}
```

---

### 6.2 Analytics par utilisateur

**Endpoint:** `GET /api/analytics/user/:userId`

**Description:** Analytics pour un utilisateur spécifique

**Params:**
- `userId`: ID de l'utilisateur

**Exemple:**
```
GET /api/analytics/user/674a1b2c3d4e5f6g7h8i9j0k
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "userId": "674a1b2c3d4e5f6g7h8i9j0k",
  "userRole": "client",
  "analytics": [
    {
      "_id": "SUCCESS",
      "count": 10,
      "totalAmount": 45000
    },
    {
      "_id": "FAILED",
      "count": 2,
      "totalAmount": 10000
    }
  ]
}
```

**Erreurs possibles:**
```json
// 404 - Utilisateur non trouvé
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

---

## 7. Health Check

**Endpoint:** `GET /health`

**Authentification:** Non requise

**Description:** Vérifier l'état du serveur

**Réponse (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2024-12-25T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "database": "connected"
}
```

---

## 8. Codes de statut HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **400** | Bad Request | Données invalides ou manquantes |
| **401** | Unauthorized | Authentification requise ou token invalide |
| **403** | Forbidden | Accès refusé (rôle insuffisant) |
| **404** | Not Found | Ressource non trouvée |
| **429** | Too Many Requests | Limite de taux dépassée |
| **500** | Internal Server Error | Erreur serveur |

---

## 9. Gestion des erreurs

### Format standard des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (en développement uniquement)"
}
```

### Erreurs d'authentification

```json
// Token manquant
{
  "success": false,
  "message": "Non autorisé, token manquant"
}

// Token invalide
{
  "success": false,
  "message": "Token invalide"
}

// Token expiré
{
  "success": false,
  "message": "Token expiré, veuillez vous reconnecter"
}
```

### Erreurs d'autorisation

```json
// Rôle insuffisant
{
  "success": false,
  "message": "Accès refusé. Rôle requis: admin"
}
```

### Erreurs de validation

```json
{
  "success": false,
  "message": "Données invalides",
  "errors": [
    "Le champ 'email' doit être un email valide",
    "Le mot de passe doit contenir au moins 6 caractères"
  ]
}
```

### Limite de taux (Rate Limiting)

```json
{
  "success": false,
  "message": "Trop de requêtes, veuillez réessayer plus tard",
  "retryAfter": 900
}
```

---

## 10. Notes importantes

### Authentification
- Tous les endpoints (sauf `/auth/register`, `/auth/login`, et `/health`) requièrent un token JWT
- Le token doit être inclus dans le header `Authorization: Bearer {token}`
- Les tokens expirent après 7 jours
- Un nouveau token est généré à chaque connexion

### Pagination
- Par défaut : 10 résultats par page
- Maximum : 100 résultats par page
- Format de réponse standardisé avec objet `pagination`

### Dates
- Toutes les dates sont au format ISO 8601
- Timezone : UTC
- Format : `YYYY-MM-DDTHH:mm:ss.sssZ`

### Montants
- Devise : FCFA (Franc CFA)
- Frais : 2.5% de chaque transaction
- Minimum : 100 FCFA
- Maximum : 1,000,000 FCFA

### Rate Limiting
- 100 requêtes par 15 minutes par adresse IP
- Header `X-RateLimit-Remaining` indique le nombre de requêtes restantes

---

## 11. Exemples avec cURL

### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@email.bf",
    "password": "test123",
    "phone": "+22670111111",
    "role": "client"
  }'
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

### Créer un paiement
```bash
curl -X POST http://localhost:5000/api/client/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "merchantId": "MERCHANT_ID",
    "amount": 5000,
    "paymentMethod": "Orange Money",
    "description": "Test de paiement"
  }'
```

### Obtenir le profil
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Version:** 1.0.0
**Dernière mise à jour:** Décembre 2024
**Base URL:** `http://localhost:5000/api`
