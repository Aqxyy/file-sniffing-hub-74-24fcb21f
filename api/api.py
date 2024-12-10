import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from elasticsearch import Elasticsearch
import glob
import json

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Récupération du mot de passe et du certificat générés lors de l'installation
elastic_password = ""
ca_certs = ""

try:
    # Lire le mot de passe depuis le fichier elastic-passwords.txt
    password_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                "elasticsearch-8.16.1", "config", "elastic-passwords.txt")
    if os.path.exists(password_file):
        with open(password_file, 'r') as f:
            for line in f:
                if "elastic =" in line:
                    elastic_password = line.split("=")[1].strip()
                    break
    
    # Chemin vers le certificat CA
    ca_certs = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                           "elasticsearch-8.16.1", "config", "certs", "http_ca.crt")
    
    # Configuration Elasticsearch avec authentification et SSL
    es = Elasticsearch(
        "https://localhost:9200",
        basic_auth=("elastic", elastic_password),
        ca_certs=ca_certs,
    )
    
    if not es.ping():
        print("ERREUR: Impossible de se connecter à Elasticsearch.")
        print("\nInstructions de dépannage:")
        print("1. Vérifiez que le service Elasticsearch est en cours d'exécution")
        print("2. Vérifiez le mot de passe dans le fichier elastic-passwords.txt")
        print("3. Vérifiez que le certificat CA existe dans le dossier config/certs")
        exit(1)
        
    print("Connexion à Elasticsearch établie avec succès!")
    
except Exception as e:
    print(f"ERREUR lors de la connexion à Elasticsearch: {str(e)}")
    print("\nInstructions de dépannage:")
    print("1. Assurez-vous qu'Elasticsearch est installé et en cours d'exécution")
    print("2. Vérifiez les fichiers de configuration dans le dossier elasticsearch-8.16.1/config")
    print("3. Le mot de passe initial se trouve dans elastic-passwords.txt")
    print("4. Le certificat CA doit être dans config/certs/http_ca.crt")
    exit(1)

DATA_DIR = "data"
INDEX_NAME = "documents"

# Fonction pour indexer les fichiers
def index_files():
    print("Indexation des fichiers...")
    
    # Création de l'index s'il n'existe pas
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, mappings={
            "properties": {
                "content": {"type": "text", "analyzer": "standard"},
                "filename": {"type": "keyword"}
            }
        })
    
    # Parcours des fichiers
    data_dir = os.path.abspath(DATA_DIR)
    print(f"Chemin absolu du dossier de données: {data_dir}")
    
    for filepath in glob.glob(os.path.join(data_dir, "*.txt")):
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                filename = os.path.basename(filepath)
                
                # Indexation du document
                es.index(index=INDEX_NAME, document={
                    "content": content,
                    "filename": filename
                })
                print(f"Fichier indexé: {filename}")
        except Exception as e:
            print(f"Erreur lors de l'indexation de {filepath}: {str(e)}")

# Routes API
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    try:
        results = es.search(index=INDEX_NAME, query={
            "multi_match": {
                "query": query,
                "fields": ["content", "filename"]
            }
        })
        
        hits = results['hits']['hits']
        formatted_results = [{
            'filename': hit['_source']['filename'],
            'content': hit['_source']['content'],
            'score': hit['_score']
        } for hit in hits]
        
        return jsonify(formatted_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Démarrage de l'API. Dossier de données:", DATA_DIR)
    index_files()
    app.run(debug=True, port=5000)