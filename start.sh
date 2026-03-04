#!/bin/bash

# Script de démarrage pour Quizz+

echo "🚀 Démarrage de Quizz+..."

# Vérifier si MongoDB est en cours d'exécution
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB n'est pas en cours d'exécution"
    echo "   Démarrez MongoDB avec: sudo systemctl start mongod"
    exit 1
fi

# Backend
echo "📦 Démarrage du backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "   Création de l'environnement virtuel..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f "venv/.installed" ]; then
    echo "   Installation des dépendances Python..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Vérifier si la base de données est initialisée
if ! python -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; from dotenv import load_dotenv; from pathlib import Path; load_dotenv(Path(__file__).parent / '.env'); client = AsyncIOMotorClient(os.environ['MONGO_URL']); db = client[os.environ['DB_NAME']]; themes = db.quiz_themes.count_documents({}); exit(0 if themes > 0 else 1)" 2>/dev/null; then
    echo "   Initialisation de la base de données..."
    python seed_data.py
fi

echo "   Démarrage du serveur FastAPI sur http://localhost:8000"
uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Frontend
echo "🎨 Démarrage du frontend..."
cd frontend

# Augmenter la limite de fichiers ouverts pour éviter EMFILE
ulimit -n 65536 2>/dev/null || true

echo "   Démarrage du serveur React sur http://localhost:3000"
# Utiliser polling pour éviter les erreurs EMFILE
CHOKIDAR_USEPOLLING=true yarn start &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ Application démarrée !"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre les signaux d'arrêt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
