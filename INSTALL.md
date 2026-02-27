# Guide d'installation - Quizz+

## Prérequis

1. **Python 3.12+** (déjà installé ✓)
2. **Node.js 22+** (déjà installé ✓)
3. **MongoDB** (à installer)
4. **pip** (à installer)

## Installation des dépendances système

### 1. Installer pip et MongoDB

```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv mongodb
```

### 2. Démarrer MongoDB

```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

Vérifier que MongoDB fonctionne :
```bash
mongosh --eval "db.version()"
```

## Installation du Backend

```bash
cd backend

# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Le fichier .env est déjà créé avec :
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=quizzplus
# CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Installation du Frontend

Les dépendances sont déjà installées ✓

Le fichier `.env` est déjà créé avec :
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Initialisation de la base de données

```bash
cd backend
source venv/bin/activate
python seed_data.py
```

## Lancement de l'application

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
yarn start
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000
- Documentation API : http://localhost:8000/docs

## Dépannage

### Si MongoDB n'est pas accessible
```bash
# Vérifier le statut
sudo systemctl status mongodb

# Redémarrer
sudo systemctl restart mongodb
```

### Si les ports sont occupés
- Backend : Modifier le port dans la commande uvicorn
- Frontend : Le port sera demandé automatiquement si 3000 est occupé
