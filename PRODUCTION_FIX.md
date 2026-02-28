# 🔧 Corrections pour la Production

## Problèmes identifiés

1. **401 Unauthorized** sur les endpoints protégés (`/api/quiz/daily`, `/api/user/profile`)
2. **Thèmes vides** : `/api/themes` retourne `[]`
3. **Cookies non envoyés** en cross-origin (Vercel → Render)

## Solutions implémentées

### 1. ✅ Seeding automatique au démarrage

Le backend vérifie maintenant automatiquement au démarrage si la base contient des thèmes. Si elle est vide, il lance les seeders automatiquement.

**Fichier modifié** : `backend/server.py`
- Ajout d'un événement `@app.on_event("startup")` qui :
  - Vérifie le nombre de thèmes dans la base
  - Lance les seeders si nécessaire (thèmes, questions, fun facts, badges, utilisateurs demo)
  - Log les résultats

**Résultat** : Plus besoin de lancer les seeders manuellement après chaque déploiement.

### 2. ✅ Cookies cross-origin (SameSite="none")

Les cookies de session ne fonctionnaient pas en production car `SameSite="lax"` bloque les cookies cross-origin.

**Fichier modifié** : `backend/server.py` - fonction `set_session_cookie()`
- **Production (HTTPS)** : `SameSite="none"` + `secure=True` (requis pour cross-origin)
- **Local (HTTP)** : `SameSite="lax"` + `secure=False` (pour développement)

**Fichier modifié** : `backend/render.yaml`
- Ajout de la variable `RENDER=true` pour détecter l'environnement de production

**Résultat** : Les cookies sont maintenant correctement envoyés depuis Vercel vers Render.

### 3. ✅ Documentation

**Nouveaux fichiers** :
- `backend/RENDER_SEED.md` : Guide pour lancer les seeders manuellement si nécessaire
- `backend/start_with_seed.py` : Script alternatif pour seeding (non utilisé actuellement)

## Vérification après déploiement

### 1. Vérifier les seeders

Attendre 2-3 minutes après le déploiement, puis tester :

```bash
curl https://quizzplus-backend.onrender.com/api/themes
```

**Attendu** : Un tableau avec 8 thèmes au lieu de `[]`

### 2. Vérifier l'authentification

1. Ouvrir https://quizzpus.vercel.app
2. Ouvrir la console du navigateur (F12)
3. S'inscrire ou se connecter
4. Vérifier dans l'onglet **Network** :
   - Les requêtes vers `/api/quiz/daily` et `/api/user/profile` doivent retourner **200 OK** (pas 401)
   - Les cookies `session_token` doivent être présents dans les requêtes

### 3. Vérifier les logs Render

Dans le dashboard Render, vérifier les logs au démarrage :

```
✅ Base de données déjà initialisée (8 thèmes trouvés)
```

ou

```
🌱 Aucun thème trouvé. Lancement des seeders...
✅ Seeders terminés avec succès!
```

## Si les problèmes persistent

### Problème : Toujours 401 Unauthorized

1. **Vérifier les cookies dans le navigateur** :
   - Ouvrir DevTools → Application → Cookies
   - Vérifier que `session_token` existe pour `quizzplus-backend.onrender.com`
   - Vérifier que `SameSite=None` et `Secure` sont cochés

2. **Vérifier CORS** :
   - Dans les logs Render, chercher : `CORS origins configured`
   - Vérifier que `allow_credentials: True`

3. **Vérifier la session en base** :
   - Se connecter via Render Shell
   - Vérifier la collection `user_sessions` :
   ```python
   from motor.motor_asyncio import AsyncIOMotorClient
   import os
   client = AsyncIOMotorClient(os.environ['MONGO_URL'])
   db = client[os.environ['DB_NAME']]
   import asyncio
   sessions = asyncio.run(db.user_sessions.find().to_list(length=10))
   print(sessions)
   ```

### Problème : Toujours `[]` pour `/api/themes`

1. **Lancer les seeders manuellement** :
   - Voir `backend/RENDER_SEED.md` pour les instructions

2. **Vérifier les logs au démarrage** :
   - Si une erreur apparaît lors du seeding, elle sera dans les logs Render

## Variables d'environnement requises sur Render

Assure-toi que ces variables sont configurées dans le dashboard Render :

- ✅ `MONGO_URL` : URL de connexion MongoDB Atlas
- ✅ `DB_NAME` : `quizzplus`
- ✅ `CORS_ORIGINS` : Liste des URLs frontend séparées par des virgules
- ✅ `RENDER` : `true` (ajouté automatiquement via `render.yaml`)
- ✅ `PYTHON_VERSION` : `3.11.0`

## Test local

Pour tester les changements en local :

1. **Tester les cookies** :
   - Le backend local utilise `SameSite="lax"` (normal pour same-origin)
   - Les cookies fonctionnent car frontend et backend sont sur le même domaine (`localhost`)

2. **Tester le seeding** :
   - Supprimer tous les thèmes de la base locale
   - Redémarrer le backend
   - Vérifier que les seeders se lancent automatiquement

## Notes importantes

- ⚠️ **SameSite="none"** nécessite **secure=True** (HTTPS uniquement)
- ⚠️ Les cookies avec `SameSite="none"` peuvent être bloqués par certains navigateurs si les conditions ne sont pas remplies
- ⚠️ Le seeding automatique ne se lance qu'au démarrage du serveur, pas à chaque requête
