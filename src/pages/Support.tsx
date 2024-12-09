import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "@/components/support/FeedbackForm";

const DISCORD_INVITE_URL = "https://discord.com/invite/UfnBUHXbDV";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Support</h1>
        
        <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-300 mb-6">
            Notre équipe est là pour vous aider. Rejoignez notre communauté Discord
            pour obtenir de l'aide rapidement.
          </p>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contactez nous
            </Button>
          </a>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Votre Avis</h2>
          <p className="text-gray-300 mb-6">
            Nous apprécions vos retours pour améliorer nos services.
          </p>
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default Support;