from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from concurrent.futures import ThreadPoolExecutor
import re
import jwt
from functools import wraps
import html
import bleach
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import secrets

app = Flask(__name__)
# Autoriser explicitement localhost:5173 pour le développement
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

DATA_DIR = "data"

def sanitize_input(text):
    """Sanitize input to prevent XSS attacks"""
    return bleach.clean(str(text))

def verify_api_key(api_key):
    # Vérification basique de la clé API
    return api_key and api_key.startswith("sk_")

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('Authorization')
        
        if not api_key:
            print("Pas de clé API fournie")
            return jsonify({"error": "No API key provided"}), 401
        
        # Nettoyer le préfixe Bearer si présent
        api_key = api_key.replace('Bearer ', '')
        
        if not verify_api_key(api_key):
            print(f"Clé API invalide: {api_key}")
            return jsonify({"error": "Invalid API key"}), 401
            
        return f(*args, **kwargs)
    return decorated

def search_in_file(file_path, keyword):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if sanitize_input(keyword.lower()) in content.lower():
                return {
                    "path": file_path,
                    "type": "file",
                    "size": os.path.getsize(file_path),
                    "last_modified": time.ctime(os.path.getmtime(file_path))
                }
    except Exception as e:
        print(f"Erreur lors de la lecture de {file_path}: {e}")
    return None

def get_all_files(directory):
    if not os.path.exists(directory):
        print(f"Le répertoire {directory} n'existe pas")
        return []
        
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.txt'):
                all_files.append(os.path.join(root, file))
    return all_files

@app.route('/search', methods=['POST', 'OPTIONS'])
@require_api_key
def search():
    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return '', 204

    print("Nouvelle requête de recherche reçue")
    data = request.get_json()
    
    if not data or not isinstance(data, dict):
        print("Format de requête invalide")
        return jsonify({"error": "Invalid request format"}), 400
        
    keyword = data.get('keyword', '')
    if not keyword or not isinstance(keyword, str):
        print("Pas de mot-clé fourni")
        return jsonify({"error": "No keyword provided"}), 400

    keyword = sanitize_input(keyword)
    print(f"Recherche du mot-clé: {keyword}")
    
    if not hasattr(search, 'last_request'):
        search.last_request = {}
    
    client_ip = request.remote_addr
    current_time = time.time()
    
    if client_ip in search.last_request:
        time_diff = current_time - search.last_request[client_ip]
        if time_diff < 1:
            print(f"Rate limit dépassé pour {client_ip}")
            return jsonify({"error": "Rate limit exceeded"}), 429
    
    search.last_request[client_ip] = current_time

    start_time = time.time()
    all_files = get_all_files(DATA_DIR)
    print(f"Nombre de fichiers trouvés: {len(all_files)}")
    
    with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
        search_results = list(filter(None, executor.map(
            lambda x: search_in_file(x, keyword), 
            all_files
        )))

    execution_time = time.time() - start_time
    
    safe_results = []
    for result in search_results:
        safe_result = {
            "path": html.escape(result["path"]),
            "type": html.escape(result["type"]),
            "size": result["size"],
            "last_modified": html.escape(result["last_modified"])
        }
        safe_results.append(safe_result)
    
    response_data = {
        "results": safe_results,
        "total_files_searched": len(all_files),
        "execution_time": execution_time,
        "total_results": len(safe_results)
    }
    
    print(f"Recherche terminée en {execution_time:.2f} secondes")
    return jsonify(response_data)

if __name__ == '__main__':
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Répertoire {DATA_DIR} créé")
    app.run(debug=True, port=5000)