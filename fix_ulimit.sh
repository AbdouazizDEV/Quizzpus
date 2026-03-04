#!/bin/bash
# Script pour augmenter la limite de fichiers ouverts
# Nécessaire pour éviter l'erreur "EMFILE: too many open files" avec React

# Augmenter la limite pour la session actuelle
ulimit -n 65536

echo "✅ Limite de fichiers ouverts augmentée à 65536"
echo "Pour rendre cette modification permanente, ajoute cette ligne à ~/.bashrc :"
echo "ulimit -n 65536"
