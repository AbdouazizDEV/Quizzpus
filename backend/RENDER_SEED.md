# 🌱 Guide pour lancer les seeders sur Render

## Problème
En production, la base de données MongoDB est vide, ce qui cause :
- `/api/themes` retourne `[]`
- Les endpoints protégés retournent 401 si aucun utilisateur n'existe

## Solution 1 : Seeding automatique au démarrage (Recommandé)

Le serveur vérifie automatiquement au démarrage si des thèmes existent. Si la base est vide, il lance les seeders automatiquement.

**Aucune action requise** - cela se fait automatiquement lors du redéploiement.

## Solution 2 : Lancer les seeders manuellement via Render Shell

Si tu veux lancer les seeders manuellement :

1. **Accéder au Shell Render** :
   - Va sur https://dashboard.render.com
   - Sélectionne ton service `quizzplus-backend`
   - Clique sur "Shell" dans le menu de gauche

2. **Lancer le script de seeding** :
```bash
cd backend
python seed_data.py
```

3. **Vérifier que ça a fonctionné** :
```bash
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; client = AsyncIOMotorClient(os.environ['MONGO_URL']); db = client[os.environ['DB_NAME']]; import asyncio; print(f'Thèmes: {asyncio.run(db.quiz_themes.count_documents({}))}')"
```

## Solution 3 : Via un service "one-off" Render

1. Dans le dashboard Render, crée un nouveau service de type **"Shell Script"**
2. Configure :
   - **Name**: `seed-database`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python seed_data.py`
   - **Environment Variables**: Copie celles du service web (MONGO_URL, DB_NAME)

3. Lance le service une fois, puis supprime-le

## Vérification

Après le seeding, tu devrais avoir :
- ✅ 8 thèmes dans `quiz_themes`
- ✅ 80 questions dans `quiz_questions`
- ✅ 15 fun facts dans `fun_facts`
- ✅ 8 badges dans `badges`
- ✅ 20 utilisateurs demo dans `users`

## Test

Teste l'endpoint :
```bash
curl https://quizzplus-backend.onrender.com/api/themes
```

Tu devrais voir un tableau avec 8 thèmes au lieu de `[]`.
