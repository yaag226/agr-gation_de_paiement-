# Liste Complète des API - Payment Aggregator

## Résumé
Cette application fournit **19 endpoints API** répartis en 4 catégories principales.

---

## 📋 Table des Matières
1. [Authentication APIs (5)](#authentication-apis)
2. [Merchant Management APIs (6)](#merchant-management-apis)
3. [Transaction APIs (5)](#transaction-apis)
4. [Analytics & Reports APIs (4)](#analytics--reports-apis)

---

## Authentication APIs

### 1. POST /api/auth/register
**Description :** Créer un nouveau compte utilisateur
**Authentification :** Non
**Rôles :** Public
**Body :**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "merchant|customer",
  "businessName": "string" (si merchant)
}
```

### 2. POST /api/auth/login
**Description :** Se connecter et obtenir un token JWT
**Authentification :** Non
**Rôles :** Public
**Body :**
```json
{
  "email": "string",
  "password": "string"
}
```

### 3. GET /api/auth/me
**Description :** Obtenir le profil de l'utilisateur connecté
**Authentification :** Oui
**Rôles :** Tous

### 4. PUT /api/auth/update-profile
**Description :** Mettre à jour le profil utilisateur
**Authentification :** Oui
**Rôles :** Tous
**Body :**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string"
}
```

### 5. PUT /api/auth/change-password
**Description :** Changer le mot de passe
**Authentification :** Oui
**Rôles :** Tous
**Body :**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## Merchant Management APIs

### 6. GET /api/merchants
**Description :** Liste de tous les marchands (avec pagination)
**Authentification :** Oui
**Rôles :** Admin uniquement
**Query Params :**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (optionnel)
- `isVerified` (boolean)
- `isActive` (boolean)

### 7. GET /api/merchants/:id
**Description :** Détails d'un marchand spécifique
**Authentification :** Oui
**Rôles :** Merchant (propriétaire), Admin

### 8. PUT /api/merchants/:id
**Description :** Mettre à jour les informations du marchand
**Authentification :** Oui
**Rôles :** Merchant (propriétaire), Admin
**Body :**
```json
{
  "businessName": "string",
  "businessType": "individual|company|association",
  "description": "string",
  "website": "string",
  "address": {
    "street": "string",
    "city": "string",
    "country": "string",
    "postalCode": "string"
  }
}
```

### 9. GET /api/merchants/stats
**Description :** Statistiques du marchand connecté
**Authentification :** Oui
**Rôles :** Merchant
**Retourne :**
- Total transactions
- Transactions complétées/échouées
- Revenus totaux
- Commissions
- Statistiques par provider

### 10. POST /api/merchants/provider-config
**Description :** Ajouter une configuration de provider de paiement
**Authentification :** Oui
**Rôles :** Merchant
**Body :**
```json
{
  "provider": "stripe|paypal|wave",
  "apiKey": "string",
  "secretKey": "string",
  "webhookSecret": "string" (optionnel),
  "isActive": boolean,
  "priority": number
}
```

### 11. PUT /api/merchants/provider-config/:provider
**Description :** Mettre à jour la configuration d'un provider
**Authentification :** Oui
**Rôles :** Merchant
**Body :**
```json
{
  "isActive": boolean,
  "priority": number,
  "apiKey": "string",
  "secretKey": "string"
}
```

### 12. DELETE /api/merchants/provider-config/:provider
**Description :** Supprimer la configuration d'un provider
**Authentification :** Oui
**Rôles :** Merchant

---

## Transaction APIs

### 13. POST /api/transactions/initiate
**Description :** Initier une nouvelle transaction de paiement
**Authentification :** Oui
**Rôles :** Merchant, Admin
**Body :**
```json
{
  "amount": number,
  "currency": "EUR|USD|GBP|XOF",
  "provider": "stripe|paypal|wave" (optionnel),
  "customerEmail": "string",
  "customerName": "string" (optionnel),
  "description": "string" (optionnel),
  "metadata": object (optionnel)
}
```
**Retourne :**
- Transaction créée
- Payment URL pour compléter le paiement
- Commission calculée

### 14. GET /api/transactions
**Description :** Liste des transactions avec filtres et pagination
**Authentification :** Oui
**Rôles :** Merchant (ses transactions), Admin (toutes)
**Query Params :**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (pending|processing|completed|failed|refunded)
- `provider` (stripe|paypal|wave)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)

### 15. GET /api/transactions/:id
**Description :** Détails complets d'une transaction
**Authentification :** Oui
**Rôles :** Merchant (propriétaire), Admin
**Retourne :**
- Informations complètes de la transaction
- Détails du client
- Commission détaillée
- Statut et historique

### 16. POST /api/transactions/:id/refund
**Description :** Rembourser une transaction
**Authentification :** Oui
**Rôles :** Merchant (propriétaire), Admin
**Body :**
```json
{
  "amount": number (optionnel, défaut: montant total),
  "reason": "string"
}
```
**Conditions :**
- Transaction doit être en statut "completed"
- Pas déjà remboursée

### 17. POST /api/transactions/webhooks/:provider
**Description :** Recevoir les webhooks des providers de paiement
**Authentification :** Non (signature vérifiée par le provider)
**Rôles :** Public
**Providers supportés :**
- `/api/transactions/webhooks/stripe`
- `/api/transactions/webhooks/paypal`
- `/api/transactions/webhooks/wave`

---

## Analytics & Reports APIs

### 18. GET /api/analytics/dashboard
**Description :** Données du tableau de bord pour le marchand
**Authentification :** Oui
**Rôles :** Merchant, Admin
**Retourne :**
- Statistiques du jour
- Statistiques du mois
- Statistiques lifetime
- Transactions récentes (10 dernières)

### 19. GET /api/analytics/revenue
**Description :** Analyse des revenus par période
**Authentification :** Oui
**Rôles :** Merchant, Admin
**Query Params :**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `groupBy` (day|month|year, default: day)
**Retourne :**
- Résumé de la période
- Breakdown par jour/mois/année
- Revenus totaux
- Commission totale
- Nombre de transactions

### 20. GET /api/analytics/providers
**Description :** Statistiques par provider de paiement
**Authentification :** Oui
**Rôles :** Merchant, Admin
**Retourne :**
- Pour chaque provider :
  - Nombre de transactions
  - Revenus générés
  - Montant moyen
  - Taux d'échec
  - Commission totale

### 21. GET /api/analytics/export
**Description :** Exporter les données de transactions
**Authentification :** Oui
**Rôles :** Merchant, Admin
**Query Params :**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `format` (json|csv, default: json)
**Formats supportés :**
- JSON : Objet complet avec toutes les données
- CSV : Format tabulaire pour Excel

---

## Endpoint Publics vs Protégés

### Endpoints Publics (2)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/transactions/webhooks/:provider

### Endpoints Protégés (18)
Nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

---

## Répartition par Rôle

### Admin (Accès Total : 21 endpoints)
- Tous les endpoints
- Accès à tous les marchands
- Accès à toutes les transactions

### Merchant (19 endpoints)
- Tous les endpoints sauf :
  - GET /api/merchants (liste complète)
- Accès limité à ses propres données

### Customer (5 endpoints)
- Endpoints d'authentification uniquement
- Pas d'accès aux fonctionnalités marchands

---

## Codes de Statut HTTP Utilisés

| Code | Utilisation |
|------|-------------|
| 200  | Succès - GET, PUT, DELETE |
| 201  | Créé avec succès - POST |
| 400  | Erreur de validation, requête invalide |
| 401  | Non authentifié (token manquant/invalide) |
| 403  | Non autorisé (mauvais rôle) |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur interne |

---

## Format Standard des Réponses

### Succès
```json
{
  "success": true,
  "data": {
    // Données spécifiques à l'endpoint
  },
  "count": 10,           // Pour les listes
  "totalPages": 5,       // Pour les listes paginées
  "currentPage": 1       // Pour les listes paginées
}
```

### Erreur
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [            // Pour erreurs de validation
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Pagination

Les endpoints suivants supportent la pagination :
- GET /api/merchants
- GET /api/transactions

**Query Parameters :**
- `page` : Numéro de page (default: 1)
- `limit` : Nombre d'éléments par page (default: 10 ou 20)

**Réponse :**
```json
{
  "success": true,
  "count": 150,
  "totalPages": 15,
  "currentPage": 1,
  "data": { ... }
}
```

---

## Filtrage et Recherche

### Merchants
- `search` : Recherche par nom ou email
- `isVerified` : Filtrer par statut de vérification
- `isActive` : Filtrer par statut actif/inactif

### Transactions
- `status` : Filtrer par statut
- `provider` : Filtrer par provider
- `startDate` / `endDate` : Période

---

## Rate Limiting

- **Fenêtre :** 15 minutes
- **Limite :** 100 requêtes par IP
- **Endpoints concernés :** Tous les `/api/*`

**Header de réponse en cas de dépassement :**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705315200
```

---

## Sécurité

### Mesures Implémentées
- ✅ JWT pour authentification
- ✅ Mots de passe hachés (bcrypt)
- ✅ Validation des entrées (Joi)
- ✅ Sanitization MongoDB
- ✅ CORS configuré
- ✅ Helmet pour headers sécurisés
- ✅ Rate limiting

### Permissions
- ✅ Vérification du rôle (authorize middleware)
- ✅ Vérification de propriété (isMerchantOwner)
- ✅ Token expiration (7 jours)

---

## Webhooks

### Providers Supportés
1. **Stripe**
   - Endpoint : `/api/transactions/webhooks/stripe`
   - Events : payment_intent.succeeded, payment_intent.payment_failed

2. **PayPal**
   - Endpoint : `/api/transactions/webhooks/paypal`
   - Events : PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED

3. **Wave**
   - Endpoint : `/api/transactions/webhooks/wave`
   - Events : completed, failed

---

## Commission Structure

### Provider Fees
- **Stripe :** 2.9%
- **PayPal :** 3.4%
- **Wave :** 1.0%

### Platform Fee
- **Tous providers :** 0.5%

### Calcul
```
Montant Transaction : 100€
Provider Fee (Stripe) : 2.90€
Platform Fee : 0.50€
Total Fees : 3.40€
Net Amount : 96.60€
```

---

## Currencies Supportées

- EUR (Euro)
- USD (Dollar US)
- GBP (Livre Sterling)
- XOF (Franc CFA)

---

## Limites de Transaction

- **Minimum :** 1 unité de devise
- **Maximum :** 1,000,000 unités (configurable)
- **Limite journalière :** 100,000 unités par marchand

---

## Résumé Final

✅ **21 endpoints API** développés et fonctionnels
✅ **4 catégories** : Auth, Merchants, Transactions, Analytics
✅ **3 rôles** : Admin, Merchant, Customer
✅ **3 providers** : Stripe, PayPal, Wave
✅ **Pagination** et **filtrage** avancés
✅ **Documentation complète** avec exemples
✅ **Sécurité** : JWT, validation, rate limiting
✅ **Webhooks** pour événements temps réel

---

Pour plus de détails sur chaque endpoint, consulter **API_DOCUMENTATION.md**.
