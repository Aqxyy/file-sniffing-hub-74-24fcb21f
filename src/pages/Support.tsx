import { Button } from "@/components/ui/button";
import { Discord } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Support</h1>
      <p className="text-gray-400 mb-4">
        Rejoignez notre communauté Discord pour obtenir de l'aide en temps réel.
      </p>
      <a 
        href="https://discord.com/invite/UfnBUHXbDV" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Button className="w-full">
          <Discord className="w-5 h-5 mr-2" />
          Rejoindre Discord
        </Button>
      </a>
    </div>
  );
};

export default Support;
