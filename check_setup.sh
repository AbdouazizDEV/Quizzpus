#!/bin/bash

# Script de vérification de l'installation

echo "🔍 Vérification de l'installation Quizz+..."
echo ""

# Vérifier MongoDB
echo "📦 MongoDB:"
if systemctl is-active --quiet mongod; then
    echo "   ✅ MongoDB est démarré"
    mongosh --version 2>/dev/null || echo "   ⚠️  mongosh non trouvé (normal si pas dans PATH)"
else
    echo "   ❌ MongoDB n'est pas démarré"
    echo "      Démarrez avec: sudo systemctl start mongod"
fi

echo ""

# Vérifier Python
echo "🐍 Python:"
if command -v python3 &> /dev/null; then
    echo "   ✅ Python $(python3 --version | cut -d' ' -f2) installé"
else
    echo "   ❌ Python3 non trouvé"
fi

if command -v pip3 &> /dev/null; then
    echo "   ✅ pip3 installé"
else
    echo "   ❌ pip3 non trouvé - Installez avec: sudo apt-get install python3-pip"
fi

if dpkg -l | grep -q python3-venv; then
    echo "   ✅ python3-venv installé"
else
    echo "   ❌ python3-venv non installé - Installez avec: sudo apt-get install python3-venv"
fi

echo ""

# Vérifier l'environnement virtuel backend
echo "📦 Backend:"
if [ -d "backend/venv" ]; then
    echo "   ✅ Environnement virtuel créé"
    if [ -f "backend/venv/bin/activate" ]; then
        source backend/venv/bin/activate
        if command -v pip &> /dev/null; then
            echo "   ✅ pip disponible dans venv"
            # Vérifier quelques packages clés
            if python -c "import fastapi" 2>/dev/null; then
                echo "   ✅ FastAPI installé"
            else
                echo "   ⚠️  FastAPI non installé - Exécutez: pip install -r requirements.txt"
            fi
            if python -c "import motor" 2>/dev/null; then
                echo "   ✅ Motor (MongoDB) installé"
            else
                echo "   ⚠️  Motor non installé - Exécutez: pip install -r requirements.txt"
            fi
        fi
        deactivate
    fi
else
    echo "   ❌ Environnement virtuel non créé"
    echo "      Créez avec: cd backend && python3 -m venv venv"
fi

echo ""

# Vérifier les fichiers de configuration
echo "⚙️  Configuration:"
if [ -f "backend/.env" ]; then
    echo "   ✅ backend/.env existe"
else
    echo "   ❌ backend/.env manquant"
fi

if [ -f "frontend/.env" ]; then
    echo "   ✅ frontend/.env existe"
else
    echo "   ❌ frontend/.env manquant"
fi

echo ""

# Vérifier Node.js
echo "📦 Frontend:"
if command -v node &> /dev/null; then
    echo "   ✅ Node.js $(node --version) installé"
else
    echo "   ❌ Node.js non trouvé"
fi

if command -v yarn &> /dev/null; then
    echo "   ✅ Yarn installé"
else
    echo "   ❌ Yarn non trouvé"
fi

if [ -d "frontend/node_modules" ]; then
    echo "   ✅ node_modules existe (dépendances installées)"
else
    echo "   ⚠️  node_modules manquant - Exécutez: cd frontend && yarn install"
fi

echo ""
echo "✅ Vérification terminée !"
