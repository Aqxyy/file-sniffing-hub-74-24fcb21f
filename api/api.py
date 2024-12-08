from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from concurrent.futures import ThreadPoolExecutor
import re
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app)

DATA_DIR = "data"

def verify_api_key(api_key):
    # TODO: Implement actual API key verification against Supabase
    # For now, we'll just check if it starts with "sk_"
    return api_key.startswith("sk_")

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('Authorization')
        if not api_key:
            return jsonify({"error": "No API key provided"}), 401
        
        api_key = api_key.replace('Bearer ', '')
        if not verify_api_key(api_key):
            return jsonify({"error": "Invalid API key"}), 401
            
        return f(*args, **kwargs)
    return decorated

def search_in_file(file_path, keyword):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if keyword.lower() in content.lower():
                return {
                    "path": file_path,
                    "type": "file",
                    "size": os.path.getsize(file_path),
                    "last_modified": time.ctime(os.path.getmtime(file_path))
                }
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return None

def get_all_files(directory):
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.txt'):
                all_files.append(os.path.join(root, file))
    return all_files

@app.route('/search', methods=['POST'])
@require_api_key
def search():
    data = request.get_json()
    keyword = data.get('keyword', '')
    
    if not keyword:
        return jsonify({"error": "No keyword provided"}), 400

    start_time = time.time()
    all_files = get_all_files(DATA_DIR)
    
    with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
        search_results = list(filter(None, executor.map(
            lambda x: search_in_file(x, keyword), 
            all_files
        )))

    execution_time = time.time() - start_time
    
    return jsonify({
        "results": search_results,
        "total_files_searched": len(all_files),
        "execution_time": execution_time,
        "total_results": len(search_results)
    })

if __name__ == '__main__':
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    app.run(debug=True, port=5000)