"""
Script de démarrage qui vérifie et seed la base de données si nécessaire
Utilisé en production sur Render pour s'assurer que les données sont présentes
"""
import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'quizzplus')

if not mongo_url:
    print("❌ MONGO_URL non défini")
    sys.exit(1)

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

async def check_and_seed():
    """Vérifie si la base contient des thèmes, sinon lance les seeders"""
    try:
        # Vérifier si des thèmes existent
        theme_count = await db.quiz_themes.count_documents({})
        
        if theme_count == 0:
            print("🌱 Aucun thème trouvé. Lancement des seeders...")
            # Importer et exécuter seed_data
            from seed_data import main as seed_main
            await seed_main()
            print("✅ Seeders terminés avec succès!")
        else:
            print(f"✅ Base de données déjà initialisée ({theme_count} thèmes trouvés)")
        
        client.close()
        return True
    except Exception as e:
        print(f"❌ Erreur lors du seeding: {e}")
        import traceback
        traceback.print_exc()
        client.close()
        return False

if __name__ == "__main__":
    success = asyncio.run(check_and_seed())
    sys.exit(0 if success else 1)
