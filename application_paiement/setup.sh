#!/bin/bash

# Script de Configuration Automatique
# Application d'Agrégation de Paiement

set -e

echo "=========================================="
echo "Configuration de l'Application de Paiement"
echo "=========================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

# Vérifier Node.js
info "Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success "Node.js $NODE_VERSION installé"
else
    error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier npm
info "Vérification de npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    success "npm $NPM_VERSION installé"
else
    error "npm n'est pas installé"
    exit 1
fi

# Vérifier MongoDB
info "Vérification de MongoDB..."
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n1)
    success "MongoDB installé: $MONGO_VERSION"
    MONGO_INSTALLED=true
elif pgrep -x "mongod" > /dev/null; then
    success "MongoDB est en cours d'exécution"
    MONGO_INSTALLED=true
else
    warn "MongoDB n'est pas installé ou n'est pas dans le PATH"
    warn "Options:"
    warn "  1. Installer MongoDB localement (voir SETUP_GUIDE.md)"
    warn "  2. Utiliser MongoDB Atlas (cloud gratuit)"
    warn "  3. Utiliser Docker: docker run -d -p 27017:27017 --name mongodb mongo:6.0"
    MONGO_INSTALLED=false
fi

echo ""
echo "=========================================="
echo "Installation des Dépendances"
echo "=========================================="
echo ""

# Installation Backend
info "Installation des dépendances backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    success "Dépendances backend installées"
else
    success "Dépendances backend déjà installées"
fi

# Configuration Backend .env
if [ ! -f ".env" ]; then
    info "Création du fichier .env backend..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        success "Fichier .env backend créé à partir de .env.example"
        warn "N'oubliez pas de modifier .env avec vos propres valeurs"
    else
        error "Fichier .env.example introuvable"
    fi
else
    success "Fichier .env backend existe déjà"
fi

cd ..

# Installation Frontend
info "Installation des dépendances frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    success "Dépendances frontend installées"
else
    success "Dépendances frontend déjà installées"
fi

# Configuration Frontend .env
if [ ! -f ".env" ]; then
    info "Création du fichier .env frontend..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        success "Fichier .env frontend créé"
    else
        error "Fichier .env.example introuvable"
    fi
else
    success "Fichier .env frontend existe déjà"
fi

cd ..

echo ""
echo "=========================================="
echo "Résumé de l'Installation"
echo "=========================================="
echo ""

success "✓ Node.js installé"
success "✓ npm installé"
success "✓ Dépendances backend installées"
success "✓ Dépendances frontend installées"
success "✓ Fichiers .env configurés"

if [ "$MONGO_INSTALLED" = true ]; then
    success "✓ MongoDB installé"
else
    warn "⚠ MongoDB non détecté"
fi

echo ""
echo "=========================================="
echo "Prochaines Étapes"
echo "=========================================="
echo ""

if [ "$MONGO_INSTALLED" = false ]; then
    warn "1. Installer et démarrer MongoDB (voir SETUP_GUIDE.md)"
    warn "   OU utiliser MongoDB Atlas (cloud)"
    warn "   OU utiliser Docker: docker run -d -p 27017:27017 mongo:6.0"
    echo ""
fi

info "Initialiser la base de données avec des données de test:"
echo "   cd backend && npm run seed"
echo ""

info "Démarrer le backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""

info "Démarrer le frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""

info "Accéder à l'application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo ""

info "Comptes de test (après seed):"
echo "   Admin: admin@payment.com / Admin123!"
echo "   Merchant: merchant1@test.com / Merchant123!"
echo ""

success "Configuration terminée! ✓"
echo ""
echo "Pour plus d'informations, consultez:"
echo "  - README.md"
echo "  - SETUP_GUIDE.md"
echo "  - QUICKSTART.md"
echo ""
