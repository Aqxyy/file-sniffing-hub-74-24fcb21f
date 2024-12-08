import { Switch } from "@/components/ui/switch";

interface ApiSettingsProps {
  apiEnabled: boolean;
  onToggleApi: () => void;
}

const ApiSettings = ({ apiEnabled, onToggleApi }: ApiSettingsProps) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Paramètres du site</h2>
      <div className="flex items-center space-x-4">
        <span className="text-white">Accès API</span>
        <Switch checked={apiEnabled} onCheckedChange={onToggleApi} />
        <span className="text-gray-400">
          {apiEnabled ? 'Activé' : 'Désactivé'}
        </span>
      </div>
      <p className="text-gray-400 mt-2 text-sm">
        Active ou désactive l'accès à l'API pour tous les utilisateurs ayant un plan Pro ou API Lifetime
      </p>
    </div>
  );
};

export default ApiSettings;