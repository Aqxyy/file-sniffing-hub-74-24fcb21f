import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, ArrowLeft } from "lucide-react";
import NavButtons from "@/components/NavButtons";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavButtons />
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="text-white mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Centre d'aide</h1>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="item-1" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400">
                Comment utiliser la recherche ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Entrez simplement votre mot-clé dans la barre de recherche et cliquez sur "Rechercher". Les résultats s'afficheront en dessous.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400">
                Je ne vois pas les résultats complets
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Les résultats complets sont disponibles uniquement avec un abonnement. Rendez-vous sur la page "Product" pour voir nos offres.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400">
                Comment accéder à l'API ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                L'API est disponible uniquement avec l'abonnement Pro. Une fois abonné, vous pourrez accéder à la documentation de l'API dans l'onglet API.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-gray-800/50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-300 mb-6">Rejoignez notre communauté Discord pour obtenir de l'aide en direct</p>
            <Button 
              variant="outline"
              className="bg-blue-900 text-white hover:bg-blue-800"
              onClick={() => window.open("https://discord.gg/UfnBUHXbDV", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Rejoindre Discord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;