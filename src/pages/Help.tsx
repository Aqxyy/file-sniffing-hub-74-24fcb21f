import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Help = () => {
  const discordLink = "https://discord.gg/votre-lien-discord"; // Remplacez par votre lien Discord

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Support</h1>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Besoin d'aide ?</h2>
          <p className="text-gray-300 mb-8">
            Rejoignez notre communauté Discord pour obtenir de l'aide et discuter avec d'autres utilisateurs.
          </p>
          
          <Button
            onClick={() => window.open(discordLink, '_blank')}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2"
          >
            <MessageSquare className="mr-2" />
            Rejoindre Discord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;