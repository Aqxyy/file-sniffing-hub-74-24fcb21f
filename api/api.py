from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

LEAKOSINT_TOKEN = "5425922455:GJqhUctH"
LEAKOSINT_URL = 'https://server.leakosint.com/'

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    try:
        # Appel à l'API Leakosint
        leakosint_data = {
            "token": LEAKOSINT_TOKEN,
            "request": query,
            "limit": 100,
            "lang": "en"
        }
        
        response = requests.post(LEAKOSINT_URL, json=leakosint_data)
        results = response.json()
        
        return jsonify(results)
    except Exception as e:
        print(f"Erreur lors de la recherche: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Démarrage de l'API sur le port 5000...")
    app.run(debug=True, port=5000)