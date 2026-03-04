# 🚀 Améliorations du Backend - Système de Quiz

## Résumé des améliorations

### ✅ 1. Génération de quiz selon les thèmes favoris
- **Endpoint** : `POST /api/quiz/start`
- **Fonctionnalité** : Génère un quiz de 10 questions aléatoires basé sur le thème choisi
- **Amélioration** : Prêt pour intégrer la priorisation selon les thèmes favoris de l'utilisateur

### ✅ 2. Timer de 10 secondes par question
- **Endpoint** : `POST /api/quiz/validate-answer`
- **Fonctionnalité** :
  - Validation automatique si le temps dépasse 10 secondes
  - La réponse est marquée comme incorrecte si le temps est dépassé
  - Le joueur perd automatiquement la question

### ✅ 3. Validation immédiate des réponses
- **Endpoint** : `POST /api/quiz/validate-answer`
- **Fonctionnalité** :
  - Valide chaque réponse individuellement
  - Retourne immédiatement :
    - Si la réponse est correcte ou non
    - Le nombre de points gagnés pour cette question
    - L'explication de la réponse
    - La réponse correcte
  - Permet de passer à la question suivante automatiquement

### ✅ 4. Types de questions variés
- **Types supportés** :
  - `mcq` : Questions à choix multiples (exact match)
  - `true_false` : Vrai/Faux (exact match)
  - `text` : Réponse texte libre (comparaison insensible à la casse)
- **Extensible** : Facile d'ajouter d'autres types (numérique, ordre, etc.)

### ✅ 5. Système de scoring amélioré
- **Points de base** :
  - 1 point par bonne réponse
  - Multiplicateur selon la difficulté :
    - Facile (1) : 1x
    - Moyen (2) : 1.5x
    - Difficile (3) : 2x
- **Bonus temps** :
  - +0.5 points si réponse en moins de 5 secondes
- **Bonus fin de quiz** :
  - +10 points pour un score parfait
  - +5 points si le quiz est complété en moins de 60 secondes

### ✅ 6. Gestion de session de quiz
- **Nouvelle collection** : `quiz_sessions`
- **Stocke** :
  - Les questions avec les bonnes réponses (pour validation)
  - Les réponses de l'utilisateur
  - Le score et les points en temps réel
  - L'état de progression (question actuelle)
- **Avantages** :
  - Permet de reprendre un quiz interrompu
  - Traçabilité complète des réponses
  - Validation côté serveur sécurisée

## Nouveaux endpoints

### `POST /api/quiz/start`
Démarre une nouvelle session de quiz.

**Request Body** :
```json
{
  "theme_id": "theme_culture_generale"
}
```

**Response** :
```json
{
  "session_id": "quiz_abc123...",
  "questions": [
    {
      "question_id": "q1",
      "question_text": "Quelle est la capitale...",
      "question_type": "mcq",
      "options": ["Option1", "Option2", ...],
      "difficulty": 2
    }
  ],
  "total_questions": 10,
  "time_per_question": 10
}
```

### `POST /api/quiz/validate-answer`
Valide une réponse individuelle.

**Request Body** :
```json
{
  "session_id": "quiz_abc123...",
  "question_id": "q1",
  "answer": "Canberra",
  "time_taken": 7
}
```

**Response** :
```json
{
  "is_correct": true,
  "points_earned": 2,
  "current_score": 1,
  "total_points": 2,
  "question_number": 1,
  "total_questions": 10,
  "is_complete": false,
  "explanation": "Canberra est la capitale...",
  "correct_answer": "Canberra"
}
```

### `POST /api/quiz/finish`
Termine le quiz et calcule le score final.

**Request Body** :
```json
{
  "session_id": "quiz_abc123..."
}
```

**Response** :
```json
{
  "score": 8,
  "total_questions": 10,
  "points_earned": 18,
  "base_points": 12,
  "perfect_bonus": 0,
  "speed_bonus": 5,
  "perfect_score": false,
  "new_level": 2,
  "time_taken": 85,
  "results_detail": [...]
}
```

## Calcul des points détaillé

### Par question
1. **Points de base** : 1 point si correct, 0 sinon
2. **Multiplicateur difficulté** :
   - Facile : 1x
   - Moyen : 1.5x
   - Difficile : 2x
3. **Bonus temps** : +0.5 si réponse en < 5 secondes

**Exemple** :
- Question difficile (3) répondue correctement en 4 secondes
- Points = (1 × 2.0) + 0.5 = 2.5 points

### Bonus fin de quiz
- **Score parfait** : +10 points
- **Vitesse** : +5 points si < 60 secondes total

## Migration depuis l'ancien système

L'ancien endpoint `/api/quiz/submit` reste disponible pour compatibilité, mais il est recommandé d'utiliser le nouveau système :

1. **Avant** : Récupérer toutes les questions → Répondre toutes → Soumettre
2. **Maintenant** : Démarrer session → Valider chaque réponse → Terminer

## Prochaines étapes

- [ ] Mettre à jour le frontend pour utiliser les nouveaux endpoints
- [ ] Ajouter plus de types de questions (numérique, ordre, etc.)
- [ ] Implémenter la priorisation selon les thèmes favoris
- [ ] Ajouter des statistiques détaillées par question
- [ ] Implémenter la reprise de quiz interrompu
