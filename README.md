## Quizz+ — Plateforme de quizz gamifiée

Quizz+ est une application web **FastAPI + React** qui propose des quizz ludiques (culture générale, Afrique, sport, etc.) avec gamification avancée : points, niveaux, badges, classement, fun facts, et fonctionnalités Premium/Communauté.

Ce dépôt contient :
- **backend/** : API FastAPI + MongoDB
- **frontend/** : SPA React (Create React App + Tailwind + shadcn/radix)

---

## 1. Architecture rapide

- **Backend**
  - Framework : `FastAPI`
  - Base : `MongoDB` via `motor`
  - Auth : sessions stockées en base (`user_sessions`) et cookie httpOnly `session_token`
  - Collections principales : `users`, `quiz_themes`, `quiz_questions`, `fun_facts`, `user_quiz_results`, `badges`, `user_badges`, `notifications`, `feedbacks`, `premium_waitlist`, `partner_requests`, `enterprise_leads`, `ambassadors`

- **Frontend**
  - Framework : `React 19` + `react-router-dom`
  - UI : Tailwind CSS, Radix UI, shadcn-like composants (`src/components/ui`)
  - State auth : `AuthContext` (`src/contexts/AuthContext.js`)
  - Pages clés :
    - Onboarding : `Onboarding`, `WelcomeOnboarding`
    - Jeu : `QuizSelection`, `QuizGame`, `QuizResults`
    - Gamification : `Dashboard`, `Leaderboard`, `Profile`, `Badges`
    - Communauté & Premium : `Community`, `Premium`

---

## 2. Pré-requis

Sur ta machine de dev :

- **Python** ≥ 3.12  
- **Node.js** ≥ 18 (22 déjà utilisé dans ce projet)  
- **Yarn** (recommandé, déjà configuré dans `package.json`)  
- **MongoDB 7.x** (service `mongod` lancé)

---

## 3. Configuration de l’environnement

### 3.1 Backend (`backend/.env`)

Un fichier `.env` est déjà prévu, mais à vérifier/adapter :

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=quizzplus
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3.2 Frontend (`frontend/.env`)

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 4. Installation & lancement en local

### 4.1 Backend (FastAPI)

```bash
cd backend

# Créer et activer le venv
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Initialiser la base MongoDB (thèmes, questions, badges, demo users, fun facts)
python seed_data.py

# Lancer l’API
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

API docs : `http://localhost:8000/docs`

### 4.2 Frontend (React)

```bash
cd frontend

# Installer les dépendances (une seule fois)
yarn install

# Lancer le front
yarn start
```

Application : `http://localhost:3000`

---

## 5. Fonctionnalités principales

- **Auth & Profil**
  - Inscription / connexion email + mot de passe
  - Onboarding pays + thèmes préférés (`WelcomeOnboarding`)
  - Mise à jour du profil via `/api/user/profile`

- **Quizz**
  - Liste de thèmes (`/api/themes`)
  - Génération de quizz par thème (`/api/themes/{theme_id}/quiz`) avec 10 questions aléatoires
  - Envoi des réponses (`/api/quiz/submit`) → score, points, perfect score, niveau
  - Timer par question avec composant `CountdownTimer`

- **Gamification**
  - Points, niveaux calculés côté backend (`calculate_level`)
  - Badges (`/api/user/badges`) et historique (`/api/user/history`)
  - Classements global & par pays (`/api/leaderboard/global`, `/api/leaderboard/country/{country}`)
  - Fun facts quotidiens (`/api/fun-facts/daily`)

- **Feedback**
  - Modal de feedback après 3 parties (`FeedbackModal`, `useFeedbackTrigger`)
  - Endpoint : `POST /api/feedback`
  - Stockage en base collection `feedbacks` + bonus de points

- **Communauté**
  - Page `Community` : liens WhatsApp, Discord, entretiens 1-to-1, Ambassadeurs campus
  - Endpoint ambassadeurs : `POST /api/ambassadors/apply`

- **Premium**
  - Page `Premium` avec présentation des plans (mensuel / annuel) + comparatif
  - Waitlist Premium : `POST /api/premium/waitlist`
  - Partenariats : `POST /api/partners/request`
  - Leads entreprises : `POST /api/enterprise/lead`

---

## 6. Déploiement dans un nouveau dépôt Git

Tu as indiqué vouloir pousser le projet vers :

```bash
git remote add origin git@github.com:AbdouazizDEV/Quizzpus.git
git branch -M main
git push -u origin main
```

Recommandations :
- Ajouter un `.gitignore` si nécessaire (Python, Node, venv, `node_modules`, etc.).
- Ne **jamais** committer les fichiers `.env` contenant des secrets en prod (OK pour dev local).
- Configurer les variables d’environnement (MONGO_URL, DB_NAME, REACT_APP_BACKEND_URL) sur l’infra de déploiement (Railway, Render, Docker, etc.).

---

## 7. Pistes d’amélioration

- Ajout de tests automatiques (Pytest pour le backend, React Testing Library pour le front).
- Mise en place d’un Dockerfile (backend + frontend) pour faciliter le déploiement.
- Gestion avancée des erreurs et traçage (Sentry, logs structurés).

Si tu veux, on peut ensuite ajouter une section **“Conventions de code & branches Git”** spécifique à ton workflow (feature branches, naming, etc.).
# Quizzpus
