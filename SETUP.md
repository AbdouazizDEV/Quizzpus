# Configuration rapide - Quizz+

## ✅ Déjà fait

- ✅ Fichiers `.env` créés (backend et frontend)
- ✅ Dépendances frontend installées avec yarn

## 📋 À faire manuellement

### 1. Installer les dépendances système (nécessite sudo)

```bash
# Installer pip et venv (si pas déjà fait)
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv

# Installer MongoDB (ajouter le dépôt officiel)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
```

### 2. Démarrer MongoDB

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Note:** Le service s'appelle `mongod` (pas `mongodb`)

### 3. Installer les dépendances Python du backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Initialiser la base de données

```bash
cd backend
source venv/bin/activate
python seed_data.py
```

### 5. Démarrer l'application

**Option A : Utiliser le script automatique**
```bash
./start.sh
```

**Option B : Démarrer manuellement**

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
yarn start
```

## 🌐 Accès

- Frontend : http://localhost:3000
- Backend API : http://localhost:8000
- Documentation API : http://localhost:8000/docs

## 🔧 Dépannage

### MongoDB ne démarre pas
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

**Note:** Le service s'appelle `mongod` (pas `mongodb`)

### Port déjà utilisé
- Backend : Modifier le port dans uvicorn
- Frontend : Yarn demandera automatiquement un autre port

### Erreur de connexion MongoDB
Vérifiez que MongoDB est bien démarré :
```bash
mongosh --eval "db.version()"
```
