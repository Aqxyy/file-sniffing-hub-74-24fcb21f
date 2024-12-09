import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "@/components/support/FeedbackForm";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="text-white mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Support</h1>
          <p className="text-gray-300 text-lg">
            Besoin d'aide ? Nous sommes là pour vous.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Contactez-nous</h2>
            <p className="text-gray-300 mb-4">
              Rejoignez notre communauté Discord pour obtenir de l'aide en temps réel.
            </p>
            <a 
              href="https://discord.gg/your-discord-link" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-[#5865F2] hover:bg-[#4752C4]">
                Rejoindre Discord
              </Button>
            </a>
          </div>

          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default Support;