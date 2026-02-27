"""
Seed database with demo data for Quizz+ MVP
Run with: python seed_data.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_themes():
    """Seed quiz themes"""
    themes = [
        {
            "theme_id": "theme_culture_generale",
            "name": "Culture générale",
            "icon": "🌍",
            "description": "Testez vos connaissances générales",
            "color": "#3B82F6",
            "popular": True
        },
        {
            "theme_id": "theme_afrique",
            "name": "Afrique",
            "icon": "🌺",
            "description": "Découvrez le continent africain",
            "color": "#10B981",
            "popular": True
        },
        {
            "theme_id": "theme_histoire",
            "name": "Histoire",
            "icon": "📜",
            "description": "Voyage dans le temps",
            "color": "#8B5CF6",
            "popular": False
        },
        {
            "theme_id": "theme_sciences",
            "name": "Sciences",
            "icon": "🔬",
            "description": "Explorez le monde scientifique",
            "color": "#06B6D4",
            "popular": False
        },
        {
            "theme_id": "theme_divertissement",
            "name": "Divertissement",
            "icon": "🎬",
            "description": "Cinéma, musique et culture pop",
            "color": "#F59E0B",
            "popular": True
        },
        {
            "theme_id": "theme_senegal",
            "name": "Sénégal",
            "icon": "🇸🇳",
            "description": "Connaissances sur le Sénégal",
            "color": "#EF4444",
            "popular": False
        },
        {
            "theme_id": "theme_sport",
            "name": "Sport",
            "icon": "⚽",
            "description": "Actualités et histoire du sport",
            "color": "#14B8A6",
            "popular": False
        },
        {
            "theme_id": "theme_sante",
            "name": "Santé",
            "icon": "💊",
            "description": "Bien-être et santé",
            "color": "#EC4899",
            "popular": False
        }
    ]
    
    await db.quiz_themes.delete_many({})
    await db.quiz_themes.insert_many(themes)
    print(f"✅ Seeded {len(themes)} themes")

async def seed_questions():
    """Seed quiz questions"""
    questions = [
        # Culture générale
        {"question_id": "q1", "theme_id": "theme_culture_generale", "question_text": "Quelle est la capitale de l'Australie ?", "question_type": "mcq", "options": ["Sydney", "Canberra", "Melbourne", "Brisbane"], "correct_answer": "Canberra", "explanation": "Canberra est la capitale fédérale de l'Australie depuis 1913.", "difficulty": 2},
        {"question_id": "q2", "theme_id": "theme_culture_generale", "question_text": "Combien de continents y a-t-il sur Terre ?", "question_type": "mcq", "options": ["5", "6", "7", "8"], "correct_answer": "7", "explanation": "Les 7 continents sont : Afrique, Amérique du Nord, Amérique du Sud, Antarctique, Asie, Europe et Océanie.", "difficulty": 1},
        {"question_id": "q3", "theme_id": "theme_culture_generale", "question_text": "Qui a peint la Joconde ?", "question_type": "mcq", "options": ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Donatello"], "correct_answer": "Léonard de Vinci", "explanation": "La Joconde (Mona Lisa) a été peinte par Léonard de Vinci entre 1503 et 1519.", "difficulty": 1},
        {"question_id": "q4", "theme_id": "theme_culture_generale", "question_text": "Quel océan est le plus grand ?", "question_type": "mcq", "options": ["Atlantique", "Indien", "Pacifique", "Arctique"], "correct_answer": "Pacifique", "explanation": "L'océan Pacifique couvre environ 165 millions de km².", "difficulty": 1},
        {"question_id": "q5", "theme_id": "theme_culture_generale", "question_text": "Combien de pays composent l'Union Européenne ?", "question_type": "mcq", "options": ["25", "27", "28", "30"], "correct_answer": "27", "explanation": "Après le Brexit, l'UE compte 27 pays membres.", "difficulty": 2},
        {"question_id": "q6", "theme_id": "theme_culture_generale", "question_text": "Quelle langue est la plus parlée au monde ?", "question_type": "mcq", "options": ["Anglais", "Mandarin", "Espagnol", "Hindi"], "correct_answer": "Mandarin", "explanation": "Le mandarin est parlé par plus d'un milliard de personnes.", "difficulty": 2},
        {"question_id": "q7", "theme_id": "theme_culture_generale", "question_text": "Quel est le plus haut sommet du monde ?", "question_type": "mcq", "options": ["K2", "Mont Blanc", "Kilimandjaro", "Everest"], "correct_answer": "Everest", "explanation": "L'Everest culmine à 8 849 mètres.", "difficulty": 1},
        {"question_id": "q8", "theme_id": "theme_culture_generale", "question_text": "Combien de joueurs composent une équipe de basketball ?", "question_type": "mcq", "options": ["5", "6", "7", "11"], "correct_answer": "5", "explanation": "Une équipe de basketball compte 5 joueurs sur le terrain.", "difficulty": 1},
        {"question_id": "q9", "theme_id": "theme_culture_generale", "question_text": "Quelle est la monnaie du Japon ?", "question_type": "mcq", "options": ["Yuan", "Won", "Yen", "Baht"], "correct_answer": "Yen", "explanation": "Le yen (¥) est la monnaie officielle du Japon.", "difficulty": 2},
        {"question_id": "q10", "theme_id": "theme_culture_generale", "question_text": "Le Soleil est une étoile.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "Le Soleil est bien une étoile de type naine jaune.", "difficulty": 1},
        
        # Afrique
        {"question_id": "q11", "theme_id": "theme_afrique", "question_text": "Quel est le plus grand pays d'Afrique en superficie ?", "question_type": "mcq", "options": ["Nigeria", "Algérie", "RD Congo", "Libye"], "correct_answer": "Algérie", "explanation": "L'Algérie couvre 2,38 millions de km².", "difficulty": 1},
        {"question_id": "q12", "theme_id": "theme_afrique", "question_text": "Combien de pays composent l'Union Africaine ?", "question_type": "mcq", "options": ["50", "52", "54", "55"], "correct_answer": "55", "explanation": "L'Union Africaine compte 55 États membres.", "difficulty": 2},
        {"question_id": "q13", "theme_id": "theme_afrique", "question_text": "Quelle est la capitale de l'Éthiopie ?", "question_type": "mcq", "options": ["Nairobi", "Addis-Abeba", "Khartoum", "Kampala"], "correct_answer": "Addis-Abeba", "explanation": "Addis-Abeba est aussi le siège de l'Union Africaine.", "difficulty": 2},
        {"question_id": "q14", "theme_id": "theme_afrique", "question_text": "Quel fleuve est le plus long d'Afrique ?", "question_type": "mcq", "options": ["Congo", "Niger", "Zambèze", "Nil"], "correct_answer": "Nil", "explanation": "Le Nil mesure environ 6 650 km.", "difficulty": 1},
        {"question_id": "q15", "theme_id": "theme_afrique", "question_text": "Quel pays africain n'a jamais été colonisé ?", "question_type": "mcq", "options": ["Éthiopie", "Liberia", "Les deux", "Aucun"], "correct_answer": "Les deux", "explanation": "L'Éthiopie et le Liberia sont les seuls pays africains à n'avoir jamais été colonisés.", "difficulty": 3},
        {"question_id": "q16", "theme_id": "theme_afrique", "question_text": "Quelle monnaie est utilisée au Sénégal ?", "question_type": "mcq", "options": ["Naira", "FCFA", "Cedi", "Shilling"], "correct_answer": "FCFA", "explanation": "Le Franc CFA est utilisé dans 14 pays d'Afrique de l'Ouest et du Centre.", "difficulty": 1},
        {"question_id": "q17", "theme_id": "theme_afrique", "question_text": "Quel pays a remporté la CAN 2021 ?", "question_type": "mcq", "options": ["Égypte", "Cameroun", "Sénégal", "Algérie"], "correct_answer": "Sénégal", "explanation": "Le Sénégal a remporté sa première CAN en 2021.", "difficulty": 1},
        {"question_id": "q18", "theme_id": "theme_afrique", "question_text": "Combien de langues sont parlées en Afrique ?", "question_type": "mcq", "options": ["500-1000", "1000-1500", "1500-2000", "Plus de 2000"], "correct_answer": "Plus de 2000", "explanation": "L'Afrique compte plus de 2 000 langues différentes.", "difficulty": 3},
        {"question_id": "q19", "theme_id": "theme_afrique", "question_text": "Le Sahara est le plus grand désert chaud du monde.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "Le Sahara s'étend sur environ 9 millions de km².", "difficulty": 1},
        {"question_id": "q20", "theme_id": "theme_afrique", "question_text": "Quel célèbre festival de cinéma se tient à Ouagadougou ?", "question_type": "mcq", "options": ["FESPACO", "FESTAC", "MASA", "FCAT"], "correct_answer": "FESPACO", "explanation": "Le FESPACO est le plus grand festival de cinéma africain.", "difficulty": 2},
        
        # Histoire
        {"question_id": "q21", "theme_id": "theme_histoire", "question_text": "En quelle année l'Afrique du Sud a-t-elle tenu ses premières élections libres ?", "question_type": "mcq", "options": ["1990", "1992", "1994", "1996"], "correct_answer": "1994", "explanation": "Les premières élections multiraciales ont eu lieu en 1994, marquant la fin de l'apartheid.", "difficulty": 2},
        {"question_id": "q22", "theme_id": "theme_histoire", "question_text": "Quel empire africain était le plus riche au 14ème siècle ?", "question_type": "mcq", "options": ["Empire du Mali", "Empire Songhaï", "Empire Ashanti", "Royaume du Kongo"], "correct_answer": "Empire du Mali", "explanation": "Sous Mansa Moussa, l'Empire du Mali était extrêmement prospère.", "difficulty": 2},
        {"question_id": "q23", "theme_id": "theme_histoire", "question_text": "En quelle année a débuté la Première Guerre mondiale ?", "question_type": "mcq", "options": ["1912", "1914", "1916", "1918"], "correct_answer": "1914", "explanation": "La Première Guerre mondiale a commencé en 1914 et s'est terminée en 1918.", "difficulty": 1},
        {"question_id": "q24", "theme_id": "theme_histoire", "question_text": "Qui était Nelson Mandela ?", "question_type": "mcq", "options": ["Président du Kenya", "Leader anti-apartheid", "Roi du Swaziland", "Premier ministre du Ghana"], "correct_answer": "Leader anti-apartheid", "explanation": "Nelson Mandela a lutté contre l'apartheid et est devenu le premier président noir d'Afrique du Sud.", "difficulty": 1},
        {"question_id": "q25", "theme_id": "theme_histoire", "question_text": "Quelle était la capitale de l'Empire romain ?", "question_type": "mcq", "options": ["Athènes", "Rome", "Constantinople", "Alexandrie"], "correct_answer": "Rome", "explanation": "Rome était la capitale de l'Empire romain.", "difficulty": 1},
        {"question_id": "q26", "theme_id": "theme_histoire", "question_text": "En quelle année l'homme a-t-il marché sur la Lune ?", "question_type": "mcq", "options": ["1965", "1967", "1969", "1971"], "correct_answer": "1969", "explanation": "Neil Armstrong a marché sur la Lune le 21 juillet 1969.", "difficulty": 1},
        {"question_id": "q27", "theme_id": "theme_histoire", "question_text": "Qui a inventé l'imprimerie ?", "question_type": "mcq", "options": ["Gutenberg", "Newton", "Galilée", "Copernic"], "correct_answer": "Gutenberg", "explanation": "Johannes Gutenberg a inventé l'imprimerie moderne vers 1440.", "difficulty": 2},
        {"question_id": "q28", "theme_id": "theme_histoire", "question_text": "Quelle civilisation a construit les pyramides de Gizeh ?", "question_type": "mcq", "options": ["Grecque", "Romaine", "Égyptienne", "Perse"], "correct_answer": "Égyptienne", "explanation": "Les pyramides de Gizeh ont été construites par l'Égypte antique.", "difficulty": 1},
        {"question_id": "q29", "theme_id": "theme_histoire", "question_text": "Le mur de Berlin est tombé en 1989.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "Le mur de Berlin est tombé le 9 novembre 1989.", "difficulty": 1},
        {"question_id": "q30", "theme_id": "theme_histoire", "question_text": "Qui était Cléopâtre ?", "question_type": "mcq", "options": ["Reine d'Égypte", "Impératrice romaine", "Déesse grecque", "Prophétesse"], "correct_answer": "Reine d'Égypte", "explanation": "Cléopâtre VII était la dernière reine de l'Égypte antique.", "difficulty": 1},
        
        # Sciences
        {"question_id": "q31", "theme_id": "theme_sciences", "question_text": "Quelle planète est la plus proche du soleil ?", "question_type": "mcq", "options": ["Vénus", "Mercure", "Mars", "Terre"], "correct_answer": "Mercure", "explanation": "Mercure est la planète la plus proche du Soleil.", "difficulty": 1},
        {"question_id": "q32", "theme_id": "theme_sciences", "question_text": "Combien d'os compte le corps humain adulte ?", "question_type": "mcq", "options": ["186", "206", "226", "246"], "correct_answer": "206", "explanation": "Un adulte a 206 os dans son corps.", "difficulty": 2},
        {"question_id": "q33", "theme_id": "theme_sciences", "question_text": "Quelle est la vitesse de la lumière ?", "question_type": "mcq", "options": ["200 000 km/s", "300 000 km/s", "400 000 km/s", "500 000 km/s"], "correct_answer": "300 000 km/s", "explanation": "La lumière voyage à environ 299 792 km/s dans le vide.", "difficulty": 2},
        {"question_id": "q34", "theme_id": "theme_sciences", "question_text": "Quel gaz respirons-nous principalement ?", "question_type": "mcq", "options": ["Oxygène", "Azote", "Dioxyde de carbone", "Hydrogène"], "correct_answer": "Azote", "explanation": "L'air est composé d'environ 78% d'azote et 21% d'oxygène.", "difficulty": 2},
        {"question_id": "q35", "theme_id": "theme_sciences", "question_text": "Quelle est la formule chimique de l'eau ?", "question_type": "mcq", "options": ["H2O", "CO2", "O2", "H2O2"], "correct_answer": "H2O", "explanation": "L'eau est composée de deux atomes d'hydrogène et un d'oxygène.", "difficulty": 1},
        {"question_id": "q36", "theme_id": "theme_sciences", "question_text": "Combien de chromosomes possède l'être humain ?", "question_type": "mcq", "options": ["23", "42", "46", "48"], "correct_answer": "46", "explanation": "Les humains ont 23 paires de chromosomes, soit 46 au total.", "difficulty": 2},
        {"question_id": "q37", "theme_id": "theme_sciences", "question_text": "Quel organe pompe le sang dans le corps ?", "question_type": "mcq", "options": ["Le foie", "Le cœur", "Les poumons", "Les reins"], "correct_answer": "Le cœur", "explanation": "Le cœur est une pompe musculaire qui fait circuler le sang.", "difficulty": 1},
        {"question_id": "q38", "theme_id": "theme_sciences", "question_text": "Quelle est la plus petite unité de vie ?", "question_type": "mcq", "options": ["L'atome", "La molécule", "La cellule", "Le tissu"], "correct_answer": "La cellule", "explanation": "La cellule est l'unité de base de tous les êtres vivants.", "difficulty": 2},
        {"question_id": "q39", "theme_id": "theme_sciences", "question_text": "Le son se déplace plus vite que la lumière.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Faux", "explanation": "La lumière est beaucoup plus rapide que le son.", "difficulty": 1},
        {"question_id": "q40", "theme_id": "theme_sciences", "question_text": "Combien de temps met la lumière du soleil pour atteindre la Terre ?", "question_type": "mcq", "options": ["2 minutes", "8 minutes", "15 minutes", "30 minutes"], "correct_answer": "8 minutes", "explanation": "La lumière du Soleil met environ 8 minutes pour nous parvenir.", "difficulty": 2},
        
        # Divertissement  
        {"question_id": "q41", "theme_id": "theme_divertissement", "question_text": "Dans quel pays est né le reggae ?", "question_type": "mcq", "options": ["Jamaïque", "Cuba", "Nigeria", "Haïti"], "correct_answer": "Jamaïque", "explanation": "Le reggae est né en Jamaïque dans les années 1960.", "difficulty": 1},
        {"question_id": "q42", "theme_id": "theme_divertissement", "question_text": "Qui est l'artiste africain le plus streamé au monde (2023) ?", "question_type": "mcq", "options": ["Wizkid", "Burna Boy", "Davido", "Diamond Platnumz"], "correct_answer": "Burna Boy", "explanation": "Burna Boy est l'artiste africain le plus écouté sur les plateformes de streaming.", "difficulty": 2},
        {"question_id": "q43", "theme_id": "theme_divertissement", "question_text": "Quel film a remporté l'Oscar du meilleur film en 2020 ?", "question_type": "mcq", "options": ["1917", "Joker", "Parasite", "Once Upon a Time"], "correct_answer": "Parasite", "explanation": "Parasite, film sud-coréen, a fait l'histoire en remportant l'Oscar du meilleur film.", "difficulty": 2},
        {"question_id": "q44", "theme_id": "theme_divertissement", "question_text": "Qui a chanté 'Pata Pata' ?", "question_type": "mcq", "options": ["Miriam Makeba", "Angélique Kidjo", "Yvonne Chaka Chaka", "Brenda Fassie"], "correct_answer": "Miriam Makeba", "explanation": "Miriam Makeba, surnommée 'Mama Africa', a popularisé Pata Pata en 1967.", "difficulty": 2},
        {"question_id": "q45", "theme_id": "theme_divertissement", "question_text": "Quel acteur joue Black Panther dans Marvel ?", "question_type": "mcq", "options": ["Michael B. Jordan", "Chadwick Boseman", "Idris Elba", "Daniel Kaluuya"], "correct_answer": "Chadwick Boseman", "explanation": "Chadwick Boseman a incarné Black Panther avant son décès en 2020.", "difficulty": 1},
        {"question_id": "q46", "theme_id": "theme_divertissement", "question_text": "Quelle est la plateforme de streaming la plus populaire ?", "question_type": "mcq", "options": ["Netflix", "Amazon Prime", "Disney+", "HBO Max"], "correct_answer": "Netflix", "explanation": "Netflix reste le leader mondial du streaming avec plus de 200 millions d'abonnés.", "difficulty": 1},
        {"question_id": "q47", "theme_id": "theme_divertissement", "question_text": "Qui a réalisé le film 'Inception' ?", "question_type": "mcq", "options": ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"], "correct_answer": "Christopher Nolan", "explanation": "Christopher Nolan a réalisé Inception en 2010.", "difficulty": 2},
        {"question_id": "q48", "theme_id": "theme_divertissement", "question_text": "Quel groupe a chanté 'Bohemian Rhapsody' ?", "question_type": "mcq", "options": ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], "correct_answer": "Queen", "explanation": "Bohemian Rhapsody est le chef-d'œuvre du groupe Queen.", "difficulty": 1},
        {"question_id": "q49", "theme_id": "theme_divertissement", "question_text": "TikTok a été lancé en 2016.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "TikTok (Douyin en Chine) a été lancé en septembre 2016.", "difficulty": 2},
        {"question_id": "q50", "theme_id": "theme_divertissement", "question_text": "Combien d'épisodes compte une saison de Game of Thrones en moyenne ?", "question_type": "mcq", "options": ["8", "10", "12", "15"], "correct_answer": "10", "explanation": "La plupart des saisons de Game of Thrones comptent 10 épisodes.", "difficulty": 2},
        
        # Sénégal
        {"question_id": "q51", "theme_id": "theme_senegal", "question_text": "Quelle est la capitale du Sénégal ?", "question_type": "mcq", "options": ["Thiès", "Saint-Louis", "Dakar", "Ziguinchor"], "correct_answer": "Dakar", "explanation": "Dakar est la capitale et la plus grande ville du Sénégal.", "difficulty": 1},
        {"question_id": "q52", "theme_id": "theme_senegal", "question_text": "Quel sport est le plus populaire au Sénégal après le football ?", "question_type": "mcq", "options": ["Basketball", "Lutte traditionnelle", "Handball", "Athlétisme"], "correct_answer": "Lutte traditionnelle", "explanation": "La lutte sénégalaise est un sport national très populaire.", "difficulty": 1},
        {"question_id": "q53", "theme_id": "theme_senegal", "question_text": "En quelle année le Sénégal a-t-il obtenu son indépendance ?", "question_type": "mcq", "options": ["1958", "1960", "1962", "1965"], "correct_answer": "1960", "explanation": "Le Sénégal est devenu indépendant le 4 avril 1960.", "difficulty": 1},
        {"question_id": "q54", "theme_id": "theme_senegal", "question_text": "Qui est le premier président du Sénégal indépendant ?", "question_type": "mcq", "options": ["Abdou Diouf", "Léopold Sédar Senghor", "Abdoulaye Wade", "Macky Sall"], "correct_answer": "Léopold Sédar Senghor", "explanation": "Léopold Sédar Senghor a été président de 1960 à 1980.", "difficulty": 1},
        {"question_id": "q55", "theme_id": "theme_senegal", "question_text": "Quelle île est classée au patrimoine mondial de l'UNESCO ?", "question_type": "mcq", "options": ["Île de Ngor", "Île de Gorée", "Île de la Madeleine", "Île de Carabane"], "correct_answer": "Île de Gorée", "explanation": "L'île de Gorée est un symbole de la traite négrière.", "difficulty": 1},
        {"question_id": "q56", "theme_id": "theme_senegal", "question_text": "Quel plat est considéré comme le plat national sénégalais ?", "question_type": "mcq", "options": ["Mafé", "Yassa", "Thiéboudienne", "Soupe kandia"], "correct_answer": "Thiéboudienne", "explanation": "Le thiéboudienne (riz au poisson) est le plat national.", "difficulty": 1},
        {"question_id": "q57", "theme_id": "theme_senegal", "question_text": "Quel musicien sénégalais est mondialement connu ?", "question_type": "mcq", "options": ["Youssou N'Dour", "Baaba Maal", "Ismaël Lô", "Tous les trois"], "correct_answer": "Tous les trois", "explanation": "Le Sénégal a produit de nombreux artistes de renommée mondiale.", "difficulty": 2},
        {"question_id": "q58", "theme_id": "theme_senegal", "question_text": "Quelle est la langue officielle du Sénégal ?", "question_type": "mcq", "options": ["Wolof", "Français", "Pulaar", "Sérère"], "correct_answer": "Français", "explanation": "Le français est la langue officielle, bien que le wolof soit largement parlé.", "difficulty": 1},
        {"question_id": "q59", "theme_id": "theme_senegal", "question_text": "Le Monument de la Renaissance africaine est le plus haut d'Afrique.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "Avec 52 mètres, c'est la plus haute statue d'Afrique.", "difficulty": 2},
        {"question_id": "q60", "theme_id": "theme_senegal", "question_text": "Le Lac Rose (Retba) doit sa couleur à :", "question_type": "mcq", "options": ["Des algues", "Du sel", "Des minéraux", "La pollution"], "correct_answer": "Des algues", "explanation": "La couleur rose provient d'une algue microscopique appelée Dunaliella salina.", "difficulty": 2},
        
        # Sport
        {"question_id": "q61", "theme_id": "theme_sport", "question_text": "Combien de joueurs composent une équipe de football ?", "question_type": "mcq", "options": ["9", "10", "11", "12"], "correct_answer": "11", "explanation": "Une équipe de football compte 11 joueurs sur le terrain.", "difficulty": 1},
        {"question_id": "q62", "theme_id": "theme_sport", "question_text": "Quel pays a remporté la Coupe du Monde 2018 ?", "question_type": "mcq", "options": ["Brésil", "Allemagne", "France", "Argentine"], "correct_answer": "France", "explanation": "La France a battu la Croatie 4-2 en finale.", "difficulty": 1},
        {"question_id": "q63", "theme_id": "theme_sport", "question_text": "Qui est le meilleur buteur de l'histoire de la Coupe du Monde ?", "question_type": "mcq", "options": ["Pelé", "Ronaldo", "Miroslav Klose", "Messi"], "correct_answer": "Miroslav Klose", "explanation": "Klose a marqué 16 buts en Coupe du Monde.", "difficulty": 2},
        {"question_id": "q64", "theme_id": "theme_sport", "question_text": "Quel joueur est connu comme 'Le Pharaon' ?", "question_type": "mcq", "options": ["Riyad Mahrez", "Mohamed Salah", "Sadio Mané", "Samuel Eto'o"], "correct_answer": "Mohamed Salah", "explanation": "Mohamed Salah, joueur égyptien, est surnommé 'Le Pharaon'.", "difficulty": 1},
        {"question_id": "q65", "theme_id": "theme_sport", "question_text": "Combien de sets faut-il gagner pour remporter un match de tennis masculin en Grand Chelem ?", "question_type": "mcq", "options": ["2", "3", "4", "5"], "correct_answer": "3", "explanation": "Il faut remporter 3 sets sur 5 possibles.", "difficulty": 2},
        {"question_id": "q66", "theme_id": "theme_sport", "question_text": "Quel pays a accueilli les JO 2016 ?", "question_type": "mcq", "options": ["Chine", "Brésil", "Royaume-Uni", "Russie"], "correct_answer": "Brésil", "explanation": "Les JO 2016 ont eu lieu à Rio de Janeiro.", "difficulty": 1},
        {"question_id": "q67", "theme_id": "theme_sport", "question_text": "Qui est Usain Bolt ?", "question_type": "mcq", "options": ["Joueur de cricket", "Sprinter", "Boxeur", "Nageur"], "correct_answer": "Sprinter", "explanation": "Usain Bolt est le sprinter le plus rapide de l'histoire.", "difficulty": 1},
        {"question_id": "q68", "theme_id": "theme_sport", "question_text": "Combien de temps dure un match de rugby à XV ?", "question_type": "mcq", "options": ["60 minutes", "70 minutes", "80 minutes", "90 minutes"], "correct_answer": "80 minutes", "explanation": "Un match de rugby dure 80 minutes (2 mi-temps de 40 min).", "difficulty": 2},
        {"question_id": "q69", "theme_id": "theme_sport", "question_text": "Le marathon fait exactement 42 km.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Faux", "explanation": "Un marathon fait 42,195 km.", "difficulty": 2},
        {"question_id": "q70", "theme_id": "theme_sport", "question_text": "Quel pays a le plus de titres en Coupe d'Afrique des Nations ?", "question_type": "mcq", "options": ["Cameroun", "Ghana", "Égypte", "Nigeria"], "correct_answer": "Égypte", "explanation": "L'Égypte a remporté la CAN 7 fois.", "difficulty": 2},
        
        # Santé
        {"question_id": "q71", "theme_id": "theme_sante", "question_text": "Combien de litres d'eau faut-il boire par jour ?", "question_type": "mcq", "options": ["0,5 à 1L", "1,5 à 2L", "3 à 4L", "5L"], "correct_answer": "1,5 à 2L", "explanation": "Il est recommandé de boire 1,5 à 2 litres d'eau par jour.", "difficulty": 1},
        {"question_id": "q72", "theme_id": "theme_sante", "question_text": "Quel organe filtre le sang dans le corps humain ?", "question_type": "mcq", "options": ["Le foie", "Le cœur", "Les reins", "Les poumons"], "correct_answer": "Les reins", "explanation": "Les reins filtrent le sang et éliminent les déchets.", "difficulty": 1},
        {"question_id": "q73", "theme_id": "theme_sante", "question_text": "Quelle vitamine obtient-on grâce au soleil ?", "question_type": "mcq", "options": ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine E"], "correct_answer": "Vitamine D", "explanation": "La peau produit de la vitamine D quand elle est exposée au soleil.", "difficulty": 1},
        {"question_id": "q74", "theme_id": "theme_sante", "question_text": "Combien d'heures de sommeil un adulte devrait-il avoir ?", "question_type": "mcq", "options": ["5-6h", "7-9h", "10-12h", "4-5h"], "correct_answer": "7-9h", "explanation": "Les adultes ont besoin de 7 à 9 heures de sommeil par nuit.", "difficulty": 1},
        {"question_id": "q75", "theme_id": "theme_sante", "question_text": "Quel est le groupe sanguin universel donneur ?", "question_type": "mcq", "options": ["A+", "B-", "O-", "AB+"], "correct_answer": "O-", "explanation": "Le groupe O- peut donner du sang à tous les autres groupes.", "difficulty": 2},
        {"question_id": "q76", "theme_id": "theme_sante", "question_text": "Quelle maladie est causée par un manque de fer ?", "question_type": "mcq", "options": ["Diabète", "Anémie", "Hypertension", "Asthme"], "correct_answer": "Anémie", "explanation": "L'anémie ferriprive est causée par une carence en fer.", "difficulty": 2},
        {"question_id": "q77", "theme_id": "theme_sante", "question_text": "Combien de battements par minute a un cœur au repos ?", "question_type": "mcq", "options": ["40-60", "60-100", "100-140", "140-180"], "correct_answer": "60-100", "explanation": "Un rythme cardiaque normal au repos est de 60 à 100 bpm.", "difficulty": 2},
        {"question_id": "q78", "theme_id": "theme_sante", "question_text": "Quelle partie du corps est affectée par la cataracte ?", "question_type": "mcq", "options": ["Les oreilles", "Les yeux", "Le nez", "La peau"], "correct_answer": "Les yeux", "explanation": "La cataracte affecte le cristallin de l'œil.", "difficulty": 2},
        {"question_id": "q79", "theme_id": "theme_sante", "question_text": "Le stress peut causer des maladies physiques.", "question_type": "true_false", "options": ["Vrai", "Faux"], "correct_answer": "Vrai", "explanation": "Le stress chronique peut entraîner de nombreux problèmes de santé.", "difficulty": 1},
        {"question_id": "q80", "theme_id": "theme_sante", "question_text": "Quelle est la température corporelle normale ?", "question_type": "mcq", "options": ["35°C", "36°C", "37°C", "38°C"], "correct_answer": "37°C", "explanation": "La température corporelle normale est d'environ 37°C.", "difficulty": 1}
    ]
    
    await db.quiz_questions.delete_many({})
    await db.quiz_questions.insert_many(questions)
    print(f"✅ Seeded {len(questions)} questions")

async def seed_fun_facts():
    """Seed fun facts"""
    facts = [
        {"fact_id": "fact1", "theme_id": "theme_afrique", "title": "L'Algérie, géant africain", "content": "L'Algérie est le plus grand pays d'Afrique avec une superficie de 2,38 millions de km². C'est presque 5 fois la taille de la France !", "source": "Atlas mondial", "points": 2},
        {"fact_id": "fact2", "theme_id": "theme_senegal", "title": "Démocratie sénégalaise", "content": "Le Sénégal a été le premier pays d'Afrique subsaharienne à organiser un transfert de pouvoir démocratique pacifique en 2000, avec l'élection d'Abdoulaye Wade.", "source": "Histoire politique", "points": 2},
        {"fact_id": "fact3", "theme_id": "theme_sport", "title": "Sadio Mané, fierté africaine", "content": "Sadio Mané a été élu meilleur joueur africain de l'année en 2019 et 2022. Il a également mené le Sénégal à sa première victoire en CAN.", "source": "FIFA", "points": 2},
        {"fact_id": "fact4", "theme_id": "theme_sciences", "title": "Voyage de la lumière", "content": "La lumière du soleil met environ 8 minutes et 20 secondes pour atteindre la Terre, parcourant 150 millions de kilomètres.", "source": "Astronomie", "points": 2},
        {"fact_id": "fact5", "theme_id": "theme_histoire", "title": "Mansa Moussa, l'homme le plus riche", "content": "Mansa Moussa, empereur du Mali au 14ème siècle, reste à ce jour l'homme le plus riche de l'Histoire avec une fortune estimée à 400 milliards de dollars (ajustée).", "source": "Histoire économique", "points": 2},
        {"fact_id": "fact6", "theme_id": "theme_culture_generale", "title": "Le cœur humain", "content": "Le cœur humain bat environ 100 000 fois par jour, soit plus de 35 millions de fois par an. Au cours d'une vie, cela représente près de 3 milliards de battements !", "source": "Médecine", "points": 2},
        {"fact_id": "fact7", "theme_id": "theme_divertissement", "title": "Netflix mondial", "content": "Netflix compte plus de 230 millions d'abonnés dans le monde et produit du contenu dans plus de 190 pays.", "source": "Industrie du streaming", "points": 2},
        {"fact_id": "fact8", "theme_id": "theme_afrique", "title": "Langues africaines", "content": "L'Afrique abrite plus de 2 000 langues différentes, soit environ un tiers des langues du monde. Le Nigeria à lui seul compte plus de 500 langues.", "source": "Linguistique", "points": 2},
        {"fact_id": "fact9", "theme_id": "theme_sante", "title": "Le pouvoir du sommeil", "content": "Pendant le sommeil, votre cerveau élimine les toxines accumulées pendant la journée. Un manque chronique de sommeil peut augmenter les risques de maladies.", "source": "Neurosciences", "points": 2},
        {"fact_id": "fact10", "theme_id": "theme_senegal", "title": "Île de Gorée", "content": "L'île de Gorée, au large de Dakar, est classée au patrimoine mondial de l'UNESCO. Elle symbolise la traite négrière et attire plus de 200 000 visiteurs par an.", "source": "UNESCO", "points": 2},
        {"fact_id": "fact11", "theme_id": "theme_sciences", "title": "ADN et bananes", "content": "Les humains partagent environ 60% de leur ADN avec les bananes. Nous sommes plus proches génétiquement des plantes que nous ne le pensons !", "source": "Génétique", "points": 2},
        {"fact_id": "fact12", "theme_id": "theme_divertissement", "title": "Burna Boy, star mondiale", "content": "Burna Boy est devenu le premier artiste africain à remplir le Madison Square Garden à New York en 2022, marquant un tournant pour l'Afrobeats.", "source": "Industrie musicale", "points": 2},
        {"fact_id": "fact13", "theme_id": "theme_histoire", "title": "Les pyramides mystérieuses", "content": "Les pyramides de Gizeh ont été construites il y a plus de 4 500 ans. Leur méthode de construction exacte reste un mystère qui fascine toujours les scientifiques.", "source": "Égyptologie", "points": 2},
        {"fact_id": "fact14", "theme_id": "theme_afrique", "title": "Le Nil, fleuve légendaire", "content": "Le Nil, long de 6 650 km, traverse 11 pays africains. C'est le plus long fleuve du monde et il a été essentiel au développement de l'Égypte antique.", "source": "Géographie", "points": 2},
        {"fact_id": "fact15", "theme_id": "theme_sport", "title": "Marathon historique", "content": "Le marathon doit son nom à la légende du messager grec Philippidès qui aurait couru de Marathon à Athènes (environ 40 km) pour annoncer une victoire militaire.", "source": "Histoire du sport", "points": 2}
    ]
    
    await db.fun_facts.delete_many({})
    await db.fun_facts.insert_many(facts)
    print(f"✅ Seeded {len(facts)} fun facts")

async def seed_badges():
    """Seed achievement badges"""
    badges = [
        {"badge_id": "badge_streak_7", "name": "Feu sacré", "description": "Connecte-toi 7 jours d'affilée", "icon": "🔥", "requirement": "7 jours consécutifs"},
        {"badge_id": "badge_perfect_score", "name": "Score parfait", "description": "Obtiens 10/10 à un quizz", "icon": "🎯", "requirement": "10/10 dans un quizz"},
        {"badge_id": "badge_10_quizzes", "name": "Joueur assidu", "description": "Complète 10 quizz", "icon": "📚", "requirement": "10 quizz joués"},
        {"badge_id": "badge_expert_africa", "name": "Expert Afrique", "description": "Maîtrise le thème Afrique", "icon": "🌍", "requirement": "80% de réussite sur 5 quizz Afrique"},
        {"badge_id": "badge_top_10", "name": "Élite", "description": "Entre dans le Top 10 mondial", "icon": "👑", "requirement": "Top 10 classement mondial"},
        {"badge_id": "badge_ambassador", "name": "Ambassadeur", "description": "Invite 5 amis", "icon": "🤝", "requirement": "5 amis invités et inscrits"},
        {"badge_id": "badge_speed_runner", "name": "Éclair", "description": "Termine un quizz en moins de 60 secondes", "icon": "⚡", "requirement": "Quizz complété en < 60s"},
        {"badge_id": "badge_scholar", "name": "Érudit", "description": "Atteins le niveau 5", "icon": "🎓", "requirement": "Niveau 5 atteint"}
    ]
    
    await db.badges.delete_many({})
    await db.badges.insert_many(badges)
    print(f"✅ Seeded {len(badges)} badges")

async def seed_demo_users():
    """Seed demo users for leaderboard"""
    from passlib.context import CryptContext
    import uuid
    from datetime import datetime, timezone
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    demo_users = [
        {"name": "Aminata Diallo", "country": "Sénégal", "points": 4820, "flag": "🇸🇳"},
        {"name": "Kofi Asante", "country": "Côte d'Ivoire", "points": 4311, "flag": "🇨🇮"},
        {"name": "Marie Nkomo", "country": "Cameroun", "points": 3987, "flag": "🇨🇲"},
        {"name": "Ibrahima Sarr", "country": "Sénégal", "points": 3650, "flag": "🇸🇳"},
        {"name": "Lucas Martin", "country": "France", "points": 3401, "flag": "🇫🇷"},
        {"name": "Fatou Bah", "country": "Guinée", "points": 3156, "flag": "🇬🇳"},
        {"name": "Mohamed Traoré", "country": "Mali", "points": 2890, "flag": "🇲🇱"},
        {"name": "Aïcha Diop", "country": "Sénégal", "points": 2675, "flag": "🇸🇳"},
        {"name": "Kwame Mensah", "country": "Ghana", "points": 2543, "flag": "🇬🇭"},
        {"name": "Sophie Dubois", "country": "France", "points": 2401, "flag": "🇫🇷"},
        {"name": "Abdoulaye Sow", "country": "Sénégal", "points": 2287, "flag": "🇸🇳"},
        {"name": "Nadège Kouassi", "country": "Côte d'Ivoire", "points": 2156, "flag": "🇨🇮"},
        {"name": "Pierre Kamga", "country": "Cameroun", "points": 1998, "flag": "🇨🇲"},
        {"name": "Mariam Touré", "country": "Mali", "points": 1876, "flag": "🇲🇱"},
        {"name": "Jean-Baptiste Ndao", "country": "Sénégal", "points": 1754, "flag": "🇸🇳"},
        {"name": "Khadija Mbaye", "country": "Sénégal", "points": 1632, "flag": "🇸🇳"},
        {"name": "Emmanuel Osei", "country": "Ghana", "points": 1521, "flag": "🇬🇭"},
        {"name": "Yasmine Benali", "country": "Maroc", "points": 1410, "flag": "🇲🇦"},
        {"name": "Thierno Balde", "country": "Guinée", "points": 1298, "flag": "🇬🇳"},
        {"name": "Christelle Eba", "country": "Cameroun", "points": 1187, "flag": "🇨🇲"}
    ]
    
    # Clear existing demo users\n    await db.users.delete_many({\"email\": {\"$regex\": \"demo.*@quizzplus.com\"}})\n    \n    for i, user_data in enumerate(demo_users):\n        user_doc = {\n            \"user_id\": f\"demo_user_{uuid.uuid4().hex[:8]}\",\n            \"email\": f\"demo{i+1}@quizzplus.com\",\n            \"password\": pwd_context.hash(\"demo123\"),\n            \"name\": user_data[\"name\"],\n            \"picture\": f\"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data['name']}\",\n            \"country\": user_data[\"country\"],\n            \"favorite_themes\": [\"Culture générale\", \"Afrique\"],\n            \"points\": user_data[\"points\"],\n            \"level\": max(1, user_data[\"points\"] // 500),\n            \"streak_days\": 0,\n            \"last_login_date\": None,\n            \"created_at\": datetime.now(timezone.utc).isoformat()\n        }\n        await db.users.insert_one(user_doc)\n    \n    print(f\"✅ Seeded {len(demo_users)} demo users\")\n\nasync def main():\n    print(\"🌱 Seeding Quizz+ database...\")\n    \n    await seed_themes()\n    await seed_questions()\n    await seed_fun_facts()\n    await seed_badges()\n    await seed_demo_users()\n    \n    print(\"\\n✨ Database seeding complete!\")\n    client.close()\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n