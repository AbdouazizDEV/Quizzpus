# 🔧 Guide de dépannage

## Erreur "EMFILE: too many open files"

### Symptôme
```
Error: EMFILE: too many open files, watch '/path/to/frontend/public'
```

### Cause
Le système d'exploitation limite le nombre de fichiers ouverts simultanément. Le watcher de fichiers de React essaie de surveiller trop de fichiers.

### Solutions

#### Solution 1 : Utiliser le polling (Recommandé)
Le script `start.sh` configure automatiquement le polling. Sinon, lance manuellement :

```bash
cd frontend
CHOKIDAR_USEPOLLING=true yarn start
```

#### Solution 2 : Augmenter la limite de fichiers ouverts

**Pour la session actuelle :**
```bash
ulimit -n 65536
```

**Pour rendre permanent :**
Ajoute cette ligne à `~/.bashrc` :
```bash
ulimit -n 65536
```

Puis recharge la configuration :
```bash
source ~/.bashrc
```

#### Solution 3 : Utiliser le script de démarrage
Le script `start.sh` configure automatiquement tout :
```bash
./start.sh
```

### Configuration du watcher

Le fichier `frontend/craco.config.js` est configuré pour :
- Ignorer `node_modules`, `.git`, `build`, `dist`, `coverage`, `public`
- Utiliser le polling au lieu du watcher natif
- Attendre 300ms après les changements avant de reconstruire

## Autres problèmes courants

### MongoDB ne démarre pas
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Pour démarrer au boot
```

### Port déjà utilisé
```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Dépendances manquantes
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
yarn install
```
