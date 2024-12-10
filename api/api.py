from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from elasticsearch import Elasticsearch
import html
import bleach
from functools import wraps

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:8080"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuration Elasticsearch avec gestion d'erreur
try:
    es = Elasticsearch(['http://localhost:9200'])
    if not es.ping():
        print("ERREUR: Impossible de se connecter à Elasticsearch. Assurez-vous qu'il est installé et en cours d'exécution.")
        print("Instructions d'installation :")
        print("1. Téléchargez Elasticsearch depuis : https://www.elastic.co/downloads/elasticsearch")
        print("2. Décompressez le fichier")
        print("3. Exécutez bin/elasticsearch.bat (Windows) ou bin/elasticsearch (Linux/Mac)")
        print("4. Attendez que le service démarre (peut prendre quelques minutes)")
        print("5. Relancez cette API")
        exit(1)
    print("Connexion à Elasticsearch établie avec succès!")
except Exception as e:
    print(f"ERREUR lors de la connexion à Elasticsearch: {str(e)}")
    print("Assurez-vous qu'Elasticsearch est installé et en cours d'exécution sur http://localhost:9200")
    exit(1)

DATA_DIR = "data"
INDEX_NAME = "zeenbase"

print(f"Démarrage de l'API. Dossier de données: {DATA_DIR}")
print(f"Chemin absolu du dossier de données: {os.path.abspath(DATA_DIR)}")

def sanitize_input(text):
    """Sanitize input to prevent XSS attacks"""
    return bleach.clean(str(text))

def verify_api_key(api_key):
    print(f"Vérification de la clé API: {api_key[:5]}...")
    return api_key and api_key.startswith("sk_")

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return '', 204
            
        print("Vérification de l'en-tête Authorization")
        api_key = request.headers.get('Authorization')
        print(f"En-têtes reçus: {request.headers}")
        
        if not api_key:
            print("Pas de clé API fournie")
            return jsonify({"error": "No API key provided"}), 401
        
        api_key = api_key.replace('Bearer ', '')
        
        if not verify_api_key(api_key):
            print(f"Clé API invalide: {api_key}")
            return jsonify({"error": "Invalid API key"}), 401
            
        return f(*args, **kwargs)
    return decorated

def index_files():
    """Index all text files in the data directory"""
    try:
        if not es.indices.exists(index=INDEX_NAME):
            print(f"Création de l'index {INDEX_NAME}...")
            es.indices.create(index=INDEX_NAME)
            print("Index créé avec succès!")
        
        files_indexed = 0
        for root, dirs, files in os.walk(DATA_DIR):
            for file in files:
                if file.endswith('.txt'):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            doc = {
                                'path': file_path,
                                'content': content,
                                'type': 'file',
                                'size': os.path.getsize(file_path),
                                'last_modified': time.ctime(os.path.getmtime(file_path))
                            }
                            es.index(index=INDEX_NAME, document=doc)
                            files_indexed += 1
                        print(f"Fichier indexé avec succès: {file_path}")
                    except Exception as e:
                        print(f"Erreur lors de l'indexation de {file_path}: {e}")
        
        print(f"Indexation terminée! {files_indexed} fichiers indexés.")
    except Exception as e:
        print(f"Erreur critique lors de l'indexation: {e}")
        exit(1)

@app.route('/search', methods=['POST', 'OPTIONS'])
@require_api_key
def search():
    print("Nouvelle requête de recherche reçue")
    print(f"Méthode: {request.method}")
    print(f"En-têtes: {request.headers}")
    
    try:
        data = request.get_json()
        print(f"Données reçues: {data}")
    except Exception as e:
        print(f"Erreur lors de la lecture des données JSON: {e}")
        return jsonify({"error": "Invalid JSON"}), 400
    
    if not data or not isinstance(data, dict):
        print("Format de requête invalide")
        return jsonify({"error": "Invalid request format"}), 400
        
    keyword = data.get('keyword', '')
    if not keyword or not isinstance(keyword, str):
        print("Pas de mot-clé fourni")
        return jsonify({"error": "No keyword provided"}), 400

    keyword = sanitize_input(keyword)
    print(f"Recherche du mot-clé: {keyword}")
    
    start_time = time.time()
    
    try:
        search_query = {
            "query": {
                "match": {
                    "content": keyword
                }
            }
        }
        
        response = es.search(index=INDEX_NAME, body=search_query)
        hits = response['hits']['hits']
        
        results = []
        for hit in hits:
            source = hit['_source']
            result = {
                "path": html.escape(source['path']),
                "type": html.escape(source['type']),
                "size": source['size'],
                "last_modified": html.escape(source['last_modified'])
            }
            results.append(result)
            
    except Exception as e:
        print(f"Erreur lors de la recherche: {e}")
        return jsonify({"error": "Search error"}), 500

    execution_time = time.time() - start_time
    
    response_data = {
        "results": results,
        "total_files_searched": len(results),
        "execution_time": execution_time,
        "total_results": len(results)
    }
    
    print(f"Recherche terminée en {execution_time:.2f} secondes")
    print(f"Résultats: {response_data}")
    return jsonify(response_data)

if __name__ == '__main__':
    print("Indexation des fichiers...")
    index_files()
    print("Démarrage du serveur Flask sur le port 5000...")
    app.run(debug=True, port=5000)
