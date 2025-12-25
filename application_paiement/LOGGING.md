# Système de Logging - Documentation

## Vue d'ensemble

Ce projet implémente un système de logging complet pour faciliter la détection et le débogage des erreurs :

- **Backend** : Système de logging basé sur Winston avec rotation de fichiers
- **Frontend** : Logger personnalisé pour le navigateur avec stockage local

---

## Backend - Winston Logger

### Configuration

Le logger backend est configuré dans `/backend/src/config/logger.js` avec :

- **Niveaux de log** : error, warn, info, http, debug
- **Rotation quotidienne** des fichiers de logs
- **Fichiers séparés** pour les erreurs et les logs généraux
- **Logs en console** avec couleurs en mode développement

### Emplacement des logs

Les logs sont stockés dans `/backend/logs/` :

```
backend/logs/
├── application-2025-12-25.log    # Tous les logs du jour
├── error-2025-12-25.log          # Erreurs uniquement
└── ...
```

### Rétention des logs

- **Logs applicatifs** : conservés 14 jours
- **Logs d'erreurs** : conservés 30 jours
- **Taille maximale par fichier** : 20 Mo

### Utilisation

```javascript
const logger = require('../config/logger');

// Logs simples
logger.error('Message d\'erreur', { contextData });
logger.warn('Avertissement', { contextData });
logger.info('Information', { contextData });
logger.debug('Débogage', { contextData });

// Méthodes spécialisées
logger.logRequest(req, 'Message', { metadata });
logger.logError(error, req, { metadata });
logger.logAuth('login', email, success, req, { metadata });
logger.logPayment('create', paymentId, amount, status, { metadata });
logger.logDatabase('connect', collection, success, { metadata });
```

### Logs automatiques

Le système enregistre automatiquement :

✅ Toutes les requêtes HTTP (méthode, URL, status, durée)
✅ Connexions/déconnexions à MongoDB
✅ Tentatives d'authentification (succès et échecs)
✅ Erreurs non gérées et rejets de promesses
✅ Opérations de paiement (création, traitement)
✅ Modifications administratives (activation/désactivation de comptes)

### Variables d'environnement

```env
LOG_LEVEL=debug          # Niveau de log (error, warn, info, http, debug)
NODE_ENV=development     # Active les logs en console
```

---

## Frontend - Browser Logger

### Configuration

Le logger frontend est disponible dans `/frontend/src/utils/logger.js`.

### Fonctionnalités

- **Stockage dans localStorage** (max 100 logs)
- **Capture automatique** des erreurs JavaScript et promesses rejetées
- **Export des logs** en format JSON
- **Logs colorés** en console en mode développement

### Utilisation

```javascript
import logger from '../utils/logger';

// Logs simples
logger.error('Message d\'erreur', { contextData });
logger.warn('Avertissement', { contextData });
logger.info('Information', { contextData });
logger.debug('Débogage - dev uniquement', { contextData });

// Méthodes spécialisées
logger.logAPIError(error, { context });
logger.logAPISuccess(response, { context });
logger.logUserAction('action_name', { metadata });
logger.logAuth('login', success, { metadata });
logger.logReactError(error, errorInfo);
```

### Logs automatiques

Le système enregistre automatiquement :

✅ Toutes les requêtes API (success et erreurs)
✅ Erreurs JavaScript non gérées
✅ Promesses rejetées non gérées
✅ Actions d'authentification
✅ Erreurs réseau

### Consulter les logs frontend

Dans la console du navigateur :

```javascript
// Récupérer tous les logs
logger.getLogs();

// Exporter les logs en fichier JSON
logger.exportLogs();

// Effacer tous les logs
logger.clearLogs();
```

### Accès aux logs dans DevTools

Les logs sont stockés dans `localStorage` sous la clé `app_logs` :

```javascript
// Dans la console du navigateur
localStorage.getItem('app_logs');
```

---

## Exemples de logs

### Tentative de connexion réussie (Backend)

```json
{
  "timestamp": "2025-12-25 10:30:15",
  "level": "info",
  "message": "Auth: login",
  "type": "login",
  "email": "user@example.com",
  "success": true,
  "ip": "192.168.1.1",
  "userId": "abc123",
  "role": "client"
}
```

### Erreur de paiement (Backend)

```json
{
  "timestamp": "2025-12-25 10:35:22",
  "level": "warn",
  "message": "Paiement échoué",
  "paymentId": "pay_xyz789",
  "clientId": "abc123",
  "merchantId": "merchant_456",
  "amount": 50.00,
  "failureReason": "Insufficient funds"
}
```

### Erreur API (Frontend)

```json
{
  "timestamp": "2025-12-25T10:40:30.123Z",
  "level": "error",
  "message": "Erreur API",
  "status": 400,
  "endpoint": "/api/client/payments",
  "method": "POST",
  "url": "http://localhost:3000/dashboard"
}
```

---

## Bonnes pratiques

### Ce qu'il faut logger

✅ Tentatives d'authentification (succès et échecs)
✅ Opérations critiques (paiements, modifications de comptes)
✅ Erreurs et exceptions
✅ Violations de sécurité (accès non autorisé)
✅ Opérations administratives
✅ Problèmes de connexion à la base de données

### Ce qu'il ne faut PAS logger

❌ Mots de passe ou tokens en clair
❌ Données sensibles (numéros de carte, SSN, etc.)
❌ Données personnelles excessives (RGPD)
❌ Logs trop verbeux qui polluent les fichiers

### Niveaux de log recommandés

- **error** : Erreurs graves nécessitant une attention immédiate
- **warn** : Situations anormales mais gérables (tentative de connexion échouée, etc.)
- **info** : Événements importants normaux (connexion réussie, paiement effectué)
- **http** : Requêtes HTTP (activé automatiquement)
- **debug** : Informations de débogage détaillées (dev uniquement)

---

## Monitoring et alertes

### Surveillance des logs

Pour surveiller les logs en temps réel :

```bash
# Tous les logs
tail -f backend/logs/application-$(date +%Y-%m-%d).log

# Erreurs uniquement
tail -f backend/logs/error-$(date +%Y-%m-%d).log

# Filtrer par type
tail -f backend/logs/application-*.log | grep "Payment:"
```

### Recherche dans les logs

```bash
# Rechercher toutes les erreurs d'un utilisateur spécifique
grep "userId.*abc123" backend/logs/error-*.log

# Rechercher les paiements échoués
grep "Paiement échoué" backend/logs/application-*.log

# Compter les erreurs 401 (non autorisé)
grep "status.*401" backend/logs/application-*.log | wc -l
```

### Alertes recommandées

Configurez des alertes pour :

- Taux d'erreurs > 5% sur 5 minutes
- Échecs d'authentification répétés (même IP)
- Erreurs de connexion à la base de données
- Paiements échoués > 10% sur 1 heure

---

## Dépannage

### Les logs ne s'écrivent pas

1. Vérifier les permissions du dossier `backend/logs/`
2. Vérifier que winston est installé : `npm list winston`
3. Vérifier la variable `LOG_LEVEL` dans `.env`

### Trop de logs

1. Augmenter `LOG_LEVEL` à `info` ou `warn` en production
2. Réduire le temps de rétention des logs
3. Vérifier qu'il n'y a pas de boucles de logs

### Logs frontend non visibles

1. Ouvrir la console du navigateur (F12)
2. Vérifier que le mode n'est pas en production
3. Vérifier localStorage : `localStorage.getItem('app_logs')`

---

## Conformité et sécurité

### RGPD

- Les logs contiennent des données utilisateur (email, ID)
- Respecter les délais de rétention (14-30 jours)
- Permettre la suppression sur demande
- Ne jamais logger de données sensibles

### Sécurité

- Les fichiers de logs ne sont PAS versionnés (`.gitignore`)
- Accès restreint aux fichiers de logs en production
- Rotation automatique pour éviter les fichiers trop volumineux
- Logs structurés en JSON pour faciliter l'analyse

---

## Support

Pour toute question sur le système de logging, consulter :

- Code backend : `/backend/src/config/logger.js`
- Code frontend : `/frontend/src/utils/logger.js`
- Cette documentation : `/LOGGING.md`
