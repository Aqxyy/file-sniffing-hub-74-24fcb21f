import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackForm } from "@/components/support/FeedbackForm";

const DISCORD_INVITE_URL = "https://discord.com/invite/UfnBUHXbDV";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Support</h1>
        
        <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-300 mb-6">
            Rejoignez notre communauté Discord pour obtenir de l'aide et discuter avec d'autres utilisateurs.
          </p>
          <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Rejoindre le Discord
            </Button>
          </a>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Donnez-nous votre avis</h2>
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default Support;