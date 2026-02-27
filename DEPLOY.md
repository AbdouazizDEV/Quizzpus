# Guide de déploiement - Quizz+

## Déploiement Frontend sur Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Aller sur [vercel.com](https://vercel.com)** et se connecter avec ton compte GitHub

2. **Cliquer sur "New Project"**

3. **Importer le repository** `AbdouazizDEV/Quizzpus`

4. **Configuration du projet** :
   - **Framework Preset** : Create React App
   - **Root Directory** : `frontend`
   - **Build Command** : `yarn build` (ou `npm run build`)
   - **Output Directory** : `build`
   - **Install Command** : `yarn install` (ou `npm install`)

5. **Variables d'environnement** :
   - Cliquer sur "Environment Variables"
   - Ajouter :
     - **Name** : `REACT_APP_BACKEND_URL`
     - **Value** : URL de ton backend (ex: `https://quizzplus-backend.onrender.com`)
     - Cocher : Production, Preview, Development

6. **Déployer** : Cliquer sur "Deploy"

### Méthode 2 : Via Vercel CLI

```bash
cd frontend

# Se connecter à Vercel
vercel login

# Créer un nouveau projet (répondre aux questions)
vercel

# Déployer en production
vercel --prod
```

### Important : Configuration Backend URL

⚠️ **Le backend doit être accessible publiquement** pour que le frontend fonctionne.

Options pour le backend :
- **Render.com** (gratuit) : Déploie ton backend FastAPI
- **Railway.app** (gratuit avec crédits) : Alternative simple
- **Fly.io** : Bon pour les apps Python
- **Heroku** : Payant mais fiable

Une fois le backend déployé, mets son URL dans la variable `REACT_APP_BACKEND_URL` sur Vercel.

## Déploiement Backend sur Render

### Méthode 1 : Via le Dashboard Render (Recommandé)

1. **Créer un compte sur [render.com](https://render.com)** et connecter ton compte GitHub

2. **Nouveau Web Service** :
   - Cliquer sur "New +" → "Web Service"
   - Connecter le repository `AbdouazizDEV/Quizzpus`
   - **Configuration** :
     - **Name** : `quizzplus-backend`
     - **Root Directory** : `backend`
     - **Environment** : `Python 3`
     - **Build Command** : `pip install -r requirements-prod.txt`
     - **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`
     - **Plan** : Free (ou Starter si tu veux éviter le spin-down)

3. **Variables d'environnement** (dans "Environment" section) :
   - `MONGO_URL` : URL de MongoDB Atlas (ex: `mongodb+srv://user:password@cluster.mongodb.net/`)
   - `DB_NAME` : `quizzplus`
   - `CORS_ORIGINS` : `https://frontend-rho-henna.vercel.app,https://frontend-gfn1pzz0b-abdou-aziz-diops-projects.vercel.app,http://localhost:3000`
   - `PYTHON_VERSION` : `3.11` (optionnel, mais recommandé)

4. **Déployer** : Cliquer sur "Create Web Service"

5. **Attendre le déploiement** : Render va construire et déployer ton backend (5-10 minutes)

6. **Récupérer l'URL** : Une fois déployé, tu auras une URL comme `https://quizzplus-backend.onrender.com`

### Méthode 2 : Via render.yaml (Automatique)

Si tu as déjà poussé `render.yaml` dans le repo :
1. Aller sur Render Dashboard
2. Cliquer sur "New +" → "Blueprint"
3. Connecter le repo
4. Render détectera automatiquement `render.yaml` et créera le service

### Configuration MongoDB Atlas (si tu n'as pas encore de MongoDB)

1. **Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Créer un cluster gratuit** (M0)
3. **Créer un utilisateur** (Database Access)
4. **Whitelist l'IP** : Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
5. **Récupérer la connection string** : Clusters → Connect → "Connect your application"
6. **Copier l'URL** : `mongodb+srv://username:password@cluster.mongodb.net/`
7. **Ajouter le nom de la DB** : `mongodb+srv://username:password@cluster.mongodb.net/quizzplus`

### Mettre à jour Vercel avec l'URL du Backend

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Sélectionner ton projet** `frontend`
3. **Settings** → **Environment Variables**
4. **Modifier `REACT_APP_BACKEND_URL`** :
   - Value : `https://quizzplus-backend.onrender.com` (remplacer par ton URL Render)
5. **Redéployer** : Deployments → Dernier déploiement → "..." → "Redeploy"

## Structure des URLs

- **Frontend** : `https://quizzpus.vercel.app`
- **Backend** : `https://quizzplus-backend.onrender.com` (exemple)
- **API** : `https://quizzplus-backend.onrender.com/api`

## Vérification

Après déploiement, tester :
- ✅ Frontend accessible sur Vercel
- ✅ Backend répond sur `/api/themes` (sans auth)
- ✅ Frontend peut appeler le backend (vérifier Network dans DevTools)
