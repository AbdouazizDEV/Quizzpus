#!/bin/bash

# Script d'installation de MongoDB pour Ubuntu

echo "🔧 Installation de MongoDB..."

# Ajouter la clé GPG de MongoDB
echo "📥 Téléchargement de la clé GPG MongoDB..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Ajouter le dépôt MongoDB
echo "📦 Ajout du dépôt MongoDB..."
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Mettre à jour les paquets
echo "🔄 Mise à jour des paquets..."
sudo apt-get update

# Installer MongoDB
echo "📥 Installation de MongoDB..."
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
echo "🚀 Démarrage de MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier l'installation
echo "✅ Vérification de l'installation..."
if sudo systemctl is-active --quiet mongod; then
    echo "✅ MongoDB est démarré avec succès !"
    mongosh --version
else
    echo "❌ Erreur: MongoDB n'a pas démarré correctement"
    echo "   Vérifiez avec: sudo systemctl status mongod"
    exit 1
fi

echo ""
echo "✅ Installation terminée !"
echo "   MongoDB est maintenant disponible sur mongodb://localhost:27017"
