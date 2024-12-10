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

@app.route('/search', methods=['POST'])
def search():
    try:
        # Get query from POST request body
        data = request.get_json()
        if not data or 'q' not in data:
            return jsonify({"error": "Missing query parameter 'q'"}), 400

        query = data['q']
        
        # Call to Leakosint API
        leakosint_data = {
            "token": LEAKOSINT_TOKEN,
            "request": query,
            "limit": 100,
            "lang": "en"
        }
        
        print(f"Sending request to Leakosint: {leakosint_data}")
        response = requests.post(LEAKOSINT_URL, json=leakosint_data)
        
        if not response.ok:
            print(f"Error from Leakosint: Status {response.status_code}, Response: {response.text}")
            return jsonify({"error": "Error from Leakosint API"}), response.status_code
            
        results = response.json()
        print(f"Received response from Leakosint: {results}")
        
        return jsonify(results)
    except Exception as e:
        print(f"Error during search: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting API on port 5000...")
    app.run(debug=True, port=5000)