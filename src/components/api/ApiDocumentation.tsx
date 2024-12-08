import { Code2 } from "lucide-react";

const ApiDocumentation = () => {
  return (
    <div className="space-y-6 text-gray-300">
      <div>
        <h3 className="text-xl font-medium text-white mb-2">Authentication</h3>
        <p className="mb-2">
          Incluez votre clé API dans l'en-tête de chaque requête :
        </p>
        <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
          <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-xl font-medium text-white mb-2">Endpoints</h3>
        <div className="space-y-4">
          <div>
            <code className="text-blue-400">POST /api/search</code>
            <p className="mt-1">Rechercher dans la base de données</p>
            <pre className="bg-gray-800 p-4 rounded mt-2 overflow-x-auto">
              <code>{`curl -X POST "https://api.example.com/search" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"keyword": "votre_recherche"}'`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;