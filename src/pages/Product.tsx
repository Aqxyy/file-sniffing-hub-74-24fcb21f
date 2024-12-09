import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Product = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-8">Nos offres</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Standard</h2>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li>✓ Accès à la recherche avancée</li>
            <li>✓ Support communautaire</li>
            <li>✓ Mises à jour régulières</li>
          </ul>
          <div className="text-3xl font-bold text-white mb-6">29€/mois</div>
          <Button className="w-full">Souscrire</Button>
        </Card>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Premium</h2>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li>✓ Tout ce qui est inclus dans Standard</li>
            <li>✓ Accès à l'API</li>
            <li>✓ Support prioritaire</li>
          </ul>
          <div className="text-3xl font-bold text-white mb-6">49€/mois</div>
          <Button className="w-full">Souscrire</Button>
        </Card>
      </div>

      <div className="text-center mt-12 text-gray-400">
        Besoin d'une solution personnalisée ?{" "}
        <a 
          href="https://discord.com/invite/UfnBUHXbDV" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
};

export default Product;