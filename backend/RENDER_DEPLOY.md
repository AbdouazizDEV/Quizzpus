# Guide de déploiement Backend sur Render

## ✅ Fichiers créés pour le déploiement

- `requirements-prod.txt` : Dépendances minimales (sans les packages Google AI/OpenAI non utilisés)
- `render.yaml` : Configuration automatique pour Render

## 🚀 Étapes de déploiement

### 1. Préparer MongoDB Atlas (si pas déjà fait)

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un cluster M0 (gratuit)
4. **Database Access** → Créer un utilisateur :
   - Username : `quizzplus`
   - Password : Générer un mot de passe fort RuHIdyuQ5nzQiy55
   - Database User Privileges : `Read and write to any database`
5. **Network Access** → Add IP Address → `0.0.0.0/0` (Allow from anywhere)
6. **Clusters** → Connect → "Connect your application"
7. Copier la connection string : `mongodb+srv://username:password@cluster.mongodb.net/`
8. Ajouter le nom de la DB : `mongodb+srv://username:password@cluster.mongodb.net/quizzplus`

### 2. Déployer sur Render

#### Option A : Via le Dashboard (Recommandé)

1. Aller sur [render.com](https://render.com) et se connecter avec GitHub
2. Cliquer sur **"New +"** → **"Web Service"**
3. Connecter le repository `AbdouazizDEV/Quizzpus`
4. **Configuration** :
   ```
   Name: quizzplus-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements-prod.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   Plan: Free (ou Starter pour éviter le spin-down)
   ```
5. **Variables d'environnement** :
   ```
   MONGO_URL=mongodb+srv://quizzplus:RuHIdyuQ5nzQiy55@cluster0.wc4axiq.mongodb.net/quizzplus
   DB_NAME=quizzplus
   CORS_ORIGINS=https://frontend-rho-henna.vercel.app,https://frontend-gfn1pzz0b-abdou-aziz-diops-projects.vercel.app,http://localhost:3000
   PYTHON_VERSION=3.11.0
   ```
6. Cliquer sur **"Create Web Service"**
7. Attendre 5-10 minutes pour le build et déploiement
8. Récupérer l'URL : `https://quizzplus-backend.onrender.com`

#### Option B : Via render.yaml (Automatique)

1. Aller sur Render Dashboard
2. Cliquer sur **"New +"** → **"Blueprint"**
3. Connecter le repo `AbdouazizDEV/Quizzpus`
4. Render détectera automatiquement `render.yaml`
5. Configurer les variables d'environnement (surtout `MONGO_URL`)
6. Déployer

### 3. Tester le backend

Une fois déployé, tester :
- `https://ton-backend.onrender.com/api/themes` (doit retourner la liste des thèmes)
- `https://ton-backend.onrender.com/docs` (documentation Swagger)

### 4. Mettre à jour Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner le projet `frontend`
3. **Settings** → **Environment Variables**
4. Modifier `REACT_APP_BACKEND_URL` :
   - Value : `https://ton-backend.onrender.com`
5. **Redéployer** : Deployments → Dernier déploiement → "..." → "Redeploy"

### 5. Seeder la base de données (optionnel)

Si tu veux peupler la base avec des données de test :

1. Sur ton machine locale :
   ```bash
   cd backend
   source venv/bin/activate
   python seed_data.py
   ```

2. Ou créer un script Render qui se lance au démarrage (non recommandé pour la prod)

## ⚠️ Notes importantes

### Plan Free de Render
- **Spin-down** : Le service se met en veille après 15 min d'inactivité
- **Premier démarrage** : Peut prendre 30-60 secondes après le spin-down
- **Solution** : Upgrade vers Starter ($7/mois) pour éviter le spin-down

### Variables d'environnement critiques
- `MONGO_URL` : Doit être correcte avec le nom de la DB
- `CORS_ORIGINS` : Doit inclure toutes les URLs du frontend (Vercel + localhost pour dev)

### Logs
- Sur Render Dashboard → Logs : Tu peux voir les logs en temps réel
- En cas d'erreur, vérifier les logs pour diagnostiquer

## 🔧 Dépannage

### Erreur : "Cannot install package X"
- Vérifier que `requirements-prod.txt` utilise des versions compatibles
- Si besoin, mettre à jour les versions dans `requirements-prod.txt`

### Erreur : "Connection refused" ou timeout
- Vérifier que MongoDB Atlas autorise les connexions depuis n'importe quelle IP (0.0.0.0/0)
- Vérifier que `MONGO_URL` est correcte

### Erreur : "CORS policy"
- Vérifier que `CORS_ORIGINS` contient l'URL exacte du frontend Vercel
- Ajouter `http://localhost:3000` pour le développement local

### Le backend ne démarre pas
- Vérifier les logs sur Render Dashboard
- Vérifier que `server:app` est correct (le fichier `server.py` doit être dans `backend/`)
- Vérifier que le port est `$PORT` (variable d'environnement Render)
